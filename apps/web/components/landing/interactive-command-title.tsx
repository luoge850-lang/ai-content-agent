"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const words = [
  "A",
  "marketing",
  "command",
  "system",
  "for",
  "ideas,",
  "drafts,",
  "visuals",
  "and",
  "measurable",
  "growth."
];

export function InteractiveCommandTitle() {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, x: 50, y: 50 });

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setTilt({
      x,
      y,
      rotateY: ((x - 50) / 50) * 5,
      rotateX: -((y - 50) / 50) * 4
    });
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0, x: 50, y: 50 })}
      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
      transition={{ type: "spring", stiffness: 110, damping: 18 }}
      style={{ transformPerspective: 1100 }}
      className="group relative mx-auto max-w-6xl cursor-default select-none px-2 py-8"
    >
      <motion.div
        aria-hidden="true"
        animate={{ x: (tilt.x - 50) * 0.18, y: (tilt.y - 50) * 0.12 }}
        transition={{ type: "spring", stiffness: 80, damping: 22 }}
        className="pointer-events-none absolute inset-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-2 py-8 text-[2.2rem] font-medium leading-[1.1] tracking-tight text-black/35 blur-xl md:text-[3.5rem] lg:text-[4.2rem]"
      >
        {words.map((word, index) => (
          <span key={`${word}-ghost-${index}`}>{word}</span>
        ))}
      </motion.div>

      <h2 className="relative z-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[2.2rem] font-medium leading-[1.1] tracking-tight md:text-[3.5rem] lg:text-[4.2rem]">
        {words.map((word, index) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 32, filter: "blur(16px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.5 }}
            whileHover={{
              y: -10,
              scale: 1.035,
              textShadow: "0 18px 34px rgba(17,17,17,0.28)"
            }}
            transition={{
              duration: 0.7,
              delay: index * 0.035,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative inline-block"
          >
            <span className="absolute inset-0 translate-y-3 text-black/25 blur-md transition duration-300 group-hover:translate-y-5 group-hover:blur-lg">
              {word}
            </span>
            <span className="relative">{word}</span>
          </motion.span>
        ))}
      </h2>
    </motion.div>
  );
}
