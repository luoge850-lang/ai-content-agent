"use client";

import { Bot, CalendarClock, FileText, ImageIcon, Radio, Send } from "lucide-react";

const items = [
  { label: "Product Link", icon: Bot },
  { label: "Audience Signal", icon: Radio },
  { label: "Platform Copy", icon: FileText },
  { label: "Image Direction", icon: ImageIcon },
  { label: "Schedule Plan", icon: CalendarClock },
  { label: "Publish Queue", icon: Send }
];

export function ProductMarquee() {
  return (
    <div className="relative overflow-hidden bg-[#fcfcfc] py-5">
      <div className="animate-marquee flex w-max gap-3">
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="flex h-16 w-64 items-center justify-between border border-gray-300 bg-white px-5 shadow-soft"
          >
            <span className="mono-label text-gray-500">{String((index % items.length) + 1).padStart(2, "0")}</span>
            <span className="text-lg font-medium tracking-tight">{item.label}</span>
            <item.icon className="h-5 w-5" />
          </div>
        ))}
      </div>
    </div>
  );
}
