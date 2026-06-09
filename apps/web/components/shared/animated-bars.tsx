"use client";

import { motion } from "framer-motion";

export function AnimatedVerticalBar({
  height,
  className = "bg-white"
}: {
  height: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ height: "0%" }}
      whileInView={{ height: `${height}%` }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    />
  );
}

export function AnimatedHorizontalBar({
  width,
  className
}: {
  width: number;
  className: string;
}) {
  return (
    <motion.div
      initial={{ width: "0%" }}
      whileInView={{ width: `${width}%` }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    />
  );
}
