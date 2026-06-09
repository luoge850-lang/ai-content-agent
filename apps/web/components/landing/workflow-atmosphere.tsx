"use client";

import { motion } from "framer-motion";

export function WorkflowAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, 32, -18, 0],
          y: [0, -20, 18, 0],
          opacity: [0.42, 0.72, 0.5, 0.42]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] top-[18%] h-52 w-52 rounded-full border border-gray-300 bg-white/40 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, -36, 24, 0],
          y: [0, 28, -16, 0],
          opacity: [0.3, 0.58, 0.38, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[10%] top-[48%] h-64 w-64 rounded-full border border-gray-300 bg-gray-100/80 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ backgroundPosition: ["0px 0px", "64px 64px"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(17,17,17,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />
    </div>
  );
}
