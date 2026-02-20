"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Input } from "@home/ui";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
}

export function TagInput({ value, onChange, max = 10 }: TagInputProps) {
  const t = useTranslations("items");
  const { household } = useHousehold();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/household/${household.id}/items/tags`)
      .then((res) => res.json())
      .then((json) => setAllTags(json.data ?? []))
      .catch(() => {});
  }, [household.id]);

  useEffect(() => {
    if (input.length > 0) {
      const filtered = allTags.filter(
        (tag) =>
          tag.toLowerCase().includes(input.toLowerCase()) &&
          !value.includes(tag),
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, allTags, value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addTag(tag: string) {
    const normalized = tag.toLowerCase().trim();
    if (
      normalized &&
      !value.includes(normalized) &&
      value.length < max &&
      normalized.length <= 50
    ) {
      onChange([...value, normalized]);
    }
    setInput("");
    setShowSuggestions(false);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) {
        addTag(input);
      }
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      const lastTag = value[value.length - 1];
      if (lastTag) removeTag(lastTag);
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{t("tagsLabel")}</label>

      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {value.length < max && (
        <div ref={wrapperRef} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder={t("tagsPlaceholder")}
          />

          {showSuggestions && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border bg-popover shadow-md">
              {suggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="block w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
