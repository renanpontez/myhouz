"use client";

import { useEffect, useRef } from "react";

const BLOBS = [
  { x: "-5%", y: -100, w: 700, h: 550, color: "hsl(293 76% 54% / 0.22)", blur: 80, speed: 0.15, radius: "40% 60% 70% 30% / 60% 30% 70% 40%" },
  { x: "60%", y: 200, w: 500, h: 600, color: "hsl(270 60% 70% / 0.25)", blur: 70, speed: 0.25, radius: "70% 30% 50% 50% / 30% 60% 40% 70%" },
  { x: "5%", y: 700, w: 800, h: 650, color: "hsl(330 60% 70% / 0.15)", blur: 90, speed: 0.1, radius: "50% 50% 30% 70% / 70% 40% 60% 30%" },
  { x: "70%", y: 1200, w: 450, h: 550, color: "hsl(260 50% 65% / 0.20)", blur: 70, speed: 0.2, radius: "60% 40% 60% 40% / 40% 70% 30% 60%" },
  { x: "-10%", y: 1800, w: 650, h: 520, color: "hsl(293 76% 54% / 0.18)", blur: 80, speed: 0.3, radius: "30% 70% 40% 60% / 60% 40% 70% 30%" },
  { x: "50%", y: 2400, w: 600, h: 700, color: "hsl(280 50% 60% / 0.15)", blur: 75, speed: 0.15, radius: "70% 30% 60% 40% / 50% 60% 40% 50%" },
  { x: "15%", y: 3100, w: 560, h: 500, color: "hsl(340 50% 70% / 0.18)", blur: 80, speed: 0.25, radius: "45% 55% 35% 65% / 65% 35% 55% 45%" },
  { x: "65%", y: 3800, w: 520, h: 460, color: "hsl(270 60% 70% / 0.12)", blur: 70, speed: 0.2, radius: "55% 45% 65% 35% / 35% 65% 45% 55%" },
];

export function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const children = container?.children;
        if (!children) {
          ticking = false;
          return;
        }
        for (let i = 0; i < children.length; i++) {
          const blob = BLOBS[i];
          if (!blob) break;
          const el = children[i] as HTMLElement;
          const offset = -(scrollY * blob.speed);
          el.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className="absolute will-change-transform"
          style={{
            left: blob.x,
            top: blob.y,
            width: blob.w,
            height: blob.h,
            borderRadius: blob.radius,
            background: `radial-gradient(ellipse, ${blob.color} 0%, transparent 65%)`,
            filter: `blur(${blob.blur}px)`,
          }}
        />
      ))}
    </div>
  );
}
