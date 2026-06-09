"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Box,
  Braces,
  Code2,
  Cpu,
  Database,
  Dock,
  FileText,
  Github,
  Layers,
  Lock,
  Mail,
  Menu,
  Palette,
  Server,
  Shield,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { EditorialLogo } from "@/components/shared/editorial-logo";
import { fadeUp, stagger } from "@/components/shared/motion-presets";
import { SectionReveal } from "@/components/shared/section-reveal";
import RolodexGallery from "@/components/landing/rolodex-gallery";
import FlowingMenu from "@/components/landing/flowing-menu";
import MouseFace3D from "@/components/shared/mouse-face-3d";
import { InteractiveCommandTitle } from "@/components/landing/interactive-command-title";
import { ProductMarquee } from "@/components/landing/product-marquee";
import { WorkflowAtmosphere } from "@/components/landing/workflow-atmosphere";
import { landingPills } from "@/lib/mock-data";

const workflow = [
  "Parse product signal",
  "Write platform copy",
  "Create image prompt",
  "Manage content library",
];

const flowingItems = [
  { link: "#", text: "Prompt Engineering Pipeline", image: "https://picsum.photos/seed/fl1/600/400?grayscale" },
  { link: "#", text: "Knowledge Base RAG Injection", image: "https://picsum.photos/seed/fl2/600/400?grayscale" },
  { link: "#", text: "Async Generation State Flow", image: "https://picsum.photos/seed/fl3/600/400?grayscale" },
  { link: "#", text: "Content Management System", image: "https://picsum.photos/seed/fl4/600/400?grayscale" },
  { link: "#", text: "Editorial B&W Design System", image: "https://picsum.photos/seed/fl5/600/400?grayscale" },
];

const TECH_HIGHLIGHTS = [
  { icon: Bot, label: "Multi-Platform Prompt Engineering", desc: "Platform-specific system prompts for 小红书, 抖音, 公众号, 微博 × 3 tones" },
  { icon: Database, label: "Knowledge Base Context Injection", desc: "Lightweight RAG-style brand memory injected into AI system prompts" },
  { icon: Lock, label: "JWT Authentication + RBAC", desc: "bcrypt password hashing, Bearer token auth, ownership-based access control" },
  { icon: FileText, label: "Content Management System", desc: "CRUD content library with status workflow, inline editing, search & filter" },
  { icon: BarChart3, label: "Analytics Dashboard", desc: "Per-platform metrics aggregation, content ranking, demo analytics views" },
  { icon: Palette, label: "Editorial B&W Design System", desc: "Custom design tokens, Framer Motion animations, responsive layout, a11y" },
  { icon: Dock, label: "Docker-Ready Infrastructure", desc: "Docker Compose with PostgreSQL, Redis, Celery worker, Nginx reverse proxy" },
  { icon: Braces, label: "Async AI Generation Pipeline", desc: "Background task processing with polling UI, graceful fallback on API errors" },
];

