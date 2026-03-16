"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border/60 border-y border-border/60">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center gap-4 py-5 text-left group"
              aria-expanded={isOpen}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-200 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pl-12 pr-4 text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
