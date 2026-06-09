"use client";

import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const springConfig = { damping: 25, stiffness: 120, mass: 1.2 };

interface MouseFace3DProps {
  children?: ReactNode;
  className?: string;
  borderColor?: string;
  bgColor?: string;
}

export default function MouseFace3D({
  children,
  className = "",
  borderColor = "rgba(255,255,255,0.12)",
  bgColor = "#0a0a0a",
}: MouseFace3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const glowX = useSpring(useMotionValue(50), springConfig);
  const glowY = useSpring(useMotionValue(50), springConfig);

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const maxAngle = 22;
    const tiltX = (dy / (rect.height / 2)) * -maxAngle;
    const tiltY = (dx / (rect.width / 2)) * maxAngle;

    rotateX.set(tiltX);
    rotateY.set(tiltY);
    glowX.set(((dx / (rect.width / 2)) * 50) + 50);
    glowY.set(((dy / (rect.height / 2)) * 50) + 50);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  }

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          border: `1px solid ${borderColor}`,
          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          transition: "box-shadow 0.4s ease",
          boxShadow: `0 0 40px rgba(255,255,255,${0.04 + Math.abs(rotateX.get() + rotateY.get()) * 0.001})`,
        }}
      >
        {/* Subtle edge highlight that shifts with tilt */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          }}
        />
        <span className="relative z-10">{children}</span>
      </motion.div>
    </div>
  );
}