export function LandingExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMotionLayer, setShowMotionLayer] = useState(false);

  useEffect(() => {
    const videoTimer = window.setTimeout(() => setShowMotionLayer(true), 900);
    return () => {
      window.clearTimeout(videoTimer);
    };
  }, []);

  return (
    <main className="editorial-grid bg-[#fcfcfc] text-[#111]">
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <motion.header
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-20 px-6 pt-6 md:px-16"
        >
          <EditorialLogo />

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-8 flex items-start justify-between gap-8"
          >
            <div className="mono-label w-[20%] leading-relaxed">
              Portfolio
              <br />
              Project
              <br />
              2026
            </div>
            <ArrowRight className="hidden h-4 w-[5%] text-gray-400 md:block" strokeWidth={1} />
            <p className="mono-label flex-1 leading-relaxed text-gray-800 md:w-[32%] md:flex-none">
              A full-stack AI SaaS portfolio project built with Next.js, FastAPI, DeepSeek, and Docker.
            </p>
            <ArrowRight className="hidden h-4 w-[5%] text-gray-400 md:block" strokeWidth={1} />
            <nav className="hidden w-[18%] space-y-1 text-right md:block">
              {["Case Study", "Tech Stack", "Demo", "GitHub"].map((item) => (
                <a
                  key={item}
                  href={item === "Case Study" ? "/case-study" : item === "Demo" ? "/login" : item === "GitHub" ? "#about" : `#${item.toLowerCase().replace(" ", "-")}`}
                  className="mono-label block text-gray-800 hover:text-black hover:underline"
                >
                  {item}
                </a>
              ))}
            </nav>
            <button
              className="relative z-30 flex flex-col gap-[6px] md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </motion.div>
        </motion.header>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="relative z-20 border-b border-gray-200 bg-[#fcfcfc] px-6 py-8 shadow-xl md:hidden"
            >
              {["Case Study", "Tech Stack", "Demo", "GitHub"].map((item) => (
                <Link
                  key={item}
                  className="mono-label block py-3 text-gray-800"
                  href={item === "Case Study" ? "/case-study" : item === "Demo" ? "/login" : "#about"}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {showMotionLayer ? (
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[62vh] bg-[radial-gradient(circle_at_65%_45%,rgba(17,17,17,0.16),transparent_32rem)]"
            />
          ) : null}
        </AnimatePresence>

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-10 mt-16 w-[340px] px-10 md:mt-24 md:px-16"
        >
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4 text-xs font-mono">
            01 <span className="h-[1.5px] w-16 bg-black/20" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-[3.5rem] font-normal leading-[1] tracking-tight md:text-[5rem]"
          >
            AI
            <br />
            CONTENT
            <br />
            AGENT
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-7 max-w-[320px] text-[14px] leading-[1.65] text-gray-700">
            A full-stack AI SaaS portfolio project for multi-platform Chinese social media content generation.
          </motion.p>

          {/* ── CTA Row ────────────────────────────────── */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="group relative inline-flex overflow-hidden rounded-md border border-[#1a1a1a] bg-[#1a1a1a] px-6 py-3.5 text-[15px] font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-editorial active:translate-y-0"
            >
              <span className="absolute inset-0 -translate-x-[101%] bg-[#fcfcfc] transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
              <Sparkles className="relative z-10 mr-2 h-5 w-5 transition group-hover:-translate-y-1 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-[#111]" />
              <span className="relative z-10 transition group-hover:text-[#111]">Try Live Demo</span>
            </Link>
            <Link
              href="/case-study"
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3.5 text-[15px] font-medium text-[#111] transition hover:-translate-y-0.5 hover:border-black hover:shadow-editorial"
            >
              <FileText className="h-5 w-5" />
              View Case Study
            </Link>
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3.5 text-[15px] font-medium text-[#111] transition hover:-translate-y-0.5 hover:border-black hover:shadow-editorial"
            >
              <Github className="h-5 w-5" />
              View GitHub
            </a>
          </motion.div>
        </motion.div>

        {/* Live Brief sidebar — portfolio edition */}
        <motion.aside
          initial="initial"
          animate="animate"
          variants={stagger}
          className="absolute right-16 top-[38%] z-10 hidden w-[220px] md:block"
        >
          <motion.p variants={fadeUp} className="mono-label font-bold">
            Portfolio Project
          </motion.p>
          <motion.p variants={fadeUp} className="mt-3 text-[12px] leading-[1.6] text-gray-600">
            Full-stack · AI · SaaS · Prompt Engineering · Editorial Design · Docker
          </motion.p>
          <motion.div variants={fadeUp} className="mt-7 grid grid-cols-2 gap-5">
            <div>
              <p className="mono-label text-gray-500">Stack</p>
              <p className="mt-2 text-[13px] font-medium">Next.js + FastAPI</p>
            </div>
            <div>
              <p className="mono-label text-gray-500">AI</p>
              <p className="mt-2 text-[13px] font-medium">DeepSeek</p>
            </div>
          </motion.div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-10 left-16 z-10 hidden items-center gap-4 md:flex"
        >
          <span className="flex h-12 w-12 items-center justify-center gap-1 rounded-full border border-gray-300">
            <span className="h-3 w-px bg-gray-600" />
            <span className="h-3 w-px bg-gray-600" />
          </span>
          <span className="mono-label text-gray-500">Scroll to explore</span>
        </motion.div>
      </section>

      <ProductMarquee />

      {/* ── TECH HIGHLIGHTS ──────────────────────────────── */}
      <section id="tech-stack" className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcfc] px-6 py-24 md:px-16 md:py-32">
        <SectionReveal className="flex flex-col items-center text-center">
          <p className="mono-label mb-4">
            <span className="text-gray-500">[ 02 ]</span>{" "}
            <span className="font-bold text-gray-900">Technical Highlights</span>
          </p>
          <h2 className="max-w-2xl text-3xl font-medium tracking-tight md:text-5xl">
            What this project demonstrates.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
            Each component of this portfolio project showcases a different full-stack AI engineering skill.
          </p>
        </SectionReveal>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="mt-14 grid w-full max-w-6xl gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          {TECH_HIGHLIGHTS.map((item, index) => (
            <motion.article
              key={item.label}
              variants={{
                initial: { opacity: 0, y: 32 },
                animate: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.55, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden border border-gray-300 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-editorial"
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] bg-black"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.08 + 0.2, duration: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
              <item.icon className="h-6 w-6 text-gray-400 transition group-hover:text-black" />
              <h3 className="mt-5 text-lg font-medium tracking-tight leading-tight">{item.label}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{item.desc}</p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {landingPills.slice(0, 6).map((pill) => (
            <motion.div
              key={pill.label}
              variants={fadeUp}
              className="flex items-center gap-2 rounded-full border border-gray-300 bg-white/60 px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-gray-800 backdrop-blur-sm transition hover:border-black hover:bg-black hover:text-white"
            >
              <pill.icon className="h-4 w-4" />
              {pill.label}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── WORKFLOW ──────────────────────────────────────── */}
      <section id="workflow" className="relative z-20 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fcfcfc] px-6 py-24 text-center md:py-32">
        <WorkflowAtmosphere />
        <SectionReveal className="relative z-10 flex flex-col items-center">
          <p className="mono-label mb-12">
            <span className="text-gray-500">[ 03 ]</span>{" "}
            <span className="font-bold text-gray-900">AI Generation Pipeline</span>
          </p>
          <InteractiveCommandTitle />
        </SectionReveal>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="relative z-10 mt-10 grid w-full max-w-6xl gap-3 md:grid-cols-4"
        >
          {workflow.map((item, index) => (
            <motion.div
              key={item}
              variants={{
                initial: { opacity: 0, y: 38, rotateX: 8 },
                animate: { opacity: 1, y: 0, rotateX: 0 },
              }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 900 }}
            >
              <div className="group relative overflow-hidden border border-gray-300 bg-white/88 p-5 text-left shadow-soft backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-editorial">
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-black"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.12, duration: 0.7 }}
                  style={{ transformOrigin: "left" }}
                />
                <p className="mono-label text-gray-500">0{index + 1}</p>
                <p className="mt-10 text-2xl font-medium tracking-tight">{item}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── STUDIO / DEEP DIVE ────────────────────────────── */}
      <section id="studio" className="dark-grid relative flex min-h-screen w-full flex-col bg-[#0a0a0a] text-white">
        <div className="px-8 pt-32 md:px-16 md:pt-44">
          <div className="flex flex-col justify-between gap-10 xl:flex-row">
            <h2 className="max-w-4xl text-[2rem] font-medium leading-[1.12] tracking-tight md:text-[4rem]">
              Built with prompt engineering, knowledge base RAG, and async AI generation state management.
            </h2>
            <div className="max-w-sm">
              <p className="mono-label leading-relaxed text-gray-400">
                A full-stack exploration of
                <br />
                AI application engineering.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Prompt Eng.", "RAG", "Async Flow", "Auth", "Design", "Docker"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-gray-600 px-5 py-2 text-[9px] font-mono uppercase tracking-widest text-gray-300 transition hover:border-white hover:bg-white hover:text-black"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 h-px bg-gray-800" />
        <div className="flex flex-1 flex-col md:flex-row">
          <div className="flex flex-1 flex-col justify-between border-b border-gray-800 p-10 md:w-[35%] md:border-b-0 md:border-r">
            <p className="text-xl tracking-[0.3em] text-gray-500">***</p>
            <MouseFace3D className="mx-auto h-72 w-72 rounded-full">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-500">AI Kernel</span>
            </MouseFace3D>
            <p className="mono-label text-[#888]">
              01 <span className="text-[#333]">/</span> 05
            </p>
          </div>
          <div className="flex flex-col md:w-[65%]">
            <div className="flex justify-between border-b border-gray-800 p-10">
              <p className="mono-label text-gray-400">Explore the full technical case study.</p>
              <Link href="/case-study" className="mono-label text-gray-500 hover:text-white hover:underline">
                View Case Study →
              </Link>
            </div>
            <div style={{ flex: 1, minHeight: "520px", position: "relative" }}>
              <FlowingMenu
                items={flowingItems}
                speed={18}
                textColor="#fff"
                bgColor="#0a0a0a"
                marqueeBgColor="#fff"
                marqueeTextColor="#111"
                borderColor="#222"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT LIBRARY PREVIEW ───────────────────────── */}
      <section id="library" className="flex min-h-screen flex-col justify-center bg-[#fcfcfc] px-6 py-24 md:px-16">
        <SectionReveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mono-label text-gray-500">[ 04 ] Content Library</p>
            <h2 className="mt-5 text-4xl font-medium tracking-tight md:text-6xl">
              From generation to management.
            </h2>
            <p className="mt-3 max-w-md text-sm text-gray-600">
              AI-generated content assets with CRUD, status workflow, search, and inline editing — all styled with an editorial design system.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/contents"
              className="mono-label inline-flex items-center gap-2 hover:underline"
            >
              View Library <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/case-study"
              className="mono-label inline-flex items-center gap-2 text-gray-500 hover:text-black hover:underline"
            >
              Case Study <FileText className="h-4 w-4" />
            </Link>
          </div>
        </SectionReveal>
        <SectionReveal className="mt-12">
          <RolodexGallery />
        </SectionReveal>
      </section>

      {/* ── ABOUT / BUILT BY ──────────────────────────────── */}
      <section id="about" className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fcfcfc] px-6 py-24 text-center md:px-16">
        <p className="mono-label text-gray-500">[ 05 ] About</p>
        <h2 className="mt-5 max-w-2xl text-3xl font-medium tracking-tight md:text-5xl">
          Built by a developer.
          <br />
          For developers.
        </h2>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-gray-600">
          This project was independently designed and developed as a full-stack AI SaaS portfolio piece.
          It demonstrates end-to-end AI application engineering — from prompt design and async generation
          pipelines to database modeling, authentication, responsive UI systems, and production Docker deployment.
        </p>

        <div className="mt-12 grid w-full max-w-3xl gap-3 md:grid-cols-4">
          {[
            { icon: Code2, label: "Full-Stack", desc: "Next.js + FastAPI" },
            { icon: Cpu, label: "AI Engineering", desc: "Prompt + RAG + Async" },
            { icon: Layers, label: "Product Design", desc: "Editorial B&W System" },
            { icon: Server, label: "Infrastructure", desc: "Docker + PG + Redis" },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="border border-gray-300 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-editorial"
            >
              <item.icon className="mx-auto h-6 w-6 text-gray-400" />
              <p className="mt-4 text-sm font-medium">{item.label}</p>
              <p className="mt-1 text-[11px] text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {/* TODO: Replace with real links */}
          <a href="#" className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-medium transition hover:border-black hover:-translate-y-0.5">
            <Github className="h-4 w-4" /> GitHub
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-medium transition hover:border-black hover:-translate-y-0.5">
            <FileText className="h-4 w-4" /> Resume
          </a>
          <a href="mailto:your-email@example.com" className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-medium transition hover:border-black hover:-translate-y-0.5">
            <Mail className="h-4 w-4" /> Email
          </a>
          <Link href="/case-study" className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-editorial">
            <ArrowRight className="h-4 w-4" /> Read Full Case Study
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          {/* TODO: Replace with your name */}
          Built by [Your Name] · AI / Full-Stack / Product Engineering Portfolio · 2026
        </p>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <section className="bg-[#111] px-6 py-20 text-white md:px-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mono-label text-gray-500">AI Content Agent — Portfolio Project</p>
            <p className="mt-1 text-xs text-gray-600">
              Not a commercial product. Built for learning, demonstration, and technical portfolios.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="inline-flex items-center gap-3 rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition hover:shadow-editorial">
              <Sparkles className="h-4 w-4" /> Try Live Demo
            </Link>
            <Link href="/case-study" className="inline-flex items-center gap-3 rounded-md border border-gray-700 px-5 py-3 text-sm font-medium text-white transition hover:border-white">
              <FileText className="h-4 w-4" /> Case Study
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
