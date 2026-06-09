"use client";

import { Toaster as SonnerToaster } from "sonner";

/** Editorial-styled toast container. Black-and-white, no colors. */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      duration={3500}
      style={{
        background: "#111",
        color: "#fff",
        border: "1px solid #333",
        borderRadius: "0",
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        padding: "12px 20px",
      }}
    />
  );
}
