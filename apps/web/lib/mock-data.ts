import {
  BarChart3,
  BookOpen,
  Briefcase,
  Brush,
  CalendarClock,
  FileText,
  Megaphone,
  PenLine,
  Radio,
  Send,
  Settings,
  Sparkles
} from "lucide-react";

export const platforms = ["小红书", "抖音", "公众号", "微博"] as const;
export const tones = ["专业", "幽默", "煽情"] as const;

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/generate", label: "Generate", icon: Sparkles },
  { href: "/contents", label: "Library", icon: FileText },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/analytics", label: "Analytics", icon: Radio },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const landingPills = [
  { label: "Copywriting", icon: PenLine },
  { label: "Visual Prompt", icon: Brush },
  { label: "Scheduling", icon: CalendarClock },
  { label: "Publishing", icon: Send },
  { label: "Playbooks", icon: BookOpen }
];

export const generatedContents = [
  {
    id: "CNT-2048",
    title: "把新品卖点讲成一条小红书爆款笔记",
    platform: "小红书",
    style: "专业",
    status: "待发布",
    views: 48200,
    likes: 6320,
    conversion: "8.4%",
    text: "标题：这款新品真的把通勤效率拉满了。正文：从核心卖点、使用场景到真实体验，内容会被拆成易收藏的 5 个段落，并自动补齐话题标签。"
  },
  {
    id: "CNT-2047",
    title: "15 秒抖音短视频口播脚本",
    platform: "抖音",
    style: "幽默",
    status: "草稿",
    views: 26500,
    likes: 4210,
    conversion: "5.9%",
    text: "开场 3 秒抓住痛点，中段展示对比，结尾用一句强 CTA 引导评论和点击。"
  },
  {
    id: "CNT-2046",
    title: "公众号长文结构与封面文案",
    platform: "公众号",
    style: "煽情",
    status: "已发布",
    views: 90300,
    likes: 11800,
    conversion: "11.2%",
    text: "用品牌故事开场，穿插用户案例，最后落到产品方案和限时转化。"
  }
];

export const analyticsSeries = [
  { platform: "小红书", views: 48, likes: 63, conversion: 84 },
  { platform: "抖音", views: 76, likes: 54, conversion: 59 },
  { platform: "公众号", views: 90, likes: 72, conversion: 92 },
  { platform: "微博", views: 39, likes: 44, conversion: 41 }
];
