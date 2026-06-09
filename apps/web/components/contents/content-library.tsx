"use client";

import { useCallback, useEffect, useState } from "react";
import { Edit3, Loader2, Send, Trash2 } from "lucide-react";
import { contents as contentsApi, Content } from "@/lib/api";

export function ContentLibrary() {
  const [items, setItems] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchContents = useCallback(async () => {
    try {
      setLoading(true);
      const list = await contentsApi.list();
      setItems(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load contents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  async function publish(id: string) {
    try {
      const updated = await contentsApi.update(id, { status: "published" });
      setItems((current) =>
        current.map((item) => (item.id === id ? updated : item))
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to publish");
    }
  }

  async function remove(id: string) {
    try {
      await contentsApi.delete(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim()) return;
    try {
      const updated = await contentsApi.update(id, { title: editTitle.trim() });
      setItems((current) =>
        current.map((item) => (item.id === id ? updated : item))
      );
      setEditingId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  }

  if (loading) {
    return (
      <section className="flex items-center justify-center border border-gray-300 bg-white py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </section>
    );
  }

  return (
    <section className="border border-gray-300 bg-white">
      <div className="grid border-b border-gray-300 p-4 mono-label text-gray-500 md:grid-cols-[130px_120px_1fr_100px_110px_155px]">
        <span>ID</span>
        <span>Platform</span>
        <span>Content</span>
        <span>Tone</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      {error && (
        <div className="border-b border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
          <button onClick={() => setError("")} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="p-16 text-center">
          <p className="text-3xl font-medium tracking-tight">No content yet.</p>
          <p className="mt-3 text-sm text-gray-500">去生成页创建新的营销内容。</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <article
              key={item.id}
              className="grid gap-4 p-4 md:grid-cols-[130px_120px_1fr_100px_110px_155px] md:items-start"
            >
              <p className="mono-label text-gray-500">{item.display_id}</p>
              <p className="text-sm font-medium">{item.platform_display_name}</p>
              <div>
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 border border-black bg-white px-3 py-2 text-sm outline-none"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(item.id)}
                    />
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="bg-black px-3 py-2 text-sm text-white"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-xl font-medium">{item.title}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                      {item.body.slice(0, 120)}...
                    </p>
                  </>
                )}
              </div>
              <p className="text-sm capitalize">{item.tone}</p>
              <p className="text-sm">
                <span
                  className={
                    item.status === "published"
                      ? "text-green-700"
                      : item.status === "review"
                      ? "text-yellow-700"
                      : "text-gray-500"
                  }
                >
                  {item.status}
                </span>
              </p>
              <div className="flex gap-2">
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
                  onClick={() => publish(item.id)}
                  className="grid h-10 w-10 place-items-center border border-gray-300 transition hover:bg-black hover:text-white"
                  aria-label="Publish"
                >
                  <Send className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="grid h-10 w-10 place-items-center border border-gray-300 transition hover:bg-black hover:text-white"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
