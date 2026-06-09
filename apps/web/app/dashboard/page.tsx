"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  FileText,
  Send,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/dashboard/app-shell";
import { fadeUp, stagger } from "@/components/shared/motion-presets";
import { SectionReveal } from "@/components/shared/section-reveal";
import { AnimatedVerticalBar } from "@/components/shared/animated-bars";
import { SkeletonDashboard } from "@/components/shared/skeleton";
import {
  analytics,
  AnalyticsSummary,
  Content,
  contents as contentsApi,
} from "@/lib/api";

function CountUp({ to, duration = 1.2 }: { to: number; duration?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
    >
      {to.toLocaleString()}
    </motion.span>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentContents, setRecentContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [s, c] = await Promise.all([
        analytics.summary(),
        contentsApi.list(),
      ]);
      setSummary(s);
      setRecentContents(c.slice(0, 5));
    } catch {
      toast.error("Failed to load dashboard data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const s = summary;

  const stats = useMemo(
    () => [
      {
        label: "Generated",
        value: s?.total_contents ?? 0,
        icon: Sparkles,
        hint: "total assets",
      },
      {
        label: "Drafts",
        value: recentContents.filter((c) => c.status === "draft").length,
        icon: FileText,
        hint: "in progress",
      },
      {
        label: "Scheduled",
        value: recentContents.filter((c) => c.status === "review").length,
        icon: CalendarClock,
        hint: "queued",
      },
      {
        label: "Published",
        value: recentContents.filter((c) => c.status === "published").length,
        icon: Send,
        hint: "live",
      },
    ],
    [s, recentContents]
  );

  return (
    <AppShell>
      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        className="relative"
      >
        {/* Section header */}
        <motion.div variants={fadeUp}>
          <p className="mono-label text-gray-400">[ 01 ]</p>
          <h1 className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] tracking-tight">
            Campaign command
            <br />
            center.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
            Live data from your content engine. Create, generate, publish, and
            measure — all in one place.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonDashboard />
            </motion.div>
          ) : (
            <motion.div
              key="loaded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stat cards — landing-page stagger */}
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, amount: 0.2 }}
                variants={stagger}
                className="mt-12 grid gap-3 md:grid-cols-4"
              >
                {stats.map((stat, index) => (
                  <motion.article
                    key={stat.label}
                    variants={{
                      initial: { opacity: 0, y: 38, rotateX: 6 },
                      animate: { opacity: 1, y: 0, rotateX: 0 },
                    }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ transformPerspective: 900 }}
                    className="group relative overflow-hidden border border-gray-300 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-editorial"
                  >
                    {/* Top accent bar — reveals on hover */}
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[3px] bg-black"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                      style={{ transformOrigin: "left" }}
                    />
                    <div className="flex items-center justify-between">
                      <p className="mono-label text-gray-500">{stat.label}</p>
                      <stat.icon className="h-5 w-5 text-gray-400 transition duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:text-black" />
                    </div>
                    <p className="mt-10 text-5xl font-medium tracking-tight">
                      <CountUp to={stat.value} />
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-wider text-gray-400">
                      {stat.hint}
                    </p>
                  </motion.article>
                ))}
              </motion.div>

              {/* Creation Studio + Performance Index */}
              <div className="mt-3 grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
                <SectionReveal>
                  <section className="group border border-gray-300 bg-white p-8 transition hover:shadow-editorial">
                    <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="mono-label text-gray-500">
                          Creation Studio
                        </p>
                        <h2 className="mt-2 text-3xl font-medium tracking-tight">
                          Start from one
                          <br />
                          product idea.
                        </h2>
                      </div>
                      <Link
                        href="/generate"
                        className="button-slide-shadow group/link inline-flex items-center gap-2 bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
                      >
                        Generate
                        <ArrowRight className="h-4 w-4 transition group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                    <div className="mt-10 grid gap-3 md:grid-cols-4">
                      {["小红书", "抖音", "公众号", "微博"].map(
                        (platform, index) => (
                          <motion.div
                            key={platform}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{
                              delay: index * 0.08,
                              duration: 0.6,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="relative overflow-hidden border border-gray-200 p-5 transition hover:-translate-y-1 hover:border-black hover:shadow-soft"
                          >
                            <motion.span
                              aria-hidden="true"
                              className="absolute inset-x-0 top-0 h-[2px] bg-black"
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: 1 }}
                              viewport={{ once: false }}
                              transition={{
                                delay: index * 0.12 + 0.2,
                                duration: 0.5,
                              }}
                              style={{ transformOrigin: "left" }}
                            />
                            <p className="mono-label text-gray-500">
                              0{index + 1}
                            </p>
                            <p className="mt-8 text-2xl font-medium">
                              {platform}
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                              {s?.by_platform.find(
                                (p) =>
                                  p.platform_display_name === platform
                              )?.total_contents ?? 0}{" "}
                              items
                            </p>
                          </motion.div>
                        )
                      )}
                    </div>
                  </section>
                </SectionReveal>

                <SectionReveal>
                  <section className="relative overflow-hidden border border-gray-300 bg-[#111] p-8 text-white">
                    <p className="mono-label text-gray-500">
                      Performance Index
                    </p>
                    <div className="mt-10 flex h-56 items-end gap-4">
                      {(s?.by_platform ?? []).map((item, index) => (
                        <div
                          key={item.platform_slug}
                          className="flex flex-1 flex-col items-center gap-3"
                        >
                          <div className="flex h-44 w-full items-end bg-white/5">
                            <AnimatedVerticalBar
                              height={item.total_conversion}
                              className="w-full bg-white transition-colors duration-700 hover:bg-gray-300"
                            />
                          </div>
                          <p className="mono-label text-gray-400">
                            {item.platform_display_name}
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Subtle radial gradient atmosphere */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-white/5 blur-3xl"
                    />
                  </section>
                </SectionReveal>
              </div>

              {/* Recent content */}
              <SectionReveal className="mt-3">
                <section className="border border-gray-300 bg-white">
                  <div className="flex items-center justify-between border-b border-gray-300 px-8 py-6">
                    <div>
                      <p className="mono-label text-gray-500">
                        Recent Content
                      </p>
                      <h2 className="mt-1 text-3xl font-medium tracking-tight">
                        Latest assets
                      </h2>
                    </div>
                    <Link
                      href="/contents"
                      className="mono-label inline-flex items-center gap-1 hover:underline"
                    >
                      View all ({s?.total_contents ?? 0})
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentContents.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center p-16 text-center"
                      >
                        <Sparkles className="h-10 w-10 text-gray-300" />
                        <p className="mt-5 text-2xl font-medium text-gray-400">
                          No content yet.
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          Your generated assets will appear here.
                        </p>
                        <Link
                          href="/generate"
                          className="mt-6 inline-flex items-center gap-2 bg-black px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-editorial"
                        >
                          Generate your first campaign
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </motion.div>
                    ) : (
                      recentContents.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -24 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false }}
                          transition={{
                            delay: index * 0.05,
                            duration: 0.55,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="grid gap-4 px-8 py-5 transition hover:bg-gray-50 md:grid-cols-[140px_1fr_120px_120px] md:items-center"
                        >
                          <p className="mono-label text-gray-500">
                            {item.display_id}
                          </p>
                          <div>
                            <p className="text-xl font-medium">{item.title}</p>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.platform_display_name} / {item.tone}
                            </p>
                          </div>
                          <p className="text-sm capitalize">{item.status}</p>
                          <p className="mono-label text-gray-500">
                            {item.views.toLocaleString()} views
                          </p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </section>
              </SectionReveal>

              {/* Bottom CTA — Portfolio mode */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2 }}
                className="mt-3 space-y-3"
              >
                <div className="flex flex-col gap-4 border border-gray-300 bg-[#111] px-8 py-10 text-white md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xl font-medium">
                      Portfolio Project Mode
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      This dashboard demonstrates SaaS analytics, content workflow, and AI generation state management.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href="/case-study"
                      className="inline-flex items-center gap-2 border border-gray-700 px-6 py-3.5 text-sm font-medium text-white transition hover:border-white"
                    >
                      <FileText className="h-4 w-4" />
                      Read Case Study
                    </Link>
                    <Link
                      href="/generate"
                      className="inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:shadow-editorial"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Go to Studio
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
}
