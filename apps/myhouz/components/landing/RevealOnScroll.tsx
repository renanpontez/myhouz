"use client";

import type { ReactNode } from "react";
import { useInView, cn } from "@home/ui";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  staggerIndex?: number;
  threshold?: number;
}

export function RevealOnScroll({
  children,
  className,
  staggerIndex = 0,
  threshold,
}: RevealOnScrollProps) {
  const [ref, isInView] = useInView({ threshold });

  return (
    <div
      ref={ref}
      className={cn(
        !isInView && "reveal-hidden opacity-0 translate-y-5",
        isInView && "animate-reveal-up",
        className
      )}
      style={
        staggerIndex > 0
          ? { animationDelay: `${staggerIndex * 80}ms` }
          : undefined
      }
    >
      {children}
    </div>
  );
}
