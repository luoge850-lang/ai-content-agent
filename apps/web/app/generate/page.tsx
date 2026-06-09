"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
  Database,
  FileSearch,
  FileText,
  Layers,
  Lightbulb,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { fadeUp, stagger } from "@/components/shared/motion-presets";
import { GenerationStudio } from "@/components/generate/generation-studio";

const AI_PIPELINE_STEPS = [
  {
    icon: CheckCircle2,
    label: "Validate project ownership",
    desc: "Verify the project belongs to the authenticated user.",
  },
  {
    icon: Database,
    label: "Load knowledge base entries",
    desc: "Fetch brand/product/audience context for RAG injection.",
  },
  {
    icon: Lightbulb,
    label: "Inject platform-specific prompt rules",
    desc: "Assemble system prompt with platform formatting + tone rules.",
  },
  {
    icon: Bot,
    label: "Call DeepSeek API",
    desc: "Send structured prompt to AI model via OpenAI-compatible SDK.",
  },
  {
    icon: FileSearch,
    label: "Parse JSON response",
    desc: "Extract title, body, image_prompt with multi-strategy parser.",
  },
  {
    icon: Database,
    label: "Save generated content",
    desc: "Update database record, set generation_status to completed.",
  },
];

export default function GeneratePage() {
  return (
    <AppShell>
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <motion.div variants={fadeUp}>
          <p className="mono-label text-gray-400">[ 02 ]</p>
          <h1 className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.08] tracking-tight">
            Create platform-
            <br />
            native content.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
            Select a platform, choose a tone, describe your product — the AI
            engine generates copy and image prompts optimized for each channel.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="mt-10">
          <GenerationStudio />
        </motion.div>

        {/* ── AI Pipeline explanation ────────────────── */}
        <motion.div variants={fadeUp} className="mt-8">
          <div className="border border-gray-300 bg-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="mono-label text-gray-500">How Generation Works</p>
                <h3 className="mt-2 text-2xl font-medium tracking-tight">
                  AI Generation Pipeline
                </h3>
              </div>
              <Link
                href="/case-study#ai-generation-pipeline"
                className="mono-label inline-flex items-center gap-1 text-gray-500 hover:text-black"
              >
                Full details <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {AI_PIPELINE_STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className="flex items-start gap-3 border border-gray-200 bg-gray-50 p-4"
                >
                  <span className="mono-label mt-0.5 text-gray-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
