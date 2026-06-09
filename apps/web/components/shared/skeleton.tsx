"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function Pulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      animate={{ opacity: [0.25, 0.55, 0.25] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      className={cn("bg-gray-200", className)}
      style={style}
    />
  );
}

/** Skeleton for a stat card (Dashboard, Analytics). */
export function SkeletonStatCard() {
  return (
    <div className="border border-gray-300 bg-white p-6 shadow-soft">
      <Pulse className="mb-10 h-3 w-20" />
      <Pulse className="h-10 w-24" />
      <Pulse className="mt-2 h-3 w-16" />
    </div>
  );
}

/** Skeleton for the dashboard grid: 4 stat cards + 2 large panels. */
export function SkeletonDashboard() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
      <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-gray-300 bg-white p-8">
          <Pulse className="mb-8 h-3 w-28" />
          <Pulse className="h-8 w-64" />
          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-gray-200 p-5">
                <Pulse className="h-3 w-8" />
                <Pulse className="mt-8 h-6 w-16" />
                <Pulse className="mt-2 h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="border border-gray-300 bg-[#111] p-8">
          <Pulse className="h-3 w-28 bg-gray-700" />
          <div className="mt-10 flex h-56 items-end gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Pulse
                key={i}
                className="flex-1 bg-gray-700"
                style={{ height: `${40 + Math.random() * 40}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="border border-gray-300 bg-white p-6">
        <Pulse className="mb-6 h-6 w-36" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-4 grid gap-4 md:grid-cols-[140px_1fr_120px_120px]">
            <Pulse className="h-4 w-20" />
            <Pulse className="h-5 w-48" />
            <Pulse className="h-4 w-16" />
            <Pulse className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton for contents table. */
export function SkeletonContents() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Pulse key={i} className="h-9 w-20 rounded-md" />
        ))}
      </div>
      <div className="hidden border border-gray-300 bg-gray-50 px-6 py-3 md:grid md:grid-cols-[130px_120px_1fr_100px_110px_155px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <Pulse key={i} className="h-3 w-16" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, row) => (
        <div
          key={row}
          className="grid gap-4 border border-t-0 border-gray-300 bg-white px-6 py-5 md:grid-cols-[130px_120px_1fr_100px_110px_155px]"
        >
          <Pulse className="h-4 w-20" />
          <Pulse className="h-4 w-16" />
          <div>
            <Pulse className="h-5 w-48" />
            <Pulse className="mt-2 h-4 w-full" />
          </div>
          <Pulse className="h-4 w-12" />
          <Pulse className="h-5 w-16 rounded-full" />
          <div className="flex gap-2">
            <Pulse className="h-10 w-10" />
            <Pulse className="h-10 w-10" />
            <Pulse className="h-10 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton for analytics page. */
export function SkeletonAnalytics() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
      <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-gray-300 bg-white p-8">
          <Pulse className="mb-10 h-3 w-28" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mb-10">
              <Pulse className="mb-3 h-5 w-32" />
              <Pulse className="mb-2 h-2 w-full" />
              <Pulse className="mb-2 h-2 w-3/4" />
              <Pulse className="h-2 w-1/2" />
            </div>
          ))}
        </div>
        <div className="border border-gray-300 bg-[#111] p-8">
          <Pulse className="mb-8 h-3 w-28 bg-gray-700" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-5">
              <Pulse className="mb-3 h-3 w-24 bg-gray-700" />
              <Pulse className="h-5 w-48 bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Inline pulse bar — for small loading placeholders. */
export function SkeletonLine({ className }: { className?: string }) {
  return <Pulse className={cn("h-4 w-full rounded", className)} />;
}
