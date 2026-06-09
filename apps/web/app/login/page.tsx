"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight, Loader2, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

const DEMO_EMAIL = "LouisHarrington@demo.ai";
const DEMO_PASSWORD = "123456";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, displayName, teamName);
      }
      toast.success("Welcome to AI Content Agent!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError("");
    try {
      await login(DEMO_EMAIL, DEMO_PASSWORD);
      toast.success("Signed in with demo account. Explore the full AI SaaS workflow!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Demo login failed";
      setError(message);
      toast.error("Demo login failed. Is the backend running?");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <main className="editorial-grid flex min-h-screen items-center justify-center bg-[#fcfcfc] px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-10 text-center">
          <p className="mono-label tracking-[0.3em] text-gray-400">
            AI CONTENT AGENT
          </p>
          <h1 className="mt-4 text-3xl font-medium tracking-tight">
            {mode === "login" ? "Welcome to the Demo" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {mode === "login"
              ? "Explore the full AI SaaS portfolio project."
              : "Start generating platform-ready content in minutes."}
          </p>
        </div>

        {/* ── Demo Login Button ─────────────────────────── */}
        {mode === "login" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-md border-2 border-[#1a1a1a] bg-[#fcfcfc] px-6 py-4 text-[15px] font-medium text-[#1a1a1a] transition hover:-translate-y-0.5 hover:shadow-editorial active:translate-y-0 disabled:opacity-60"
            >
              {demoLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <User className="h-5 w-5 transition group-hover:scale-110" />
              )}
              <span>
                {demoLoading ? "Signing in..." : "Continue with Demo Account"}
              </span>
              {!demoLoading && (
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              )}
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">
              Use demo account to explore the full AI SaaS workflow — no registration needed.
            </p>
          </motion.div>
        )}

        {/* Divider */}
        {mode === "login" && (
          <div className="mb-8 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400">or sign in manually</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <>
              <div>
                <label className="mono-label block text-gray-500">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1.5 w-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-black"
                  placeholder="Marketing Team"
                />
              </div>
              <div>
                <label className="mono-label block text-gray-500">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="mt-1.5 w-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-black"
                  placeholder="AI Content Lab"
                />
              </div>
            </>
          )}

          <div>
            <label className="mono-label block text-gray-500">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-black"
              placeholder="LouisHarrington@demo.ai"
            />
          </div>

          <div>
            <label className="mono-label block text-gray-500">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-black"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-md border border-[#1a1a1a] bg-[#1a1a1a] px-6 py-3.5 text-[15px] font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-editorial active:translate-y-0 disabled:opacity-60"
          >
            <span className="absolute inset-0 -translate-x-[101%] bg-[#fcfcfc] transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
            <Sparkles className="relative z-10 h-5 w-5 transition group-hover:-translate-y-1 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-[#111]" />
            <span className="relative z-10 transition group-hover:text-[#111]">
              {submitting
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </span>
            {!submitting && (
              <ArrowRight className="relative z-10 h-5 w-5 transition group-hover:translate-x-1 group-hover:text-[#111]" />
            )}
          </button>
        </form>

        {/* Toggle mode */}
        <p className="mt-8 text-center text-sm text-gray-500">
          {mode === "login" ? (
            <>
              No account yet?{" "}
              <button
                onClick={() => setMode("register")}
                className="font-medium text-black underline hover:no-underline"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="font-medium text-black underline hover:no-underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        {/* Demo hint */}
        <div className="mt-6 border border-gray-200 bg-gray-50 p-4 text-center">
          <p className="mono-label text-gray-400">
            Demo: LouisHarrington@demo.ai / 123456
          </p>
        </div>

        {/* Portfolio note */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Portfolio project — not a commercial service.
        </p>
      </motion.div>
    </main>
  );
}
