import type { Tables, Enums } from "./database";

export type MemberRole = Enums<"member_role">;

export type Household = Tables<"household">;

export type HouseholdMember = Tables<"household_member">;
