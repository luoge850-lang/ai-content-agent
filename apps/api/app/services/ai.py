"""AI content generation — DeepSeek (OpenAI-compatible) integration.

Uses the openai Python SDK pointed at DeepSeek's API endpoint.
DeepSeek offers a generous free tier and excels at Chinese content.
API key is read from AI_API_KEY in .env (git-ignored).
To switch to OpenAI, change AI_BASE_URL to https://api.openai.com/v1.
"""

import json
import time
from typing import Any

from app.config import settings


def _get_client():
    """Return an AsyncOpenAI client pointed at DeepSeek (or custom base URL).

    Returns None if no API key is configured — the caller falls back to mock.
    """
    if not settings.ai_api_key:
        return None
    from openai import AsyncOpenAI

    return AsyncOpenAI(
        api_key=settings.ai_api_key,
        base_url=settings.ai_base_url,
    )


# Platform-specific formatting rules injected into the system prompt.
PLATFORM_RULES: dict[str, str] = {
    "xiaohongshu": (
        "小红书 (Xiaohongshu / RED): "
        "Title must include emoji and keywords for discovery. "
        "Body should be a 种草 (product recommendation) post written in first-person, "
        "with line breaks between short paragraphs, ending with 3-5 hashtags. "
        "image_prompt: clean lifestyle flat-lay aesthetic, soft natural light, 3:4 aspect."
    ),
    "douyin": (
        "抖音 (Douyin / TikTok CN): "
        "Title should be a short, provocative hook (under 25 characters). "
        "Body is a 15-30 second video script: hook line → key selling points → CTA. "
        "Use colloquial expressions (家人们, 真的绝了, etc.). "
        "image_prompt: dynamic vertical video thumbnail style, bold text-ready, 9:16."
    ),
    "gongzhonghao": (
        "公众号 (WeChat Official Account): "
        "Title: editorial, listicle or how-to format, under 30 characters. "
        "Body: long-form article with markdown headings (##), an opening hook story, "
        "2-3 analysis sections, and a summary with a conversion CTA. "
        "image_prompt: professional editorial hero image, clean typography, 16:9."
    ),
    "weibo": (
        "微博 (Weibo): "
        "Title should feel like a hot-take or trending topic (under 20 characters). "
        "Body: short punchy thread, every sentence earns its line break, "
        "end with an engagement question and a 转发 (repost) ask. "
        "image_prompt: social infographic or bold quote-card style, 3:4."
    ),
}

TONE_RULES: dict[str, str] = {
    "专业": (
        "Tone = 专业 (Professional): Authoritative, precise, data-aware. "
        "Use industry terminology, cite plausible figures, avoid slang."
    ),
    "幽默": (
        "Tone = 幽默 (Humorous): Witty, self-deprecating, relatable. "
        "Use internet slang sparingly, embed jokes that feel natural."
    ),
    "煽情": (
        "Tone = 煽情 (Emotional): Story-driven, empathetic, warm. "
        "Open with a mini-story, use sensory language, build emotional resonance."
    ),
}

SYSTEM_PROMPT = """\
You are a senior Chinese social-media content strategist. You write high-performing, platform-native copy for 小红书, 抖音, 公众号, and 微博.

{platform_rule}

{tone_rule}

IMPORTANT — output ONLY a single JSON object (no markdown, no code fences) with these exact keys:
{{
  "title": "string — the headline optimized for this platform",
  "body": "string — the full post body / script, with line breaks",
  "image_prompt": "string — a detailed AI image-generation prompt in English describing the visual"
}}
"""


def _build_system_prompt(platform_slug: str, tone: str, knowledge_ctx: str = "") -> str:
    platform_rule = PLATFORM_RULES.get(platform_slug, PLATFORM_RULES["xiaohongshu"])
    tone_rule = TONE_RULES.get(tone, TONE_RULES["专业"])
    prompt = SYSTEM_PROMPT.format(platform_rule=platform_rule, tone_rule=tone_rule)
    if knowledge_ctx:
        prompt += f"\n\nBRAND & PRODUCT KNOWLEDGE (use this context to write more accurate, on-brand copy):\n{knowledge_ctx}"
    return prompt


def _build_user_message(product_desc: str, audience: str) -> str:
    audience_text = audience or "通用人群"
    return (
        f"产品描述：{product_desc or '一款高品质消费产品'}\n"
        f"目标受众：{audience_text}\n\n"
        f"请为以上产品和受众生成内容。"
    )


def _parse_response(text: str) -> tuple[str, str, str]:
    """Extract title, body, image_prompt from the model's JSON response.

    Handles models that wrap JSON in markdown fences or add trailing text.
    """
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[-1] if "\n" in cleaned else cleaned[3:]
        if cleaned.rstrip().endswith("```"):
            cleaned = cleaned.rstrip()[:-3]
        cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
        return (
            data.get("title", ""),
            data.get("body", ""),
            data.get("image_prompt", ""),
        )
    except json.JSONDecodeError:
        import re

        match = re.search(r"\{[^{}]*\"title\"[^{}]*\}", text, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group())
                return (
                    data.get("title", ""),
                    data.get("body", ""),
                    data.get("image_prompt", ""),
                )
            except json.JSONDecodeError:
                pass

    return "", text, ""


