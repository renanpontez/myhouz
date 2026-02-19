export const APP_NAME = "MyHouz";

export const ROUTES = {
  login: "/login",
  signup: "/signup",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  items: "/items",
  routines: "/routines",
  reminders: "/reminders",
  urgent: "/urgent",
  members: "/members",
  settings: "/settings",
} as const;

export const ITEM_TYPE_LABELS = {
  buy: "Buy",
  repair: "Repair",
  fix: "Fix",
} as const;

export const ITEM_PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const;

export const ITEM_STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
} as const;

export const RECURRENCE_LABELS = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  custom: "Custom",
} as const;

export const MEMBER_ROLE_LABELS = {
  owner: "Owner",
  member: "Member",
  guest: "Guest",
} as const;
