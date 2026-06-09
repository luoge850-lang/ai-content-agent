"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export interface Shortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      for (const s of shortcuts) {
        const keyMatch = e.key.toLowerCase() === s.key.toLowerCase();
        const metaMatch = s.metaKey ? e.metaKey || e.ctrlKey : true;
        if (keyMatch && metaMatch) {
          e.preventDefault();
          s.handler();
          return;
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcuts]);
}

/**
 * App-wide keyboard shortcuts.
 * - Cmd+K / Ctrl+K → navigate to dashboard
 * - Cmd+G / Ctrl+G → navigate to generate
 * - Cmd+L / Ctrl+L → navigate to contents
 * - Escape → no-op (reserved for modals)
 */
export function useAppShortcuts() {
  const router = useRouter();
  useKeyboardShortcuts([
    {
      key: "k",
      metaKey: true,
      handler: () => router.push("/dashboard"),
      description: "Go to Dashboard",
    },
    {
      key: "g",
      metaKey: true,
      handler: () => router.push("/generate"),
      description: "Go to Generate",
    },
    {
      key: "l",
      metaKey: true,
      handler: () => router.push("/contents"),
      description: "Go to Content Library",
    },
  ]);
}
