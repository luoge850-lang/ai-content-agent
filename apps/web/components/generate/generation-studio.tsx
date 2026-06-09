"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Copy, ImageIcon, Loader2, Plus, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generate, projects as projectsApi, contents as contentsApi, Project } from "@/lib/api";
import { cn } from "@/lib/utils";

const PLATFORMS = ["小红书", "抖音", "公众号", "微博"] as const;
const TONES = ["专业", "幽默", "煽情"] as const;

const PLATFORM_SLUGS: Record<string, string> = {
  "小红书": "xiaohongshu",
  "抖音": "douyin",
  "公众号": "gongzhonghao",
  "微博": "weibo",
};

export function GenerationStudio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [platform, setPlatform] = useState<string>("小红书");
  const [tone, setTone] = useState<string>("专业");
  const [description, setDescription] = useState(
    "一款面向通勤人群的便携咖啡机，30 秒萃取，重量低于 600g，适合办公室和露营。"
  );
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [generated, setGenerated] = useState("");
  const [statusText, setStatusText] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const list = await projectsApi.list();
      setProjects(list);
      if (list.length > 0 && !selectedProjectId) {
        setSelectedProjectId(list[0].id);
      }
    } catch {
      // silently fail
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchProjects();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const proj = await projectsApi.create({ name: newProjectName.trim() });
      setProjects((prev) => [proj, ...prev]);
      setSelectedProjectId(proj.id);
      setNewProjectName("");
      setShowNewProject(false);
      toast.success("Project created.");
    } catch {
      toast.error("Failed to create project.");
    }
  };

  const platformHint = useMemo(() => {
    const hints: Record<string, string> = {
      "小红书": "标题 + 正文 + 话题标签，适合收藏和种草。",
      "抖音": "15 秒脚本 + 分镜节奏 + 口播钩子。",
      "公众号": "长文大纲 + 开头故事 + 转化段落。",
      "微博": "短文案 + 热点表达 + 互动问题。",
    };
    return hints[platform];
  }, [platform]);

  async function startPolling(contentId: string) {
    if (pollingRef.current) clearInterval(pollingRef.current);

    setPolling(true);
    setStatusText("AI is thinking...");

    pollingRef.current = setInterval(async () => {
      try {
        const content = await contentsApi.get(contentId);
        if (content.generation_status === "completed") {
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
          setPolling(false);
          setStatusText("");
          setGenerated(
            `【${content.platform_display_name} / ${content.tone}】\n标题：${content.title}\n\n正文：\n${content.body}\n\n配图 Prompt：\n${content.image_prompt}\n\n---\nID: ${content.display_id} | Status: ${content.generation_status}`
          );
          setLoading(false);
          toast.success("AI generation complete!");
        } else if (content.generation_status === "failed") {
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
          setPolling(false);
          setStatusText("");
          setLoading(false);
          toast.error("Generation failed. Please try again.");
        }
      } catch {
        // Will retry on next interval
      }
    }, 1500);
  }

  async function handleGenerate() {
    if (!selectedProjectId) {
      toast.error("Please select or create a project first.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a product description.");
      return;
    }

    setLoading(true);
    setPolling(false);
    setGenerated("");
    setStatusText("");

    try {
      const result = await generate.create({
        project_id: selectedProjectId,
        platform_slug: PLATFORM_SLUGS[platform] || "xiaohongshu",
        tone,
        product_description: description,
      });

      if (result.generation_status === "processing") {
        // Async mode — start polling
        startPolling(result.content_id);
      } else {
        // Sync fallback — show result immediately
        setGenerated(
          `【${result.platform_slug} / ${result.tone}】\n标题：${result.title}\n\n正文：\n${result.body}\n\n配图 Prompt：\n${result.image_prompt}\n\n---\nID: ${result.display_id} | Model: ${result.model} | Tokens: ${result.tokens_used}`
        );
        setLoading(false);
        toast.success("Content generated!");
      }
    } catch {
      toast.error("Generation failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="border border-gray-300 bg-white p-6">
        <p className="mono-label text-gray-500">Input</p>
        <div className="mt-8 space-y-8">
          {/* Project selector */}
          <div>
            <label className="mono-label text-gray-500">Project</label>
            {showNewProject ? (
              <div className="mt-3 flex gap-2">
                <input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="New project name..."
                  className="flex-1 border border-black bg-white px-4 py-3 text-sm outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                />
                <button
                  onClick={handleCreateProject}
                  className="bg-black px-4 py-3 text-sm font-medium text-white"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowNewProject(false)}
                  className="border border-gray-300 px-4 py-3 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="flex-1 border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                >
                  {projects.length === 0 && (
                    <option value="">No projects yet — create one</option>
                  )}
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.status})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewProject(true)}
                  className="grid h-12 w-12 place-items-center border border-gray-300 transition hover:bg-black hover:text-white"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="mono-label text-gray-500">Platform</label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {PLATFORMS.map((item) => (
                <button
                  key={item}
                  onClick={() => setPlatform(item)}
                  className={cn(
                    "border px-4 py-4 text-left text-sm transition",
                    platform === item
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-[#fcfcfc] hover:border-black"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mono-label text-gray-500">Tone</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {TONES.map((item) => (
                <button
                  key={item}
                  onClick={() => setTone(item)}
                  className={cn(
                    "rounded-full border px-5 py-2 text-sm transition",
                    tone === item
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white hover:border-black"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mono-label text-gray-500">Product Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-3 min-h-48 w-full resize-none border border-gray-300 bg-[#fcfcfc] p-4 text-sm leading-7 outline-none transition focus:border-black"
            />
          </div>

          <div className="border border-gray-300 bg-[#f6f6f3] p-4">
            <p className="mono-label text-gray-500">Platform Rule</p>
            <p className="mt-3 text-sm leading-6 text-gray-700">{platformHint}</p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="inline-flex w-full items-center justify-center gap-3 bg-black px-5 py-4 text-sm font-medium text-white transition hover:shadow-editorial disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {polling ? "AI Generating..." : "Submitting..."}
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Content
              </>
            )}
          </button>
        </div>
      </section>

      <section className="border border-gray-300 bg-[#111] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="mono-label text-gray-500">Output</p>
            <h2 className="mt-3 text-4xl font-medium tracking-tight">Campaign draft</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (generated) {
                  navigator.clipboard.writeText(generated);
                  toast.success("Copied to clipboard!");
                }
              }}
              className="grid h-11 w-11 place-items-center border border-gray-700 transition hover:bg-white hover:text-black"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button className="grid h-11 w-11 place-items-center border border-gray-700 transition hover:bg-white hover:text-black">
              <ImageIcon className="h-4 w-4" />
            </button>
            <button className="grid h-11 w-11 place-items-center border border-gray-700 transition hover:bg-white hover:text-black">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 min-h-[520px] border border-gray-800 bg-[#0a0a0a] p-6">
          {loading ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                {statusText || "Submitting generation request..."}
              </p>
              {[1, 2, 3, 4, 5].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0.25 }}
                  animate={{ opacity: [0.25, 0.7, 0.25] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: item * 0.08 }}
                  className="h-5 bg-white/15"
                  style={{ width: `${96 - item * 9}%` }}
                />
              ))}
              {polling && (
                <p className="mt-4 text-xs text-gray-500">
                  DeepSeek is generating... this usually takes 3-10 seconds.
                </p>
              )}
            </div>
          ) : generated ? (
            <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-100">{generated}</pre>
          ) : (
            <div className="flex h-[460px] flex-col items-center justify-center text-center">
              <Sparkles className="h-10 w-10 text-gray-500" />
              <p className="mt-5 text-2xl font-medium">Ready for generation.</p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                选择项目、平台和产品描述后，AI 将生成平台优化的营销文案和配图方向。
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
