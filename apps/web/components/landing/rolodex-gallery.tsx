"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import "./rolodex-gallery.css";

/* ------------------------------------------------------------------ */
/*  Gallery item type                                                 */
/* ------------------------------------------------------------------ */

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
}

/* ------------------------------------------------------------------ */
/*  Default content matching AI Content Agent theme                   */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: GalleryItem[] = [
  {
    id: "CNT-2048",
    title: "Xiaohongshu Grass-roots Copy",
    category: "小红书 / 种草文案",
    description:
      "面向25-35岁通勤女性的护肤新品推广。以真实体验口吻切入，融合成分科普与使用场景，配合高质感产品图，实现从种草到转化的完整链路。",
    image: "https://picsum.photos/seed/rx1/400/560",
    link: "/contents",
  },
  {
    id: "CNT-2047",
    title: "Douyin Short Video Script",
    category: "抖音 / 短视频脚本",
    description:
      "15秒快节奏口播脚本，前3秒钩子设计抓注意力，中段产品卖点密集输出，结尾强CTA引导点击。适配抖音信息流投放节奏。",
    image: "https://picsum.photos/seed/rx2/400/560",
    link: "/contents",
  },
  {
    id: "CNT-2046",
    title: "WeChat In-depth Article",
    category: "公众号 / 深度长文",
    description:
      "1500字品牌故事长文，以创始人视角讲述产品研发背后的洞察。结构化排版配合数据图表，适合微信生态深度阅读与转发传播。",
    image: "https://picsum.photos/seed/rx3/400/560",
    link: "/contents",
  },
  {
    id: "CNT-2045",
    title: "Weibo Social Buzz Campaign",
    category: "微博 / 话题营销",
    description:
      "热点借势话题策划，短文案+九宫格图片组合。预埋互动钩子引导UGC参与，配合KOL矩阵扩散，最大化话题曝光量。",
    image: "https://picsum.photos/seed/rx4/400/560",
    link: "/contents",
  },
  {
    id: "CNT-2044",
    title: "Bilibili Community Script",
    category: "B站 / 社区文案",
    description:
      "5分钟中视频脚本，开头抛出争议性观点建立期待，中段拆解产品技术原理，结尾引导弹幕互动。适配B站年轻用户语感。",
    image: "https://picsum.photos/seed/rx5/400/560",
    link: "/contents",
  },
  {
    id: "CNT-2043",
    title: "Zhihu Authority Answer",
    category: "知乎 / 专业回答",
    description:
      "以行业专家的身份切入专业问题，通过数据引用与逻辑推导建立权威感。在结论处自然带入产品作为解决方案，软性种草。",
    image: "https://picsum.photos/seed/rx6/400/560",
    link: "/contents",
  },
  {
    id: "CNT-2042",
    title: "Taobao Product Detail Page",
    category: "淘宝 / 详情页",
    description:
      "结构化产品详情：痛点引入→成分解析→使用效果→用户证言→限时优惠。每个模块控制在2屏以内，适配移动端快速浏览习惯。",
    image: "https://picsum.photos/seed/rx7/400/560",
    link: "/contents",
  },
  {
    id: "CNT-2041",
    title: "Instagram Visual Strategy",
    category: "Instagram / 视觉策划",
    description:
      "9宫格视觉叙事：统一滤镜调色，每张图承担独立信息块。从产品静物→使用场景→生活方式逐层递进，构建品牌视觉体系。",
    image: "https://picsum.photos/seed/rx8/400/560",
    link: "/contents",
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const CARD_W = 190;
const CARD_H = 266;
const RADIUS = 360;
const PERSPECTIVE = 900;

/* ------------------------------------------------------------------ */
/*  RolodexGallery                                                    */
/* ------------------------------------------------------------------ */

interface RolodexGalleryProps {
  items?: GalleryItem[];
}

export default function RolodexGallery({ items = DEFAULT_ITEMS }: RolodexGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const accumulatedScrollRef = useRef(0);
  const lastActiveRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const n = items.length;
  const angleStep = 360 / n;

  /* ---- Scroll → target angle ---- */
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    accumulatedScrollRef.current += e.deltaY;
    targetAngleRef.current = (accumulatedScrollRef.current / 2800) * 360;
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  /* ---- Render loop: lerp + direct DOM write ---- */
  useEffect(() => {
    function loop() {
      const target = targetAngleRef.current;
      const current = currentAngleRef.current;
      let diff = ((target - current) % 360 + 540) % 360 - 180;
      currentAngleRef.current = current + diff * 0.07;

      // Direct DOM write — no React re-render
      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${currentAngleRef.current}deg)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ---- Active-index tracker ---- */
  useEffect(() => {
    function track() {
      const angle = ((currentAngleRef.current % 360) + 360) % 360;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < n; i++) {
        const worldAngle = ((angle + i * angleStep) % 360 + 360) % 360;
        const dist = Math.min(worldAngle, 360 - worldAngle);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      if (best !== lastActiveRef.current) {
        lastActiveRef.current = best;
        setIsTransitioning(true);
        setActiveIndex(best);
        setTimeout(() => setIsTransitioning(false), 600);
      }
    }
    const id = setInterval(track, 80);
    return () => clearInterval(id);
  }, [n, angleStep]);

  /* ---- Card transforms (static per card) ---- */
  const cards = useMemo(() => {
    return items.map((item, i) => ({
      item,
      transform: `rotateY(${i * angleStep}deg) translateZ(${RADIUS}px)`,
    }));
  }, [items, angleStep]);

  const activeItem = items[activeIndex];

  return (
    <div className="rolodex-root">
      {/* ========== LEFT PANEL ========== */}
      <div className="rolodex-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rolodex-left-inner"
          >
            <p className="mono-label text-gray-400">
              {activeItem.id} &nbsp;/&nbsp; {activeItem.category}
            </p>
            <h3 className="rolodex-title">{activeItem.title}</h3>
            <p className="rolodex-desc">{activeItem.description}</p>

            <Link href={activeItem.link} className="rolodex-link">
              View project
              <span className="rolodex-link-arrow">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>

            <div className="rolodex-cover">
              <img src={activeItem.image} alt={activeItem.title} className="rolodex-cover-img" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ========== RIGHT PANEL — 3D Ring ========== */}
      <section ref={sectionRef} className="rolodex-right">
        <div className="rolodex-stage" style={{ perspective: PERSPECTIVE }}>
          <div ref={ringRef} className="rolodex-ring">
            {cards.map(({ item, transform }, i) => {
              const active = i === activeIndex;
              return (
                <div
                  key={item.id}
                  className={`rolodex-card-slot ${active ? "is-active" : ""}`}
                  style={{
                    transform,
                    width: CARD_W,
                    height: CARD_H,
                    marginLeft: -(CARD_W / 2),
                    marginTop: -(CARD_H / 2),
                  }}
                >
                  <div className="rolodex-card">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="rolodex-card-img"
                      draggable={false}
                    />
                    <div className="rolodex-card-label">
                      <span className="mono-label text-white/70">{item.id}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edge gradients */}
        <div className="rolodex-gradient-left" />
        <div className="rolodex-gradient-right" />
      </section>
    </div>
  );
}
