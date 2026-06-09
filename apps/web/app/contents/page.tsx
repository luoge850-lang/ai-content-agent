"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Edit3,
  ExternalLink,
  FileText,
  Search,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/dashboard/app-shell";
import { fadeUp, stagger } from "@/components/shared/motion-presets";
import { SkeletonContents } from "@/components/shared/skeleton";
import { contents as contentsApi, Content } from "@/lib/api";

const STATUS_STYLE: Record<string, string> = {
  published: "text-green-700 bg-green-50 border-green-200",
  review: "text-yellow-700 bg-yellow-50 border-yellow-200",
  draft: "text-gray-600 bg-gray-50 border-gray-200",
};

export default function ContentsPage() {
  const [items, setItems] = useState<Content[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchContents = useCallback(async () => {
    try {
      setLoading(true);
      const list = await contentsApi.list();
      setItems(list);
    } catch {
      toast.error("Failed to load contents. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const filtered = useMemo(() => {
    let result = items;
    if (filter !== "all") result = result.filter((i) => i.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.display_id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, filter, search]);

  async function publish(id: string) {
    try {
      const updated = await contentsApi.update(id, { status: "published" });
      setItems((c) => c.map((i) => (i.id === id ? updated : i)));
    } catch {
      toast.error("Failed to publish content.");
    }
  }

  async function remove(id: string) {
    try {
      await contentsApi.delete(id);
      setItems((c) => c.filter((i) => i.id !== id));
      toast.success("Content deleted.");
    } catch {
      toast.error("Failed to delete content.");
    }
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim()) return;
    try {
      const updated = await contentsApi.update(id, {
        title: editTitle.trim(),
      });
      setItems((c) => c.map((i) => (i.id === id ? updated : i)));
      setEditingId(null);
      toast.success("Title updated.");
    } catch {
      toast.error("Failed to update title.");
    }
  }

  return (
    <AppShell>
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <motion.div variants={fadeUp}>
          <p className="mono-label text-gray-400">[ 03 ]</p>
          <h1 className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] tracking-tight">
            Content asset
            <br />
            library.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
            Every generated asset lives here — draft, edit, publish and measure
            performance from a single surface.
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-2">
            {["all", "draft", "review", "published"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-md border px-4 py-2 text-xs font-medium uppercase tracking-wider transition ${
                  filter === s
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:border-black"
                }`}
              >
                {s === "all" ? `All (${items.length})` : s}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or ID..."
              className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-black md:w-64"
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonContents />
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-col items-center border border-gray-300 bg-white py-24 text-center"
            >
              <FileText className="h-12 w-12 text-gray-300" />
              <p className="mt-6 text-3xl font-medium tracking-tight text-gray-400">
                {items.length === 0
                  ? "No content yet."
                  : "Nothing matches."}
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">
                {items.length === 0
                  ? "Head to the Generation Studio to create your first piece of platform-native content."
                  : "Try adjusting the status filter or search query."}
              </p>
              {items.length === 0 && (
                <Link
                  href="/generate"
                  className="mt-6 inline-flex items-center gap-2 bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-editorial"
                >
                  <Sparkles className="h-4 w-4" />
                  Open Studio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="loaded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              {/* Table header */}
              <div className="hidden border border-gray-300 bg-gray-50 px-6 py-3 mono-label text-gray-500 md:grid md:grid-cols-[130px_120px_1fr_100px_110px_155px]">
                <span>ID</span>
                <span>Platform</span>
                <span>Content</span>
                <span>Tone</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              <motion.div initial="initial" animate="animate" variants={stagger}>
                {filtered.map((item) => (
                  <motion.article
                    key={item.id}
                    variants={{
                      initial: { opacity: 0, y: 12 },
                      animate: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="group grid gap-4 border border-t-0 border-gray-300 bg-white px-6 py-5 transition hover:bg-gray-50 md:grid-cols-[130px_120px_1fr_100px_110px_155px] md:items-start cursor-pointer" onClick={() => router.push(`/contents/${item.id}`)}
                  >
                    <p className="mono-label pt-1 text-gray-500">
                      {item.display_id}
                    </p>
                    <p className="pt-1 text-sm font-medium">
                      {item.platform_display_name}
                    </p>
                    <div>
                      {editingId === item.id ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex gap-2"
                        >
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 border border-black bg-white px-3 py-2 text-sm outline-none"
                            autoFocus
                            onKeyDown={(e) =>
                              e.key === "Enter" && saveEdit(item.id)
                            }
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); saveEdit(item.id); }}
                            className="bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-80"
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                            className="border border-gray-300 px-4 py-2 text-sm transition hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </motion.div>
                      ) : (
                        <>
                          <p className="text-lg font-medium">{item.title}</p>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                            {item.body.slice(0, 120)}...
                          </p>
                        </>
                      )}
                    </div>
                    <p className="pt-1 text-sm capitalize text-gray-600">
                      {item.tone}
                    </p>
                    <p className="pt-1">
                      <span
                        className={`inline-block rounded-full border px-3 py-0.5 text-xs font-medium capitalize ${
                          STATUS_STYLE[item.status] || STATUS_STYLE.draft
                        }`}
                      >
                        {item.status}
                      </span>
                    </p>
                    <div className="flex gap-2 pt-0.5">
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditTitle(item.title);
                        }}
                        className="grid h-10 w-10 place-items-center border border-gray-300 transition hover:bg-black hover:text-white"
                        aria-label="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); publish(item.id); }}
                        className="grid h-10 w-10 place-items-center border border-gray-300 transition hover:bg-black hover:text-white"
                        aria-label="Mark as Published"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); remove(item.id); }}
                        className="grid h-10 w-10 place-items-center border border-gray-300 transition hover:bg-black hover:text-white"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              <div className="mt-3 flex items-center justify-between border border-gray-300 bg-white px-6 py-4">
                <p className="mono-label text-gray-500">
                  {filtered.length} of {items.length} assets
                </p>
                <Link
                  href="/generate"
                  className="mono-label inline-flex items-center gap-1 text-gray-600 hover:text-black hover:underline"
                >
                  + New Content
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
}
