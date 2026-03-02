import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { cn } from "@home/ui";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ItemDetailActions } from "@/components/items/ItemDetailActions";
import { ItemStatusActions } from "@/components/items/ItemStatusActions";
import { ItemActivity } from "@/components/items/ItemActivity";
import {
  User,
  ShoppingCart,
  Wrench,
  Settings2,
  ExternalLink,
} from "lucide-react";

const TYPE_ICONS = {
  buy: ShoppingCart,
  repair: Wrench,
  fix: Settings2,
} as const;

const PRIORITY_BG = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-muted text-foreground",
  low: "bg-muted text-muted-foreground",
} as const;

interface ItemDetailPageProps {
  params: Promise<{ itemId: string }>;
}

export default async function ItemDetailPage({
  params,
}: ItemDetailPageProps) {
  const { itemId } = await params;
  const t = await getTranslations("items");
  const tEnums = await getTranslations("enums");
  const tNav = await getTranslations("nav");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  const { profile } = await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { data: item } = await supabase
    .from("household_item")
    .select(
      "id, name, type, priority, status, assigned_to, notes, price, photos, link, tags, added_by, created_at, updated_at, resolved_at",
    )
    .eq("id", itemId)
    .eq("household_id", householdId)
    .single();

  if (!item) notFound();

  // Fetch household members for assignee display
  const { data: members } = await supabase
    .from("household_member")
    .select("user_id, profile:profile(id, name, email)")
    .eq("household_id", householdId);

  // Fetch comments for this item
  const { data: comments } = await supabase
    .from("item_comment")
    .select("id, content, author_id, created_at")
    .eq("item_id", itemId)
    .eq("household_id", householdId)
    .order("created_at", { ascending: true });

  // Build memberNames map for the activity timeline
  const memberNames: Record<string, string> = {};
  for (const m of members ?? []) {
    const p = m.profile as {
      id: string;
      name: string | null;
      email: string;
    } | null;
    if (p) {
      memberNames[p.id] = p.name ?? p.email;
    }
  }

  const assigneeProfile = item.assigned_to
    ? (() => {
        const member = members?.find((m) => {
          const p = m.profile as {
            id: string;
            name: string | null;
            email: string;
          } | null;
          return p?.id === item.assigned_to;
        });
        return member?.profile as {
          id: string;
          name: string | null;
          email: string;
        } | null;
      })()
    : null;

  const TypeIcon = TYPE_ICONS[item.type as keyof typeof TYPE_ICONS];

  return (
    <div className="px-4 py-6 sm:p-6">
      <Breadcrumb items={[
        { label: tNav("dashboard"), href: "/app/dashboard" },
        { label: t("title"), href: "/app/items" },
        { label: item.name },
      ]} />

      {/* Header */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              PRIORITY_BG[item.priority as keyof typeof PRIORITY_BG],
            )}
          >
            <TypeIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold sm:text-2xl">
              {item.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {tEnums(`itemType.${item.type}`)}
              <span className="mx-1.5 text-muted-foreground/40">&middot;</span>
              {tEnums(`priority.${item.priority}`)}
              {assigneeProfile && (
                <>
                  <span className="mx-1.5 text-muted-foreground/40">&middot;</span>
                  <span className="inline-flex items-center gap-1">
                    <User className="inline h-3 w-3" />
                    {assigneeProfile.name ?? assigneeProfile.email}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <ItemDetailActions householdId={householdId} itemId={itemId} />
      </div>

      {/* Status segmented control */}
      <div className="mt-5">
        <ItemStatusActions
          householdId={householdId}
          itemId={itemId}
          currentStatus={item.status}
        />
      </div>

      {/* Metadata card */}
      {(item.price != null || item.link || (item.tags && item.tags.length > 0)) && (
        <div className="mt-5 rounded-2xl bg-white shadow-sm dark:bg-card">
          {/* Price & Link */}
          {(item.price != null || item.link) && (
            <div className="grid grid-cols-2 gap-4 px-5 py-4">
              {item.price != null && (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                    {t("priceLabel")}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    R$ {Number(item.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
              {item.link && (
                <div className={item.price != null ? "text-right" : ""}>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                    {t("linkLabel")}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t("openLink")}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="border-t px-5 py-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {t("tagsLabel")}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Photos */}
      {item.photos && item.photos.length > 0 && (
        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
            {t("photosLabel")}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.photos.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-24 w-24 overflow-hidden rounded-lg border"
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {item.notes && (
        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
            {t("notesLabel")}
          </p>
          <p className="mt-2 whitespace-pre-wrap rounded-lg bg-muted/40 px-3 py-2.5 text-sm">
            {item.notes}
          </p>
        </div>
      )}

      {/* Activity timeline + comments */}
      <div className="mt-8">
        <ItemActivity
          householdId={householdId}
          itemId={itemId}
          item={{
            added_by: item.added_by,
            created_at: item.created_at,
            updated_at: item.updated_at,
            resolved_at: item.resolved_at,
            status: item.status,
          }}
          comments={comments ?? []}
          currentUserId={profile.id}
          memberNames={memberNames}
        />
      </div>
    </div>
  );
}
