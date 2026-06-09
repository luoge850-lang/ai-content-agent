"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CreditCard,
  Crown,
  Loader2,
  Mail,
  Shield,
  User,
  Users,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { fadeUp, stagger } from "@/components/shared/motion-presets";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [teamName, setTeamName] = useState(user?.team_name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const { auth } = await import("@/lib/api");
      await auth.updateMe({
        display_name: displayName,
        team_name: teamName,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const planInfo = {
    free: {
      label: "Free Plan",
      icon: Zap,
      credits: "100 credits",
      features: [
        "1 project",
        "4 platforms",
        "Template-based generation",
        "Basic analytics",
      ],
    },
    pro: {
      label: "Pro Plan",
      icon: Crown,
      credits: "1,000 credits",
      features: [
        "Unlimited projects",
        "AI-powered generation",
        "Priority support",
        "Advanced analytics",
      ],
    },
    enterprise: {
      label: "Enterprise",
      icon: Shield,
      credits: "Unlimited",
      features: [
        "Everything in Pro",
        "Custom AI model",
        "Dedicated support",
        "API access",
      ],
    },
  };

  const plan = planInfo[user?.plan as keyof typeof planInfo] || planInfo.free;
  const PlanIcon = plan.icon;

  return (
    <AppShell>
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <motion.div variants={fadeUp}>
          <p className="mono-label text-gray-400">[ 05 ]</p>
          <h1 className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] tracking-tight">
            Account
            <br />
            settings.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
            Manage your profile, team, and subscription plan.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-3 xl:grid-cols-[1fr_0.8fr]">
          {/* Profile form */}
          <motion.form
            variants={fadeUp}
            onSubmit={handleSave}
            className="border border-gray-300 bg-white p-8"
          >
            <h2 className="text-2xl font-medium tracking-tight">Profile</h2>

            <div className="mt-8 space-y-6">
              <div>
                <label className="mono-label flex items-center gap-2 text-gray-500">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="mt-2 w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Email cannot be changed.
                </p>
              </div>

              <div>
                <label className="mono-label flex items-center gap-2 text-gray-500">
                  <User className="h-4 w-4" />
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-2 w-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Your display name"
                />
              </div>

              <div>
                <label className="mono-label flex items-center gap-2 text-gray-500">
                  <Users className="h-4 w-4" />
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="mt-2 w-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Your team or company name"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-black px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-editorial disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <Check className="h-4 w-4" />
                ) : null}
                {saved ? "Saved" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={logout}
                className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </motion.form>

          {/* Plan card — concept only */}
          <motion.div
            variants={fadeUp}
            className="border border-gray-300 bg-[#111] p-8 text-white"
          >
            <div className="flex items-center justify-between">
              <p className="mono-label text-gray-500">SaaS Pricing Concept</p>
              <PlanIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Pricing cards demonstrate SaaS product thinking. Payment integration is not enabled in this portfolio version.
            </p>
            <p className="mt-6 text-3xl font-medium tracking-tight">
              {plan.label}
            </p>
            <p className="mt-2 text-sm text-gray-400">{plan.credits}</p>

            <div className="mt-8 space-y-3">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-gray-500" />
                  {f}
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-gray-800 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Credits remaining</span>
                <span className="font-medium">
                  {user?.credits_remaining.toLocaleString()}
                </span>
              </div>
              <div className="mt-3 h-2 bg-gray-800">
                <div
                  className="h-full bg-white transition-all"
                  style={{
                    width: `${Math.min(
                      user?.plan === "free"
                        ? (user?.credits_remaining || 0)
                        : 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <button
              disabled
              className="mt-8 w-full border border-gray-700 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
              title="Payment not enabled in portfolio version"
            >
              <CreditCard className="mr-2 inline h-4 w-4" />
              Upgrade (Concept Only)
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AppShell>
  );
}
