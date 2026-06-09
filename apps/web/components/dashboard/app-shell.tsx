"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CircleUserRound,
  Command,
  LogOut,
  Menu,
  Search,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { navItems } from "@/lib/mock-data";
import { useKeyboardShortcuts } from "@/lib/shortcuts";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [online, setOnline] = useState(true);

  // Online/offline detection
  useEffect(() => {
    setOnline(navigator.onLine);
    const go = () => setOnline(true);
    const went = () => setOnline(false);
    window.addEventListener("online", go);
    window.addEventListener("offline", went);
    return () => {
      window.removeEventListener("online", go);
      window.removeEventListener("offline", went);
    };
  }, []);

  // Keyboard shortcuts
  const goDashboard = useCallback(() => router.push("/dashboard"), [router]);
  const goGenerate = useCallback(() => router.push("/generate"), [router]);
  const goContents = useCallback(() => router.push("/contents"), [router]);

  useKeyboardShortcuts([
    { key: "k", metaKey: true, handler: goDashboard, description: "Dashboard" },
    { key: "g", metaKey: true, handler: goGenerate, description: "Generate" },
    { key: "l", metaKey: true, handler: goContents, description: "Library" },
  ]);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f6f3]">
        <p className="mono-label text-gray-400">Loading...</p>
      </main>
    );
  }

  if (!user) return null;

  const creditsPercent =
    user.plan === "free" ? (user.credits_remaining / 100) * 100 : 72;

  return (
    <main className="min-h-screen bg-[#f6f6f3] text-[#111]">
      {/* Offline banner */}
      <AnimatePresence>
        {!online && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-center gap-2 bg-[#111] px-4 py-2 text-sm text-white"
          >
            <WifiOff className="h-4 w-4" />
            You are offline. Data may be stale.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-gray-300 bg-[#fcfcfc] md:flex md:flex-col">
        <Link href="/" className="border-b border-gray-300 p-6">
          <p className="mono-label text-gray-500">AI Content</p>
          <p className="mt-2 text-4xl font-medium tracking-tight">Agent</p>
        </Link>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between border border-transparent px-4 py-4 text-sm transition",
                  active
                    ? "border-black bg-black text-white"
                    : "text-gray-600 hover:border-gray-300 hover:bg-white hover:text-black"
                )}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span className="mono-label">{active ? "ON" : "GO"}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-300 p-5">
          <div className="flex items-center gap-2">
            {online ? (
              <Wifi className="h-3 w-3 text-gray-400" />
            ) : (
              <WifiOff className="h-3 w-3 text-gray-400" />
            )}
            <p className="mono-label text-gray-500">Credits</p>
          </div>
          <div className="mt-3 h-2 bg-gray-200">
            <div
              className="h-full bg-black transition-all"
              style={{ width: `${Math.min(creditsPercent, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {user.credits_remaining.toLocaleString()} generation credits left
          </p>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#fcfcfc] md:hidden"
            >
              <div className="flex items-center justify-between border-b border-gray-300 p-5">
                <div>
                  <p className="mono-label text-gray-500">AI Content</p>
                  <p className="text-2xl font-medium">Agent</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="grid h-10 w-10 place-items-center border border-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between border px-4 py-4 text-sm",
                        active
                          ? "border-black bg-black text-white"
                          : "border-transparent text-gray-600 hover:border-gray-300"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-gray-300 p-5">
                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="flex w-full items-center justify-center gap-2 border border-gray-300 py-3 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="md:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-300 bg-[#fcfcfc]/90 px-4 backdrop-blur md:h-20 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="grid h-10 w-10 place-items-center border border-gray-300 bg-white md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Command className="hidden h-5 w-5 md:block" />
            <div className="hidden items-center gap-2 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 sm:flex">
              <Search className="h-4 w-4" />
              <span>
                Cmd+K Dashboard &middot; Cmd+G Generate &middot; Cmd+L Library
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button className="grid h-10 w-10 place-items-center border border-gray-300 bg-white transition hover:bg-black hover:text-white">
              <Bell className="h-4 w-4" />
            </button>
            <div className="hidden items-center gap-3 border border-gray-300 bg-white px-3 py-2 sm:flex">
              <CircleUserRound className="h-5 w-5" />
              <div className="text-right">
                <p className="text-sm font-medium">
                  {user.display_name || user.email}
                </p>
                <p className="mono-label capitalize text-gray-500">
                  {user.plan} Plan
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="grid h-10 w-10 place-items-center border border-gray-300 bg-white transition hover:bg-black hover:text-white"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="p-5 md:p-8"
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}
