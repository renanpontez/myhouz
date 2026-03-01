"use client";

import { useState, useOptimistic, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@home/ui";
import { cn } from "@home/ui";
import {
  Plus,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Loader2,
  Send,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { addItemComment, deleteItemComment } from "@/actions/item-comments";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
}

interface ItemActivityProps {
  householdId: string;
  itemId: string;
  item: {
    added_by: string;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
    status: string;
  };
  comments: Comment[];
  currentUserId: string;
  memberNames: Record<string, string>;
}

type TimelineEntry =
  | { type: "created"; date: string; authorId: string }
  | { type: "comment"; date: string; authorId: string; comment: Comment }
  | { type: "resolved"; date: string };

function buildTimeline(
  item: ItemActivityProps["item"],
  comments: Comment[],
): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  entries.push({
    type: "created",
    date: item.created_at,
    authorId: item.added_by,
  });

  for (const comment of comments) {
    entries.push({
      type: "comment",
      date: comment.created_at,
      authorId: comment.author_id,
      comment,
    });
  }

  if (item.resolved_at && item.status === "done") {
    entries.push({
      type: "resolved",
      date: item.resolved_at,
    });
  }

  entries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return entries;
}

export function ItemActivity({
  householdId,
  itemId,
  item,
  comments: initialComments,
  currentUserId,
  memberNames,
}: ItemActivityProps) {
  const t = useTranslations("items");
  const locale = useLocale();
  const dateLocale = locale === "pt-BR" ? ptBR : enUS;

  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state: Comment[], action: { type: "add"; comment: Comment } | { type: "delete"; id: string }) => {
      if (action.type === "add") {
        return [...state, action.comment];
      }
      return state.filter((c) => c.id !== action.id);
    },
  );

  const timeline = buildTimeline(item, optimisticComments);

  function formatRelative(date: string) {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: dateLocale,
    });
  }

  function getAuthorName(authorId: string) {
    return memberNames[authorId] ?? "?";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    const tempComment: Comment = {
      id: crypto.randomUUID(),
      content: trimmed,
      author_id: currentUserId,
      created_at: new Date().toISOString(),
    };

    setContent("");
    startTransition(async () => {
      addOptimisticComment({ type: "add", comment: tempComment });
      const result = await addItemComment(householdId, itemId, trimmed);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  function handleDelete(commentId: string) {
    const confirmed = window.confirm(t("commentDeleteConfirm"));
    if (!confirmed) return;

    setDeletingId(commentId);
    startTransition(async () => {
      addOptimisticComment({ type: "delete", id: commentId });
      const result = await deleteItemComment(householdId, itemId, commentId);
      if (result.error) {
        toast.error(result.error);
      }
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        {t("historyTitle")}
      </h3>

      {/* Timeline */}
      <div className="relative space-y-0">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />

        {timeline.map((entry, i) => (
          <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
            {/* Dot */}
            <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
              {entry.type === "created" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <Plus className="h-3 w-3 text-primary" />
                </div>
              )}
              {entry.type === "comment" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                  <MessageSquare className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              {entry.type === "resolved" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              {entry.type === "created" && (
                <p className="text-sm">
                  <span className="font-medium">
                    {getAuthorName(entry.authorId)}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {t("createdBy")}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatRelative(entry.date)}
                  </span>
                </p>
              )}

              {entry.type === "comment" && (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {getAuthorName(entry.authorId)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelative(entry.date)}
                    </span>
                    {entry.comment.author_id === currentUserId && (
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.comment.id)}
                        disabled={deletingId === entry.comment.id}
                        className="ml-auto text-muted-foreground/50 transition-colors hover:text-destructive"
                      >
                        {deletingId === entry.comment.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground/80">
                    {entry.comment.content}
                  </p>
                </div>
              )}

              {entry.type === "resolved" && (
                <p className="text-sm">
                  <span className="text-muted-foreground">
                    {t("resolvedItem")}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatRelative(entry.date)}
                  </span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("commentPlaceholder")}
          maxLength={2000}
          className={cn(
            "flex-1 rounded-lg border bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground/60",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          )}
        />
        <Button
          type="submit"
          size="sm"
          disabled={isPending || !content.trim()}
          className="shrink-0"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
