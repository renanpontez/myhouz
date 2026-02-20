# MyHouz — Progress Tracker

**Last updated:** 2026-02-20
**Status:** MVP in progress — core features implemented

---

## Legend

- Done = Fully implemented and working
- Partial = Mostly implemented, minor gaps noted
- Stub = File exists with placeholder content, needs real implementation
- Not started = No file or code exists yet

---

## 1. Infrastructure & DevOps

| Item | Status | Notes |
|---|---|---|
| Turborepo monorepo setup | Done | `turbo.json`, root `package.json` with npm workspaces |
| TypeScript config (base) | Done | `packages/config/typescript/base.json` |
| ESLint config (shared) | Done | `packages/config/eslint/index.js` |
| Tailwind preset (shared) | Done | `packages/config/tailwind/preset.js` with shadcn/ui colors |
| Prettier config | Done | `.prettierrc` at root |
| `.gitignore` | Done | |
| `.env.example` | Done | All required vars listed |
| Supabase remote project | Done | Connected with project ID + keys |
| Database migrations | Done | All MVP tables applied to remote DB |
| Generated DB types (`db:types`) | Done | Auto-generated `database.ts` from remote, `npm run db:types` |
| i18n setup (next-intl) | Done | `messages/pt-BR.json` + `messages/en-US.json`, locale routing via `i18n/request.ts` |
| CI/CD pipeline | Not started | |
| Vitest setup | Not started | |
| Playwright setup | Not started | |

---

## 2. Shared Packages

### @home/types

| Item | Status | Notes |
|---|---|---|
| `database.ts` (auto-generated from Supabase) | Done | Generated via `npm run db:types` from remote DB |
| `Profile` type | Done | |
| `Household` type | Done | |
| `HouseholdMember` type | Done | |
| `HouseholdInvite` type | Done | |
| `HouseholdItem` type | Done | |
| `RoutineTask` type | Done | Replaced `RoutineChecklist` — now a single-task model with `routine_task` table |
| `RoutineTaskCompletion` type | Done | Tracks individual completions per task (replaced `RoutineChecklistItem`) |
| `RecurrenceMeta` discriminated union | Done | `{ type: "days_of_week"; days: number[] }` or `{ type: "interval"; every: number; unit: string }` |
| `Reminder` type | Done | |
| `UrgentProblem` type | Done | |
| `Notification` type | Done | |
| `ApiResponse` / `ApiError` / `PaginatedResponse` | Done | |
| Zod schemas — auth | Done | `createLoginSchema`, `createSignupSchema` |
| Zod schemas — household | Done | `createHouseholdSchema`, `createUpdateHouseholdSchema` |
| Zod schemas — routine tasks | Done | `createTaskSchema`, `createUpdateTaskSchema`, `recurrenceMetaSchema` |
| Zod schemas — items | Done | `createItemSchema`, `createUpdateItemSchema` |
| Zod schemas — reminders | Done | `createReminderSchema`, `createUpdateReminderSchema` |
| Zod schemas — urgent | Done | `createUrgentProblemSchema`, `createUpdateUrgentProblemSchema` |
| Zod schemas — invite | Done | `createGenerateInviteSchema` |
| Zod schemas — profile | Done | `createUpdateProfileSchema` |

### @home/db

| Item | Status | Notes |
|---|---|---|
| `createServerClient()` | Done | With proper cookie handling via `@supabase/ssr` |
| `createRouteHandlerClient()` | Done | Same cookie handling, for API routes |
| `createBrowserClient()` | Done | For client-side auth operations |
| `createAdminClient()` | Done | Uses service role key, bypasses RLS |
| `env.ts` (env var validation) | Done | |

### @home/auth

| Item | Status | Notes |
|---|---|---|
| `getSession()` | Done | Returns session or null |
| `getUser()` | Done | Redirects to /login if no session |
| `getUserWithRole(householdId)` | Done | Returns profile + membership + role, redirects to /app/onboarding if not member |
| `UserProvider` (context) | Done | Provides `{ user, households }` |
| `HouseholdProvider` (context) | Done | Provides `{ household, membership, role, members, isOwner }` |
| `useUser()` hook | Done | |
| `useUserHouseholds()` hook | Done | |
| `useHousehold()` hook | Done | Includes `isOwner` convenience boolean |

### @home/ui

| Item | Status | Notes |
|---|---|---|
| `cn()` utility | Done | clsx + tailwind-merge |
| Button component | Done | Full CVA variants |
| Input component | Done | |
| Card component | Done | Card, CardHeader, CardTitle, etc. |
| Badge component | Done | |
| Skeleton component | Done | |
| Dialog component | Done | |
| Popover component | Done | |
| Select component | Done | |
| DropdownMenu component | Done | |
| Sheet component | Done | |
| Tabs component | Done | |
| Checkbox component | Done | |
| Toast (via sonner) | Done | |
| `useMediaQuery` hook | Done | |
| `useCopyToClipboard` hook | Done | |
| `useDebounce` hook | Done | |

---

## 3. App Shell & Layouts

