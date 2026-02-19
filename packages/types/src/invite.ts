import type { Tables, Enums } from "./database";

export type InviteStatus = Enums<"invite_status">;

export type HouseholdInvite = Tables<"household_invite">;
