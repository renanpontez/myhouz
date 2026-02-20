"use client";

import { useTranslations } from "next-intl";
import { useHousehold, useUser } from "@home/auth/hooks";
import { Card } from "@home/ui";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { MemberActions } from "./MemberActions";
import type { Profile, HouseholdMember } from "@home/types";

interface MemberCardProps {
  member: Profile;
  membership: HouseholdMember;
}

export function MemberCard({ member, membership }: MemberCardProps) {
  const t = useTranslations("members");
  const user = useUser();
  const { isOwner } = useHousehold();

  const isCurrentUser = member.id === user.id;
  const initial = (member.name ?? member.email)?.[0]?.toUpperCase() ?? "?";

  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
          {initial}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {member.name ?? member.email}
            </span>
            {isCurrentUser && (
              <span className="text-xs text-muted-foreground">
                {t("you")}
              </span>
            )}
          </div>
          {member.name && (
            <p className="text-xs text-muted-foreground">{member.email}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <RoleBadge role={membership.role} />
        {isOwner && !isCurrentUser && (
          <MemberActions membership={membership} memberName={member.name ?? member.email} />
        )}
      </div>
    </Card>
  );
}