| Item | Status | Notes |
|---|---|---|
| `RootLayout` | Done | Inter font, ThemeProvider, Toaster, i18n locale |
| `AuthLayout` | Done | Calls `getUser()`, wraps in `UserProvider` |
| `HouseholdLayout` | Done | Reads cookie, `getUserWithRole`, `HouseholdProvider` |
| `OnboardingLayout` | Done | Minimal centered layout |
| `middleware.ts` | Done | Auth redirects, session refresh, public/protected route rules |
| `globals.css` | Done | CSS variables for light/dark themes |
| `not-found.tsx` | Done | |
| `next.config.ts` | Done | transpilePackages, image remotes, redirects |

---

## 4. Layout Components

| Component | Status | Notes |
|---|---|---|
| `Sidebar` | Done | Full nav links with active state |
| `SidebarNavLink` | Done | Active state highlighting |
| `BottomNav` | Done | 5 icons + "More" sheet |
| `TopBar` | Done | Household name + switcher trigger |
| `HouseholdSwitcher` | Done | Popover with household list, cookie setting |
| `UserMenu` | Done | Dropdown with settings/logout |
| `PageHeader` | Done | Title + actions area |

---

## 5. Pages — Public / Auth

| Page | Route | Status | Notes |
|---|---|---|---|
| Login | `/login` | Done | Email/password + Google OAuth |
| Signup | `/signup` | Done | Name, email, password + Google OAuth |
| Invite Accept | `/invite/[code]` | Done | Preview + accept flow, handles auth redirect |
| Auth Callback | `/auth/callback` | Done | Supabase OAuth callback |
| Onboarding | `/app/onboarding` | Done | Join or create household |
| Create Household | `/app/onboarding/create` | Done | Household creation form |

---

## 6. Pages — Dashboard

| Page | Route | Status | Notes |
|---|---|---|---|
| Dashboard | `/app/dashboard` | Done | Summary widgets, calendar, routine progress |
| Dashboard loading | `/app/dashboard/loading` | Done | Skeleton |
| Dashboard error | `/app/dashboard/error` | Done | Error boundary |

---

## 7. Pages — Routine Tasks

| Page | Route | Status | Notes |
|---|---|---|---|
| Routines list | `/app/routines` | Done | Full list with recurrence badges, active-today filtering, streaks |
| Routines loading | `/app/routines/loading` | Done | Skeleton |
| Routines error | `/app/routines/error` | Done | Error boundary |
| Create task | `/app/routines/new` | Done | Full form with recurrence picker, icon picker, member assignment |
| Task detail | `/app/routines/[taskId]` | Done | Toggle completion, streak display, completion history |
| Task detail loading | `/app/routines/[taskId]/loading` | Done | Skeleton |
| Edit task | `/app/routines/[taskId]/edit` | Done | Edit form with all fields |

---

## 8. Pages — Items to Buy

| Page | Route | Status | Notes |
|---|---|---|---|
| Items list | `/app/items` | Stub | Page exists, server actions throw "Not implemented" |
| Items loading | `/app/items/loading` | Done | Skeleton |
| Items error | `/app/items/error` | Done | Error boundary |
| Create item | `/app/items/new` | Stub | Form exists, server action throws |
| Item detail/edit | `/app/items/[itemId]` | Stub | Page exists, non-functional |
| Item detail loading | `/app/items/[itemId]/loading` | Done | Skeleton |

---

## 9. Pages — Reminders

| Page | Route | Status | Notes |
|---|---|---|---|
| Reminders list | `/app/reminders` | Stub | Page exists, server actions throw |
| Reminders loading | `/app/reminders/loading` | Done | Skeleton |
| Reminders error | `/app/reminders/error` | Done | Error boundary |
| Create reminder | `/app/reminders/new` | Stub | Form exists, server action throws |
| Reminder detail/edit | `/app/reminders/[reminderId]` | Stub | Page exists, non-functional |

---

## 10. Pages — Urgent Problems

| Page | Route | Status | Notes |
|---|---|---|---|
| Urgent list | `/app/urgent` | Stub | Page exists, server actions throw |
| Urgent loading | `/app/urgent/loading` | Done | Skeleton |
| Urgent error | `/app/urgent/error` | Done | Error boundary |
| Report problem | `/app/urgent/new` | Stub | Form exists, server action throws |
| Problem detail | `/app/urgent/[problemId]` | Stub | Page exists, non-functional |

---

## 11. Pages — Members

| Page | Route | Status | Notes |
|---|---|---|---|
| Members list | `/app/members` | Done | Full list with role badges, change role, remove member, leave |
| Members loading | `/app/members/loading` | Done | Skeleton |
| Invite flow | `/app/members/invite` | Done | Generate link, copy, email, pending invites, revoke |

---

## 12. Pages — Settings

| Page | Route | Status | Notes |
|---|---|---|---|
| Settings | `/app/settings` | Done | Language selector, appearance link |
| Household settings | `/app/settings/household` | Done | Household name, delete household (sole member check) |

---

## 13. Server Actions