async def generate_ai(
    platform_slug: str,
    tone: str,
    product_desc: str,
    audience: str,
    knowledge_ctx: str = "",
) -> tuple[str, str, str, str, int, int]:
    """Call DeepSeek (or configured AI provider) to generate content.

    Returns (title, body, image_prompt, model_name, tokens_used, duration_ms).

    Falls back to mock templates when no AI_API_KEY is configured.
    """
    client = _get_client()

    if client is None:
        return _mock_fallback(platform_slug, tone, product_desc, audience)

    system_prompt = _build_system_prompt(platform_slug, tone, knowledge_ctx)
    user_message = _build_user_message(product_desc, audience)

    model = settings.ai_model or "gpt-4o"

    try:
        start = time.monotonic()
        response = await client.chat.completions.create(
            model=model,
            max_tokens=2048,
            temperature=0.85,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
        )
        duration_ms = int((time.monotonic() - start) * 1000)
    except Exception as exc:
        # Graceful fallback: log the error and return mock content.
        # Common causes: 429 (quota), 401 (bad key), network errors.
        import logging

        logger = logging.getLogger("ai")
        logger.warning("OpenAI API call failed, falling back to mock: %s", exc)
        return _mock_fallback(platform_slug, tone, product_desc, audience)

    text = response.choices[0].message.content if response.choices else ""
    tokens_used = (
        getattr(response.usage, "prompt_tokens", 0)
        + getattr(response.usage, "completion_tokens", 0)
    )

    title, body, image_prompt = _parse_response(text or "")

    return title, body, image_prompt, response.model, tokens_used, duration_ms


def _mock_fallback(
    platform_slug: str, tone: str, product_desc: str, audience: str
) -> tuple[str, str, str, str, int, int]:
    """Template-based fallback when no AI key is available."""
    product = product_desc or "护肤精华"
    audience_text = audience or "25-35岁通勤女性"

    templates: dict[str, dict[str, Any]] = {
        "xiaohongshu": {
            "title": f"✨ {product}测评｜{audience_text}必入的宝藏单品",
            "body": (
                f"姐妹们！今天来分享我最近发现的宝藏{product}💎\n\n"
                f"作为一个{audience_text}，我真的超爱这款！\n\n"
                f"🌟 成分温和不刺激\n"
                f"🌟 质地轻薄好吸收\n"
                f"🌟 性价比超高\n\n"
                f"已经用了两周啦，皮肤状态真的肉眼可见变好了！\n"
                f"姐妹们冲就完了 🏃‍♀️💨\n\n"
                f"#好物分享 #{product} #护肤心得"
            ),
            "image_prompt": (
                f"Clean beauty flat lay of {product} on marble surface, "
                f"minimalist aesthetic, soft natural lighting, xiaohongshu style, "
                f"8k resolution --ar 3:4"
            ),
        },
        "douyin": {
            "title": f"🔥 {product}到底值不值得买？实测告诉你！",
            "body": (
                f"家人们！今天实测{product}！\n\n"
                f"先说结论：值得入！💯\n\n"
                f"适合人群：{audience_text}\n\n"
                f"3个必入理由：\n"
                f"1️⃣ 成分党狂喜\n"
                f"2️⃣ 效果看得见\n"
                f"3️⃣ 价格真香\n\n"
                f"评论区扣1，抽3位家人送试用装！🎁"
            ),
            "image_prompt": (
                f"Dynamic video thumbnail of {product}, bold text overlay, "
                f"vibrant colors, douyin style, vertical 9:16 --ar 9:16"
            ),
        },
        "gongzhonghao": {
            "title": f"深度解析 | {product}如何成为{audience_text}的首选",
            "body": (
                f"在当下的市场，{product}正逐渐成为{audience_text}的热门选择。\n\n"
                f"本文将深入分析这款产品的核心优势和使用体验。\n\n"
                f"## 核心优势解析\n\n"
                f"产品采用多重活性成分组合……\n\n"
                f"## 使用场景分析\n\n"
                f"对于{audience_text}而言，日常通勤、约会聚会等场景均可使用。\n\n"
                f"## 总结\n\n"
                f"综合来看，{product}是一款值得推荐的产品。"
            ),
            "image_prompt": (
                f"Professional product photography of {product}, "
                f"clean white background, magazine editorial style, "
                f"wechat official account header --ar 16:9"
            ),
        },
        "weibo": {
            "title": f"💡 {product}测评｜{audience_text}的真实使用感受",
            "body": (
                f"【新品测评】{product}到底好不好用？\n\n"
                f"作为{audience_text}，用了一周后来交作业 📝\n\n"
                f"总结：可入 ✅\n"
                f"具体感受看长图 👇\n\n"
                f"转发+关注，揪一位送同款 🔄"
            ),
            "image_prompt": (
                f"Social media infographic style, {product} review summary, "
                f"weibo long-image format, clean typography --ar 3:4"
            ),
        },
    }

    if platform_slug in templates:
        t = templates[platform_slug]
        return t["title"], t["body"], t["image_prompt"], "mock-v0", 0, 0

    return (
        f"{product} - {tone}",
        f"产品描述：{product}\n目标受众：{audience_text}",
        "",
        "mock-v0",
        0,
        0,
    )
