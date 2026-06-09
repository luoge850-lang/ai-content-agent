"use client";

import { motion } from "framer-motion";
import { letterBlock } from "@/components/shared/motion-presets";

export function EditorialLogo() {
  return (
    <motion.h1
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          scale: 1,
          transition: { staggerChildren: 0.06, delayChildren: 0.1 }
        },
        initial: { scale: 1.03 }
      }}
      className="w-full"
    >
      <svg viewBox="0 0 840 100" className="h-auto w-full fill-[#111]">
        <g transform="translate(0,0)">
          <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" />
          <motion.polygon variants={letterBlock} points="200,0 214,0 214,100 200,100" />
          <motion.polygon variants={letterBlock} points="0,0 33,0 214,100 181,100" />
        </g>
        <g transform="translate(280,0)">
          <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" />
          <motion.polygon variants={letterBlock} points="200,0 214,0 214,100 200,100" />
          <motion.polygon variants={letterBlock} points="14,43 200,43 200,57 14,57" />
        </g>
        <g transform="translate(560,0)">
          <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" />
          <motion.polygon variants={letterBlock} points="266,0 280,0 280,100 266,100" />
          <motion.polygon variants={letterBlock} points="0,0 26,0 153,100 127,100" />
          <motion.polygon variants={letterBlock} points="254,0 280,0 153,100 127,100" />
        </g>
      </svg>
    </motion.h1>
  );
}
