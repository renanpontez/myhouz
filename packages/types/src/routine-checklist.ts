import type { Tables, Enums } from "./database";

export type RecurrenceType = Enums<"recurrence_type">;

export type RoutineChecklist = Tables<"routine_checklist">;

export type RoutineChecklistItem = Tables<"routine_checklist_item">;
