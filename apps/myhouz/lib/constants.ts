export const APP_NAME = "MyHouz";

export const ROUTES = {
  login: "/login",
  signup: "/signup",
  onboarding: "/app/onboarding",
  onboardingCreate: "/app/onboarding/create",
  dashboard: "/app/dashboard",
  items: "/app/items",
  itemsNew: "/app/items/new",
  routines: "/app/routines",
  routinesNew: "/app/routines/new",
  reminders: "/app/reminders",
  remindersNew: "/app/reminders/new",
  urgent: "/app/urgent",
  urgentNew: "/app/urgent/new",
  members: "/app/members",
  membersInvite: "/app/members/invite",
  settings: "/app/settings",
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