| File | Actions | Status |
|---|---|---|
| `actions/household.ts` | createHousehold, switchHousehold, updateHousehold, deleteHousehold | Done |
| `actions/household.ts` | transferOwnership | Stub (throws "Not implemented") |
| `actions/members.ts` | changeRole, removeMember, leaveHousehold | Done |
| `actions/invite.ts` | generateInvite, revokeInvite, acceptInvite | Done |
| `actions/routines.ts` | createTask, updateTask, deleteTask, toggleTask | Done |
| `actions/items.ts` | createItem, updateItem, deleteItem, markItemDone, changeItemStatus | Stub (all throw) |
| `actions/reminders.ts` | createReminder, updateReminder, deleteReminder, toggleReminderComplete | Stub (all throw) |
| `actions/urgent.ts` | createUrgentProblem, resolveUrgentProblem, deleteUrgentProblem | Stub (all throw) |
| `actions/profile.ts` | updateProfile, deleteAccount | Stub (all throw) |

---

## 14. API Routes (REST — for mobile app)

| Route | Methods | Status |
|---|---|---|
| `/api/auth/session` | GET | Done |
| `/api/user/profile` | GET | Done |
| `/api/user/households` | GET | Done |
| `/api/household/[householdId]` | GET, PATCH, DELETE | Done |
| `/api/household/[householdId]/members` | GET | Done |
| `/api/household/[householdId]/members/[memberId]` | PATCH, DELETE | Done |
| `/api/household/[householdId]/members/leave` | POST | Done |
| `/api/household/[householdId]/invites` | GET, POST | Done |
| `/api/household/[householdId]/invites/[inviteId]/revoke` | POST | Done |
| `/api/household/[householdId]/routines` | GET, POST | Done |
| `/api/household/[householdId]/routines/[taskId]` | GET, PATCH, DELETE | Done |
| `/api/household/[householdId]/routines/[taskId]/toggle` | POST | Done |
| `/api/invites/accept` | POST | Done |
| `/api/household/[householdId]/items` | GET, POST | Not started |
| `/api/household/[householdId]/items/[itemId]` | GET, PATCH, DELETE | Not started |
| `/api/household/[householdId]/reminders` | GET, POST | Not started |
| `/api/household/[householdId]/reminders/[reminderId]` | GET, PATCH, DELETE | Not started |
| `/api/household/[householdId]/urgent` | GET, POST | Not started |
| `/api/household/[householdId]/urgent/[problemId]` | GET, PATCH, DELETE | Not started |

---

## 15. Business Logic Utilities

| Utility | File | Status |
|---|---|---|
| `getCycleStart()` | `lib/cycle.ts` | Done |
| `isCompletedThisCycle()` | `lib/cycle.ts` | Done |
| `isActiveOnDate()` / `isActiveToday()` | `lib/cycle.ts` | Done |
| `hasCompletionOnDate()` | `lib/cycle.ts` | Done |
| `getRecurrenceDescription()` | `lib/cycle.ts` | Done |
| `calculateStreak()` | `lib/streak.ts` | Done |
| `getPreviousCycleStart()` / `getNextCycleStart()` | `lib/streak.ts` | Done |
| API middleware (`withAuth`, `withHouseholdAuth`) | `lib/api-middleware.ts` | Done |
| API helpers (`parseJsonBody`, `apiTranslator`) | `lib/api-helpers.ts` | Done |
| Route constants | `lib/constants.ts` | Done |

---

## 16. i18n

| Item | Status | Notes |
|---|---|---|
| `pt-BR.json` | Done | Complete translations for all implemented features |
| `en-US.json` | Done | Complete translations for all implemented features |
| Namespace structure | Done | common, metadata, nav, auth, onboarding, invite, dashboard, items, routines, reminders, urgent, members, settings, validation, error, enums |

---

## 17. Data Model Notes

The actual database schema diverged from the original `myhouz-database.md` design in the routines module:

| Original Design | Actual Implementation |
|---|---|
| `routine_checklist` (container) + `routine_checklist_item` (tasks inside) | `routine_task` (standalone task) + `routine_task_completion` (completion history) |
| `recurrence_type` enum: daily, weekly, monthly, custom | Expanded: daily, weekly, monthly, custom, weekdays, weekends |
| No recurrence metadata | `recurrence_meta` JSONB: `{ type: "days_of_week", days: [] }` or `{ type: "interval", every: N, unit: "days"/"weeks"/"months" }` |
| No icon support | `icon` column on `routine_task` for lucide icon names |
| No separate completion tracking | `routine_task_completion` table with full history + streak support |

All other tables (profile, household, household_member, household_invite, household_item, reminder, urgent_problem, notification) match the original schema design.

---

## Next Steps (Priority Order)

1. **Items to Buy** — Implement server actions + API routes (schemas and types already exist)
2. **Reminders** — Implement server actions + API routes
3. **Urgent Problems** — Implement server actions + API routes
4. **Profile updates** — Implement updateProfile, deleteAccount actions
5. **Transfer ownership** — Implement the one remaining household action
6. **Mobile app** — React Native (Expo) with full feature parity via REST API
7. **Push notifications** — Expo Push for urgent problems
8. **Tier limits + payments** — Stripe integration for Plus/Pro subscriptions
