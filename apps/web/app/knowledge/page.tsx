"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Building2,
  Loader2,
  Palette,
  Plus,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/dashboard/app-shell";
import { fadeUp, stagger } from "@/components/shared/motion-presets";

const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
    : "";

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: string;
}

const CATEGORIES = [
  { value: "product", label: "Product Info", icon: Briefcase },
  { value: "brand", label: "Brand Voice", icon: Palette },
  { value: "audience", label: "Audience", icon: Users },
  { value: "style", label: "Style Guide", icon: BookOpen },
];

function getToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("access_token") || ""
    : "";
}

async function fetchEntries(): Promise<KnowledgeEntry[]> {
  const res = await fetch(`${API_BASE}/knowledge/`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function createEntry(data: {
  title: string;
  content: string;
  category: string;
}): Promise<KnowledgeEntry> {
  const res = await fetch(`${API_BASE}/knowledge/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
}

async function deleteEntry(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/knowledge/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete");
}

export default function KnowledgePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("product");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setEntries(await fetchEntries());
    } catch {
      toast.error("Failed to load knowledge base.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate() {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await createEntry({
        title: title.trim(),
        content: content.trim(),
        category,
      });
      setTitle("");
      setContent("");
      setShowNew(false);
      toast.success("Knowledge entry added!");
      load();
    } catch {
      toast.error("Failed to create entry.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Entry deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  }

  return (
    <AppShell>
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <motion.div variants={fadeUp}>
          <p className="mono-label text-gray-400">[ 06 ]</p>
          <h1 className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] tracking-tight">
            Knowledge
            <br />
            base.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
            Store product info, brand voice, audience insights, and style
            guides. The AI uses this context to generate more accurate,
            on-brand content.
          </p>

          {/* RAG explanation */}
          <div className="mt-6 border border-gray-200 bg-gray-50 p-5 max-w-xl">
            <p className="mono-label text-gray-500 mb-2">How it works</p>
            <p className="text-sm leading-relaxed text-gray-700">
              Knowledge entries are injected into the system prompt to simulate a
              lightweight <strong>RAG-style brand memory</strong> mechanism. When
              you generate content, all your knowledge entries are formatted and
              appended to the AI&apos;s system prompt, helping it write more accurate,
              on-brand copy that matches your product, brand voice, target audience,
              and style preferences.
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10">
          {!showNew ? (
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-2 border border-black bg-black px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-editorial"
            >
              <Plus className="h-4 w-4" />
              Add Knowledge Entry
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-black bg-white p-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title (e.g. Product Ingredients)"
                    className="flex-1 border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                    autoFocus
                  />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Content (e.g. Our product uses natural ingredients, is cruelty-free...)"
                  className="min-h-32 w-full resize-none border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    disabled={saving || !title.trim() || !content.trim()}
                    className="inline-flex items-center gap-2 bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-80 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save Entry"
                    )}
                  </button>
                  <button
                    onClick={() => setShowNew(false)}
                    className="border border-gray-300 px-6 py-3 text-sm transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

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
          ) : entries.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-col items-center border border-gray-300 bg-white py-24 text-center"
            >
              <Building2 className="h-12 w-12 text-gray-300" />
              <p className="mt-6 text-3xl font-medium tracking-tight text-gray-400">
                Empty knowledge base.
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">
                Add product details, brand guidelines, and audience profiles.
                The AI will use this context to write better, more accurate
                content that sounds like your brand.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="loaded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3"
            >
              {entries.map((entry, index) => {
                const cat = CATEGORIES.find((c) => c.value === entry.category);
                const CatIcon = cat?.icon || BookOpen;
                return (
                  <motion.article
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group relative overflow-hidden border border-gray-300 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-editorial"
                  >
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[3px] bg-black"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: index * 0.08 + 0.2, duration: 0.5 }}
                      style={{ transformOrigin: "left" }}
                    />
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CatIcon className="h-4 w-4 text-gray-400" />
                        <span className="inline-block rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
                          {cat?.label || entry.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="grid h-8 w-8 place-items-center border border-gray-300 opacity-0 transition hover:bg-black hover:text-white group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <h3 className="mt-4 text-xl font-medium">{entry.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                      {entry.content}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                      <Sparkles className="h-3 w-3" />
                      Used by AI generation
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
}
