"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const labels = ["Copy", "Image", "Post", "Brief", "Data", "CTA"];

export function HoverTrailZone() {
  const [trails, setTrails] = useState<
    Array<{ id: number; x: number; y: number; label: string; rotate: number }>
  >([]);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const lastSpawn = useRef(0);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({
      rotateY: ((event.clientX - rect.left - centerX) / centerX) * 4.5,
      rotateX: -((event.clientY - rect.top - centerY) / centerY) * 3.5
    });

    const now = performance.now();
    if (now - lastSpawn.current < 90) {
      return;
    }
    lastSpawn.current = now;
    const id = now;
    const label = labels[Math.floor(Math.random() * labels.length)];
    setTrails((current) => [
      ...current.slice(-8),
      {
        id,
        label,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        rotate: Math.random() * 18 - 9
      }
    ]);
    window.setTimeout(() => {
      setTrails((current) => current.filter((trail) => trail.id !== id));
    }, 900);
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
      className="relative overflow-hidden border border-gray-300 bg-white px-8 py-20 text-center shadow-soft"
    >
      <AnimatePresence>
        {trails.map((trail) => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0, scale: 0.8, x: trail.x - 44, y: trail.y - 22, rotate: trail.rotate }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.45, y: trail.y - 42 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute border border-gray-300 bg-[#fcfcfc] px-4 py-2 mono-label shadow-editorial"
          >
            {trail.label}
          </motion.div>
        ))}
      </AnimatePresence>
      <p className="mono-label text-gray-500">Interactive Campaign Surface</p>
      <motion.h2
        animate={tilt}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        style={{ transformPerspective: 900 }}
        className="mx-auto mt-6 max-w-3xl text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl"
      >
        Drag your cursor through the campaign system.
      </motion.h2>
      <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-gray-600">
        Every brief becomes a chain of reusable assets: hooks, long-form drafts, visual prompts,
        publish plans and analytics feedback.
      </p>
      <Link
        href="/generate"
        className="button-slide-shadow group relative mt-10 inline-flex overflow-hidden rounded-md border border-black bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
      >
        <span className="absolute inset-0 -translate-x-[101%] bg-[#fcfcfc] transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
        <Sparkles className="relative z-10 mr-2 h-5 w-5 transition group-hover:text-black" />
        <span className="relative z-10 transition group-hover:text-black">Start Generating</span>
      </Link>
    </div>
  );
}
