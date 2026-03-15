"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Input,
  cn,
} from "@home/ui";
import { Smile, X } from "lucide-react";

interface TaskIconPickerProps {
  value: string | null;
  onChange: (icon: string | null) => void;
}

const EMOJI_SECTIONS: { key: string; emojis: string[] }[] = [
  {
    key: "home",
    emojis: [
      "🏠", "🏡", "🛋️", "🪑", "🛏️", "🚿", "🛁", "🚽",
      "🪞", "🧹", "🧺", "🧽", "🪣", "🗑️", "💡", "🔑",
      "🔒", "🚪", "🪟", "🧯", "🪴",
    ],
  },
  {
    key: "food",
    emojis: [
      "🍎", "🍊", "🍋", "🍌", "🍇", "🍓", "🫐", "🍑",
      "🥑", "🥕", "🌽", "🥦", "🧅", "🍅", "🥚", "🧀",
      "🍞", "🥐", "🥖", "🍕", "🌮", "🍔", "🥗", "🍜",
      "🍳", "🥘", "🍰", "🧁", "🍪", "☕", "🍵", "🥛",
      "🧃", "🍺", "🍷",
    ],
  },
  {
    key: "shopping",
    emojis: [
      "🛒", "🛍️", "💳", "💰", "💵", "🏷️", "🧾", "📦",
      "🎁", "🏪",
    ],
  },
  {
    key: "tools",
    emojis: [
      "🔧", "🔨", "🪛", "🪚", "🔩", "🪜", "🧰", "🪠",
      "🖌️", "✂️", "📏", "📐", "🔌", "💻",
    ],
  },
  {
    key: "health",
    emojis: [
      "💊", "🩹", "🩺", "🌡️", "💉", "❤️", "🏥", "🧴",
      "🪥", "🧼", "🛡️",
    ],
  },
  {
    key: "pets",
    emojis: [
      "🐶", "🐱", "🐟", "🐦", "🐹", "🐰", "🐢", "🦎",
      "🐾", "🐛",
    ],
  },
  {
    key: "garden",
    emojis: [
      "🌱", "🌻", "🌸", "🌿", "🍀", "🌳", "🌲", "🪻",
      "☀️", "🌧️", "❄️", "☂️",
    ],
  },
  {
    key: "transport",
    emojis: ["🚗", "🚲", "🚌", "✈️", "⛽", "🛵", "🚕"],
  },
  {
    key: "fitness",
    emojis: [
      "🏋️", "🏆", "🎯", "🔥", "⭐", "👑", "💎", "🎖️",
      "🧘", "🏃",
    ],
  },
  {
    key: "people",
    emojis: [
      "👶", "👦", "👧", "🧑", "👨", "👩", "🧓", "👨‍👩‍👧",
      "👫", "🤝",
    ],
  },
  {
    key: "misc",
    emojis: [
      "📱", "📷", "🎵", "🎧", "📚", "✏️", "📌", "📅",
      "⏰", "🔔", "📬", "🗂️", "📋", "✅", "⚡", "🎉",
      "🌍", "🗺️", "💼", "🎨", "🚀",
    ],
  },
];

const ALL_EMOJIS = EMOJI_SECTIONS.flatMap((s) => s.emojis);

const SECTION_LABELS: Record<string, string> = {
  home: "Home",
  food: "Food & Drink",
  shopping: "Shopping",
  tools: "Tools",
  health: "Health",
  pets: "Pets",
  garden: "Garden",
  transport: "Transport",
  fitness: "Fitness",
  people: "People",
  misc: "Other",
};

export function IconPicker({ value, onChange }: TaskIconPickerProps) {
  const t = useTranslations("routines");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return null;
    return ALL_EMOJIS.filter((e) => e.includes(search.trim()));
  }, [search]);

  const handleSelect = (emoji: string) => {
    onChange(emoji);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{t("iconLabel")}</label>
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSearch(""); }}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="gap-2">
              {value ? (
                <span className="text-lg leading-none">{value}</span>
              ) : (
                <Smile className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{t("selectIcon")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start">
            <Input
              placeholder={t("selectIcon")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
            <div className="h-60 overflow-y-auto">
              {filteredEmojis ? (
                filteredEmojis.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {filteredEmojis.map((emoji, i) => (
                      <button
                        key={`${emoji}-${i}`}
                        type="button"
                        onClick={() => handleSelect(emoji)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-md text-xl transition-colors hover:bg-accent",
                          value === emoji && "bg-primary/10 ring-2 ring-primary",
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No results
                  </p>
                )
              ) : (
                EMOJI_SECTIONS.map((section) => (
                  <div key={section.key} className="mb-3">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {SECTION_LABELS[section.key]}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {section.emojis.map((emoji, i) => (
                        <button
                          key={`${emoji}-${i}`}
                          type="button"
                          onClick={() => handleSelect(emoji)}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-md text-xl transition-colors hover:bg-accent",
                            value === emoji && "bg-primary/10 ring-2 ring-primary",
                          )}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-3 w-3" />
            {t("noIcon")}
          </button>
        )}
      </div>
    </div>
  );
}
