"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Edit3,
  FileText,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { fadeUp, stagger } from "@/components/shared/motion-presets";
import { projects as projectsApi, contents as contentsApi, Project, Content } from "@/lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectContents, setProjectContents] = useState<
    Record<string, Content[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const list = await projectsApi.list();
      setProjects(list);
      // Fetch contents for each project
      const pc: Record<string, Content[]> = {};
      for (const p of list) {
        try {
          pc[p.id] = await contentsApi.list({ project_id: p.id });
        } catch {
          pc[p.id] = [];
        }
      }
      setProjectContents(pc);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleCreate() {
    if (!newName.trim()) return;
    try {
      const p = await projectsApi.create({
        name: newName.trim(),
        product_description: newDesc.trim(),
      });
      setProjects((prev) => [p, ...prev]);
      setProjectContents((prev) => ({ ...prev, [p.id]: [] }));
      setNewName("");
      setNewDesc("");
      setCreating(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create project");
    }
  }

  async function handleDelete(id: string) {
    try {
      await projectsApi.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  async function handleSaveEdit(id: string) {
    if (!editName.trim()) return;
    try {
      const updated = await projectsApi.update(id, { name: editName.trim() });
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  }

  return (
    <AppShell>
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <motion.div variants={fadeUp}>
          <p className="mono-label text-gray-400">[ 05 ]</p>
          <h1 className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] tracking-tight">
            Project
            <br />
            management.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
            Organize content by campaign — each project groups related assets
            and tracks performance as a unit.
          </p>
        </motion.div>

        {/* Create / Error */}
        <motion.div variants={fadeUp} className="mt-10">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 border border-red-200 bg-red-50 p-4 text-sm text-red-600"
              >
                {error}
                <button
                  onClick={() => setError("")}
                  className="ml-3 underline hover:no-underline"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {creating ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-black bg-white p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Project name..."
                  className="flex-1 border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  autoFocus
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleCreate()
                  }
                />
                <input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Product description (optional)..."
                  className="flex-[2] border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleCreate()
                  }
                />
                <button
                  onClick={handleCreate}
                  className="bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-80"
                >
                  Create
                </button>
                <button
                  onClick={() => setCreating(false)}
                  className="border border-gray-300 px-6 py-3 text-sm transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 border border-black bg-black px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-editorial"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
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
          ) : projects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-col items-center border border-gray-300 bg-white py-24 text-center"
            >
              <Briefcase className="h-12 w-12 text-gray-300" />
              <p className="mt-6 text-3xl font-medium tracking-tight text-gray-400">
                No projects yet.
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">
                Create a project to organize your content by campaign.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="loaded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3"
            >
              {projects.map((project, index) => {
                const contents = projectContents[project.id] || [];
                return (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group relative overflow-hidden border border-gray-300 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-editorial"
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
                      <span className="inline-block rounded-full border border-gray-200 px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
                        {project.status}
                      </span>
                      <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setEditingId(project.id);
                            setEditName(project.name);
                          }}
                          className="grid h-8 w-8 place-items-center border border-gray-300 hover:bg-black hover:text-white"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="grid h-8 w-8 place-items-center border border-gray-300 hover:bg-black hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {editingId === project.id ? (
                      <div className="mt-4 flex gap-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 border border-black px-3 py-2 text-sm outline-none"
                          autoFocus
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSaveEdit(project.id)
                          }
                        />
                        <button
                          onClick={() => handleSaveEdit(project.id)}
                          className="bg-black px-3 py-2 text-sm text-white"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <h2 className="mt-4 text-2xl font-medium tracking-tight">
                        {project.name}
                      </h2>
                    )}

                    {project.product_description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
                        {project.product_description}
                      </p>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileText className="h-4 w-4" />
                        {contents.length} contents
                      </div>
                      <Link
                        href={`/generate`}
                        className="mono-label inline-flex items-center gap-1 text-gray-600 hover:text-black hover:underline"
                      >
                        Generate
                        <Sparkles className="h-3.5 w-3.5" />
                      </Link>
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
