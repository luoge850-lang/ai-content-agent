"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Edit3,
  Eye,
  Heart,
  ImageIcon,
  Loader2,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/dashboard/app-shell";
import { fadeUp, stagger } from "@/components/shared/motion-presets";
import { contents as contentsApi, Content } from "@/lib/api";

const STATUS_BADGE: Record<string, string> = {
  published: "border-green-200 bg-green-50 text-green-700",
  review: "border-yellow-200 bg-yellow-50 text-yellow-700",
  draft: "border-gray-200 bg-gray-50 text-gray-600",
};

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const fetchItem = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contentsApi.get(id);
      setItem(data);
      setEditTitle(data.title);
      setEditBody(data.body);
    } catch {
      toast.error("Content not found.");
      router.push("/contents");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  async function handlePublish() {
    if (!item) return;
    try {
      const updated = await contentsApi.update(item.id, {
        status: "published",
      });
      setItem(updated);
      toast.success("Published!");
    } catch {
      toast.error("Failed to publish.");
    }
  }

  async function handleDelete() {
    if (!item) return;
    try {
      await contentsApi.delete(item.id);
      toast.success("Content deleted.");
      router.push("/contents");
    } catch {
      toast.error("Failed to delete.");
    }
  }

  async function handleSaveEdit() {
    if (!item || !editTitle.trim()) return;
    try {
      const updated = await contentsApi.update(item.id, {
        title: editTitle.trim(),
        body: editBody,
      });
      setItem(updated);
      setEditing(false);
      toast.success("Content updated.");
    } catch {
      toast.error("Failed to save.");
    }
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-32"
          >
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </motion.div>
        ) : !item ? null : (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top bar */}
            <motion.div
              variants={fadeUp}
              className="mb-8 flex items-center justify-between"
            >
              <Link
                href="/contents"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Library
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePublish}
                  disabled={item.status === "published"}
                  className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm transition hover:border-black hover:bg-black hover:text-white disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                  {item.status === "published" ? "Marked Published" : "Mark as Published"}
                </button>
                <button
                  onClick={() => {
                    setEditing(!editing);
                    setEditTitle(item.title);
                    setEditBody(item.body);
                  }}
                  className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm transition hover:border-black hover:bg-black hover:text-white"
                >
                  <Edit3 className="h-4 w-4" />
                  {editing ? "Cancel Edit" : "Edit"}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 border border-red-200 px-4 py-2 text-sm text-red-600 transition hover:border-red-400 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </motion.div>

            {/* Editorial split layout */}
            <div className="grid gap-3 xl:grid-cols-[1.3fr_0.7fr]">
              {/* Main content — editorial style */}
              <div className="space-y-3">
                {/* Header card */}
                <motion.section
                  initial="initial"
                  animate="animate"
                  variants={stagger}
                  className="border border-gray-300 bg-white p-8 md:p-12"
                >
                  <motion.div variants={fadeUp} className="flex items-center gap-3">
                    <span className="mono-label text-gray-400">
                      {item.display_id}
                    </span>
                    <span
                      className={`inline-block rounded-full border px-3 py-0.5 text-xs font-medium ${STATUS_BADGE[item.status]}`}
                    >
                      {item.status}
                    </span>
                    {item.generation_status === "processing" && (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Generating...
                      </span>
                    )}
                  </motion.div>

                  {editing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 space-y-4"
                    >
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full border border-black bg-white px-4 py-3 text-2xl font-medium outline-none"
                        autoFocus
                      />
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        className="min-h-64 w-full resize-none border border-gray-300 bg-white p-4 text-sm leading-7 outline-none focus:border-black"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="bg-black px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-editorial"
                      >
                        Save Changes
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <motion.h1
                        variants={fadeUp}
                        className="mt-6 text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-[1.15] tracking-tight"
                      >
                        {item.title}
                      </motion.h1>
                      <motion.div
                        variants={fadeUp}
                        className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500"
                      >
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {item.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {item.likes.toLocaleString()} likes
                        </span>
                        <span>{item.platform_display_name}</span>
                        <span>·</span>
                        <span>{item.tone}</span>
                      </motion.div>

                      {/* Editorial body */}
                      <motion.div
                        variants={fadeUp}
                        className="mt-10 max-w-none"
                      >
                        <article className="prose prose-lg leading-relaxed text-gray-800 whitespace-pre-wrap font-sans text-[15px]">
                          {item.body}
                        </article>
                      </motion.div>

                      {/* Generation badge */}
                      {item.generation_status === "completed" && (
                        <>
                          <motion.p
                            variants={fadeUp}
                            className="mt-10 text-xs text-gray-400"
                          >
                            AI-generated with DeepSeek · Please review before publishing ·{" "}
                            {new Date(item.created_at).toLocaleDateString(
                              "zh-CN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </motion.p>
                        </>
                      )}
                    </>
                  )}
                </motion.section>

                {/* Copy button */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-2"
                >
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `标题：${item.title}\n\n正文：\n${item.body}`
                      );
                      toast.success("Copied to clipboard!");
                    }}
                    className="flex items-center gap-2 border border-gray-300 bg-white px-5 py-3 text-sm transition hover:border-black hover:bg-black hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Full Content
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.image_prompt);
                      toast.success("Image prompt copied!");
                    }}
                    className="flex items-center gap-2 border border-gray-300 bg-white px-5 py-3 text-sm transition hover:border-black hover:bg-black hover:text-white"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Copy Image Prompt
                  </button>
                </motion.div>
              </div>

              {/* Sidebar — image prompt + metadata */}
              <div className="space-y-3">
                {/* Image prompt card — dark editorial */}
                <motion.section
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden border border-gray-300 bg-[#111] p-8 text-white"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    <p className="mono-label text-gray-500">Image Prompt</p>
                  </div>
                  <p className="mt-2 text-[10px] text-gray-600">
                    AI-generated image prompt — not an actual image. Use with DALL-E, Midjourney, or Stable Diffusion.
                  </p>
                  <p className="mt-6 text-sm leading-7 text-gray-300">
                    {item.image_prompt || "No image prompt generated."}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.image_prompt);
                      toast.success("Image prompt copied!");
                    }}
                    className="mt-6 flex items-center gap-2 border border-gray-700 px-4 py-2 text-xs text-gray-400 transition hover:border-white hover:text-white"
                  >
                    <Copy className="h-3 w-3" />
                    Copy Prompt
                  </button>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-white/5 blur-3xl"
                  />
                </motion.section>

                {/* Metadata card */}
                <motion.section
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="border border-gray-300 bg-white p-8"
                >
                  <p className="mono-label text-gray-500">Metadata</p>
                  <div className="mt-6 space-y-4 text-sm">
                    {[
                      ["Display ID", item.display_id],
                      ["Platform", item.platform_display_name],
                      ["Tone", item.tone],
                      ["Status", item.status],
                      ["Generation", item.generation_status],
                      ["Views", item.views.toLocaleString()],
                      ["Likes", item.likes.toLocaleString()],
                      ["Conversion", `${item.conversion}%`],
                      [
                        "Created",
                        new Date(item.created_at).toLocaleDateString("zh-CN"),
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between border-b border-gray-100 pb-2"
                      >
                        <span className="text-gray-500">{label}</span>
                        <span className="font-medium capitalize">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* Quick actions */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="border border-gray-300 bg-white p-6"
                >
                  <p className="mono-label text-gray-500">Quick Actions</p>
                  <div className="mt-4 space-y-2">
                    <Link
                      href="/generate"
                      className="flex items-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-editorial"
                    >
                      <Sparkles className="h-4 w-4" />
                      Generate More
                    </Link>
                    <Link
                      href="/contents"
                      className="flex items-center gap-2 border border-gray-300 px-4 py-3 text-sm text-gray-600 transition hover:border-black hover:text-black"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Library
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
