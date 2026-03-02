"use client";

import { useTranslations } from "next-intl";
import { useHousehold, useUser } from "@home/auth/hooks";
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
    <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-card">
      <div className="flex items-center gap-4">
        {member.avatar_url ? (
          <img src={member.avatar_url} alt="" className="h-11 w-11 rounded-full bg-muted" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            {initial}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-medium">
              {member.name ?? member.email}
            </span>
            {isCurrentUser && (
              <span className="text-sm text-muted-foreground">
                {t("you")}
              </span>
            )}
          </div>
          {member.name && (
            <p className="text-sm text-muted-foreground">{member.email}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <RoleBadge role={membership.role} />
        {isOwner && !isCurrentUser && (
          <MemberActions membership={membership} memberName={member.name ?? member.email} />
        )}
      </div>
    </div>
  );
}
