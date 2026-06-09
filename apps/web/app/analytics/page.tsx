"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/dashboard/app-shell";
import { SkeletonAnalytics } from "@/components/shared/skeleton";
import { fadeUp, stagger } from "@/components/shared/motion-presets";
import { AnimatedHorizontalBar } from "@/components/shared/animated-bars";
import {
  analytics,
  AnalyticsSummary,
  Content,
  contents as contentsApi,
} from "@/lib/api";

function MetricCard({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, rotateX: 4 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 900 }}
      className="group relative overflow-hidden border border-gray-300 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-editorial"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] bg-black"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
        style={{ transformOrigin: "left" }}
      />
      <p className="mono-label text-gray-500">{label}</p>
      <p className="mt-8 text-5xl font-medium tracking-tight">{value}</p>
    </motion.article>
  );
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topContents, setTopContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [s, c] = await Promise.all([
        analytics.summary(),
        contentsApi.list(),
      ]);
      setSummary(s);
      setTopContents(
        c.sort((a, b) => b.conversion - a.conversion).slice(0, 5)
      );
    } catch {
      toast.error("Failed to load analytics. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AppShell>
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <motion.div variants={fadeUp}>
          <p className="mono-label text-gray-400">[ 04 ]</p>
          <h1 className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] tracking-tight">
            Read the market
            <br />
            response.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
            Demo analytics — stored metrics from your generated content across
            all platforms.
          </p>

          {/* Portfolio disclaimer */}
          <div className="mt-6 border border-gray-200 bg-gray-50 p-4 max-w-xl">
            <p className="mono-label text-gray-500 mb-1">Portfolio Version Note</p>
            <p className="text-xs leading-relaxed text-gray-600">
              Analytics data is simulated or manually stored for demonstration
              purposes. Real social platform API integration (小红书/抖音/公众号/微博)
              is listed as a future improvement in the{" "}
              <a href="/case-study" className="underline hover:text-black">
                technical case study
              </a>.
            </p>
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
              <SkeletonAnalytics />
            </motion.div>
          ) : (
            <motion.div
              key="loaded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Summary cards */}
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, amount: 0.2 }}
                variants={stagger}
                className="mt-10 grid gap-3 md:grid-cols-3"
              >
                <MetricCard
                  label="Total Views"
                  value={summary!.total_views.toLocaleString()}
                  delay={0}
                />
                <MetricCard
                  label="Total Likes"
                  value={summary!.total_likes.toLocaleString()}
                  delay={0.06}
                />
                <MetricCard
                  label="Avg. Conversion"
                  value={`${(
                    summary!.total_conversion /
                    Math.max(summary!.total_contents, 1)
                  ).toFixed(1)}%`}
                  delay={0.12}
                />
              </motion.div>

              {/* Platform metrics + ranking */}
              <div className="mt-3 grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="border border-gray-300 bg-white p-8"
                >
                  <p className="mono-label text-gray-500">Platform Metrics</p>
                  <div className="mt-10 space-y-10">
                    {summary!.by_platform.map((item, index) => (
                      <motion.div
                        key={item.platform_slug}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{
                          delay: index * 0.08,
                          duration: 0.55,
                        }}
                      >
                        <div className="mb-3 flex justify-between">
                          <p className="text-xl font-medium">
                            {item.platform_display_name}
                          </p>
                          <p className="mono-label text-gray-500">
                            {item.total_conversion}% Index
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Views</span>
                            <span>{item.total_views.toLocaleString()}</span>
                          </div>
                          <div className="h-2 overflow-hidden bg-gray-100">
                            <AnimatedHorizontalBar
                              width={Math.min(
                                (item.total_views /
                                  Math.max(summary!.total_views, 1)) *
                                  100,
                                100
                              )}
                              className="h-full bg-black"
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Likes</span>
                            <span>{item.total_likes.toLocaleString()}</span>
                          </div>
                          <div className="h-2 overflow-hidden bg-gray-100">
                            <AnimatedHorizontalBar
                              width={Math.min(
                                (item.total_likes /
                                  Math.max(summary!.total_likes, 1)) *
                                  100,
                                100
                              )}
                              className="h-full bg-gray-500"
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Conversion</span>
                            <span>{item.total_conversion}%</span>
                          </div>
                          <div className="h-2 overflow-hidden bg-gray-100">
                            <AnimatedHorizontalBar
                              width={item.total_conversion}
                              className="h-full bg-gray-300"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{
                    delay: 0.1,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative overflow-hidden border border-gray-300 bg-[#111] p-8 text-white"
                >
                  <p className="mono-label text-gray-500">Content Ranking</p>
                  {topContents.length === 0 ? (
                    <div className="flex flex-col items-center py-16 text-center">
                      <BarChart3 className="h-10 w-10 text-gray-600" />
                      <p className="mt-4 text-gray-500">
                        Generate content to see rankings.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-8 divide-y divide-gray-800">
                      {topContents.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 24 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false }}
                          transition={{
                            delay: index * 0.08,
                            duration: 0.5,
                          }}
                          className="py-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="mono-label text-gray-500">
                                0{index + 1} / {item.platform_display_name}
                              </p>
                              <p className="mt-3 text-xl font-medium">
                                {item.title}
                              </p>
                            </div>
                            <p className="text-3xl font-medium">
                              {item.conversion}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-white/5 blur-3xl"
                  />
                </motion.section>
              </div>

              {/* Second row cards */}
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                {[
                  ["Projects", summary!.total_projects, Zap],
                  ["Contents", summary!.total_contents, Users],
                  ["Credits Used", summary!.credits_used, TrendingUp],
                  [
                    "Platforms",
                    summary!.by_platform.length,
                    BarChart3,
                  ],
                ].map(([label, value, Icon], index) => (
                  <motion.article
                    key={label as string}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{
                      delay: index * 0.06,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group border border-gray-300 bg-white p-5 transition hover:-translate-y-1 hover:shadow-editorial"
                  >
                    <div className="flex items-center justify-between">
                      <p className="mono-label text-gray-500">
                        {label as string}
                      </p>
                      {Icon && (
                        (() => { const I = Icon as React.ElementType; return <I className="h-4 w-4 text-gray-400 transition group-hover:text-black" />; })()
                      )}
                    </div>
                    <p className="mt-6 text-4xl font-medium tracking-tight">
                      {typeof value === "number"
                        ? value.toLocaleString()
                        : String(value)}
                    </p>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
}
