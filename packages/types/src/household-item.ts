import type { Tables, Enums } from "./database";

export type ItemType = Enums<"item_type">;
export type ItemPriority = Enums<"item_priority">;
export type ItemStatus = Enums<"item_status">;

export type HouseholdItem = Tables<"household_item">;
