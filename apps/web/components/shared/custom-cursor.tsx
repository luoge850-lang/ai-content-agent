"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const followerPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    /* Hide native cursor */
    const style = document.createElement("style");
    style.textContent = `
      * { cursor: none !important; }
    `;
    document.head.appendChild(style);

    function onMove(e: MouseEvent) {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 7}px, ${e.clientY - 7}px)`;
      }
    }

    function animate() {
      const dx = posRef.current.x - followerPosRef.current.x;
      const dy = posRef.current.y - followerPosRef.current.y;
      followerPosRef.current.x += dx * 0.1;
      followerPosRef.current.y += dy * 0.1;
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${followerPosRef.current.x - 2}px, ${followerPosRef.current.y - 2}px)`;
      }
      requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* Black solid main dot — 14px, mix-blend-mode for cross-background visibility */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[99999] h-[14px] w-[14px] rounded-full bg-black"
        style={{ willChange: "transform", mixBlendMode: "difference" }}
      />
      {/* White tiny follower dot — 4px, follows with lerp lag */}
      <div
        ref={followerRef}
        className="pointer-events-none fixed left-0 top-0 z-[99999] h-[4px] w-[4px] rounded-full bg-white"
        style={{ willChange: "transform", mixBlendMode: "difference" }}
      />
    </>
  );
}
