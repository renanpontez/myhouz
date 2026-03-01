import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { BackLink } from "@/components/shared/BackLink";
import { DeleteItemButton } from "@/components/items/DeleteItemButton";
import { ItemStatusActions } from "@/components/items/ItemStatusActions";
import { ItemActivity } from "@/components/items/ItemActivity";
import { Badge, Button } from "@home/ui";
import {
  Pencil,
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

interface ItemDetailPageProps {
  params: Promise<{ itemId: string }>;
}

export default async function ItemDetailPage({
  params,
}: ItemDetailPageProps) {
  const { itemId } = await params;
  const t = await getTranslations("items");
  const tCommon = await getTranslations("common");
  const tEnums = await getTranslations("enums");
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
      <BackLink href="/app/items" />

      <div className="mt-4 flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-2xl font-bold">{item.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {tEnums(`itemType.${item.type}`)}
            </Badge>
            <Badge variant="outline">
              {tEnums(`priority.${item.priority}`)}
            </Badge>
            <Badge
              variant={item.status === "done" ? "default" : "outline"}
            >
              {tEnums(`status.${item.status}`)}
            </Badge>
            {assigneeProfile && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {assigneeProfile.name ?? assigneeProfile.email}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/app/items/${itemId}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              {tCommon("edit")}
            </Button>
          </Link>
          <DeleteItemButton householdId={householdId} itemId={itemId} />
        </div>
      </div>

      {/* Status actions */}
      <div className="mt-6">
        <ItemStatusActions
          householdId={householdId}
          itemId={itemId}
          currentStatus={item.status}
        />
      </div>

      {/* Price */}
      {item.price != null && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("priceLabel")}
          </h3>
          <p className="mt-1 text-lg font-semibold">
            R$ {Number(item.price).toFixed(2)}
          </p>
        </div>
      )}

      {/* Link */}
      {item.link && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("linkLabel")}
          </h3>
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

      {/* Photos */}
      {item.photos && item.photos.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("photosLabel")}
          </h3>
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

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("tagsLabel")}
          </h3>
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

      {/* Notes */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("notesLabel")}
        </h3>
        <p className="mt-1 whitespace-pre-wrap text-sm">
          {item.notes || t("noNotes")}
        </p>
      </div>

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
