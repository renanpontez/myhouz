# myhouz

A shared household management app that centralizes tasks, household needs, reminders, and critical info for everyone living under the same roof.

## Team

| Person | Ownership |
|---|---|
| **Renan Martins** | Tech & Brand |
| **Andressa Hora** | Marketing & Business |

## Project Context Documents

All architecture and design docs live in the ideas folder:

- **Product Context:** `/Users/renan/Desktop/_ideas/myhouz/myhouz-product.md`
- **Frontend Architecture:** `/Users/renan/Desktop/_ideas/myhouz/myhouz-frontend.md`
- **Database Schema:** `/Users/renan/Desktop/_ideas/myhouz/myhouz-database.md`
- **Implementation Guide:** `/Users/renan/Desktop/_ideas/myhouz/myhouz-implementation.md`
- **Business & Marketing:** `/Users/renan/Desktop/_ideas/myhouz/myhouz-business.md`
- **Visual Design:** `/Users/renan/Desktop/_ideas/myhouz/myhouz-visual-design.md`

Always read the relevant context doc before making architectural decisions or implementing features.

## i18n (Priority — MVP)

- **Languages:** pt-BR and en-US from day one
- **Default locale:** pt-BR (Brazil-first launch strategy)
- All UI strings must be externalized — no hardcoded text in components
- Use Next.js built-in i18n routing or next-intl for locale-based routing

## Tech Stack

- **Framework:** Next.js 15 (App Router) -- serves both frontend and API
- **Language:** TypeScript (strict mode, `noUncheckedIndexedAccess`, `noUnusedLocals`)
- **Database + Auth:** Supabase (PostgreSQL 15+ with Supabase Auth)
- **Data Access:** Supabase JS client (query builder) only -- no Prisma, Drizzle, or raw SQL in app code
- **Styling:** Tailwind CSS 3 + shadcn/ui (Radix UI primitives)
- **Package Manager:** npm 9+
- **Monorepo:** Turborepo
- **Key Libraries:** date-fns (dates), sonner (toasts), lucide-react 0.575+ (icons, includes `lucide-react/dynamic` for DynamicIcon), zod (validation), next-themes (dark mode)
- **React:** v19 (supports `useOptimistic`, `useTransition`, `use`)

## Commands

```bash
# Development
npm dev                  # Start all apps (Turborepo)
npm build                # Build all apps
npm lint                 # Lint all packages
npm typecheck            # Type-check all packages
npm format               # Prettier format all files

# Testing
npm test                 # Vitest unit/integration tests
npm test:e2e             # Playwright E2E tests

# Database (remote only -- no local Supabase / Docker)
npm db:types             # Regenerate TypeScript types from remote DB -> packages/types/src/database.ts

# Supabase CLI (from apps/myhouz/)
supabase migration new <name>           # Create a new migration file
supabase db push                        # Push migrations to remote (use this, NOT db reset)

# App-specific (from apps/myhouz/)
npm dev                  # next dev --turbopack
npm test:watch           # vitest in watch mode
```

## Environment Variables

```bash
# Required -- Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321          # Public
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...                     # Public
SUPABASE_SERVICE_ROLE_KEY=eyJ...                         # Server-only, never expose

# Required -- App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="myhouz"

# Required -- Email
RESEND_API_KEY=re_...

# Optional -- Feature flags
# NEXT_PUBLIC_ENABLE_BILLS=false
# NEXT_PUBLIC_ENABLE_SECRETS=false
```

## Architecture Rules

### Backend
- All backend logic lives inside Next.js -- Server Actions for form mutations, API routes for client-side mutations. No separate backend service.
- Every API route sits under `/api/household/[householdId]/` to enforce household scoping.
- All API routes use the `withHouseholdAuth` middleware wrapper for session + membership verification.
- Input validation uses Zod schemas from `@home/types`.

### Frontend
- Prefer Server Components for data fetching and static content. Only use Client Components when interactivity is needed (forms, toggles, filters, popovers).
- URL search params for filter/tab state (shareable, bookmarkable).
- Optimistic updates via `useOptimistic` + `useTransition` for actions that should feel instant (toggles, mark done).
- All data fetching in Server Components uses direct Supabase queries. Mutations go through Server Actions.

### Database
- All data is scoped by `household_id` -- never query without it.
- RLS policies enforce access at the database level as a second layer of protection.
- Entity names follow the database schema doc exactly (snake_case in DB, PascalCase in TypeScript).

### Shared Packages
- `@home/auth` -- session management, middleware, providers
- `@home/db` -- Supabase client factories
- `@home/types` -- TypeScript types + Zod schemas for all entities
- `@home/ui` -- shadcn/ui components + shared custom components
- `@home/config` -- ESLint, TypeScript, Tailwind base configs

## Entity Quick Reference

### DB Tables and TypeScript Types

| DB Table (snake_case) | TS Type (PascalCase) | Module | MVP |
|---|---|---|---|
| `profile` | `Profile` | Auth/User | Yes |
| `household` | `Household` | Core | Yes |
| `household_member` | `HouseholdMember` | Core | Yes |
| `household_invite` | `HouseholdInvite` | Invites | Yes |
| `household_item` | `HouseholdItem` | Items to Buy | Yes |
| `routine_task` | `RoutineTask` | Routines | Yes |
| `routine_task_completion` | `RoutineTaskCompletion` | Routines | Yes |
| `reminder` | `Reminder` | Reminders | Yes |
| `urgent_problem` | `UrgentProblem` | Urgent | Yes |
| `notification` | `Notification` | Notifications | Yes |
| `bill` | `Bill` | Bills | No |
| `household_secret` | `HouseholdSecret` | Secrets | No |

### Enum Types

| DB Enum | Values | Used By |
|---|---|---|
| `member_role` | `owner`, `member`, `guest` | `household_member.role` |
| `item_type` | `buy`, `repair`, `fix` | `household_item.type` |
| `item_priority` | `low`, `medium`, `high` | `household_item.priority` |
| `item_status` | `pending`, `in_progress`, `done` | `household_item.status` |
| `recurrence_type` | `daily`, `weekly`, `monthly`, `custom` | `routine_task.recurrence` |
| `invite_status` | `pending`, `accepted`, `revoked`, `expired` | `household_invite.status` |

### User Roles

| Role | Can Create/Edit | Can Manage Members | Can Delete Household |
|---|---|---|---|
| `owner` | All modules | Yes | Yes |
| `member` | All modules | No (view only) | No |
| `guest` | Per-section permission | No | No |

Guest is post-MVP. For MVP, only `owner` and `member` matter.

## Route Structure Quick Reference

### Layout Nesting

```
RootLayout (app/layout.tsx)
  LandingPage (app/page.tsx)                                       -- public, /
  AuthLayout (app/app/(auth-required)/layout.tsx)                  -- session check, UserProvider
    HouseholdLayout (app/app/(auth-required)/(household)/layout.tsx) -- sidebar, HouseholdProvider
      Page
```

### MVP Routes

| Route | Page | Component Type |
|---|---|---|
| `/` | Landing page | Public, Server |
| `/login` | Login | Public, Server |
| `/signup` | Signup | Public, Server |
| `/invite/[code]` | Accept invite | Public, Server |
| `/app/onboarding` | Join/create household | Auth required, Server |
| `/app/onboarding/create` | Create household form | Auth required, Client |
| `/app/dashboard` | Home dashboard | Household, Server |
| `/app/items` | Items to Buy list | Household, Server |
| `/app/items/new` | Create item | Household, Client |
| `/app/items/[itemId]` | Item detail/edit | Household, Server shell + Client form |
| `/app/routines` | Today's tasks list | Household, Server |
| `/app/routines/new` | Create task | Household, Client |
| `/app/routines/[taskId]` | Task detail + history | Household, Server + Client |
| `/app/routines/[taskId]/edit` | Edit task | Household, Client |
| `/app/reminders` | Reminders list | Household, Server |
| `/app/reminders/new` | Create reminder | Household, Client |
| `/app/reminders/[reminderId]` | Reminder detail/edit | Household, Server + Client |
| `/app/urgent` | Urgent Problems list | Household, Server |
| `/app/urgent/new` | Report problem | Household, Client |
| `/app/urgent/[problemId]` | Problem detail + resolve | Household, Server + Client |
| `/app/members` | Household Members list | Household, Server |
| `/app/members/invite` | Invite member (Owner) | Household, Client |
| `/app/settings` | User settings | Auth required, Server + Client |
| `/app/settings/household` | Household settings (Owner) | Household, Server + Client |

### API Routes

All under `/api/household/[householdId]/`:

```
/items                    GET, POST
/items/[itemId]           GET, PATCH, DELETE
/routines                 GET, POST
/routines/[taskId]        GET, PATCH, DELETE
/reminders                GET, POST
/reminders/[reminderId]   GET, PATCH, DELETE
/urgent                   GET, POST
/urgent/[problemId]       GET, PATCH, DELETE
/members                  GET, POST (invite)
/members/[memberId]       PATCH, DELETE
/invite                   POST (generate link)
```

## Auth Patterns

### Getting the Current User

```typescript
// In Server Components / Server Actions:
import { getUser, getUserWithRole } from "@home/auth";

// Just the profile (redirects to /login if no session):
const user = await getUser();

// Profile + role in a specific household (redirects if not a member):
const { profile, membership, role } = await getUserWithRole(householdId);
```

### In Client Components

```typescript
"use client";
import { useUser, useHousehold } from "@home/auth";

function MyComponent() {
  const user = useUser();                          // Profile from UserProvider
  const { household, role, isOwner, members } = useHousehold();  // From HouseholdProvider
}
```

### Role Checks

```typescript
// Server Action -- check if owner:
const { role } = await getUserWithRole(householdId);
if (role !== "owner") {
  return { error: "Only the owner can do this" };
}

// Client Component -- conditional UI:
const { isOwner } = useHousehold();
{isOwner && <InviteButton />}
```

## Supabase Client Patterns

### Which Client to Use

| Client | Import | Used In |
|---|---|---|
| `createServerClient()` | `@home/db` | Server Components, Server Actions |
| `createRouteHandlerClient()` | `@home/db` | API route handlers |
| `createBrowserClient()` | `@home/db` | Client Components (rare -- only for auth operations) |
| `createAdminClient()` | `@home/db` | Service-role operations (invite acceptance) |

### Common Query Patterns

```typescript
// READ -- list with household scoping (Server Component)
const supabase = createServerClient();
const { data: items } = await supabase
  .from("household_item")
  .select("id, name, type, priority, status, assigned_to, created_at")
  .eq("household_id", householdId)
  .order("priority", { ascending: false });

// READ -- single entity
const { data: item } = await supabase
  .from("household_item")
  .select("id, name, type, priority, status, assigned_to, notes, created_at")
  .eq("id", itemId)
  .eq("household_id", householdId)
  .single();

// READ -- with related data (join)
const { data: memberships } = await supabase
  .from("household_member")
  .select("*, household:household(*)")
  .eq("user_id", userId);

const { data: members } = await supabase
  .from("household_member")
  .select("*, profile:profile(*)")
  .eq("household_id", householdId);

// INSERT
const { data, error } = await supabase
  .from("household_item")
  .insert({ ...parsed.data, household_id: householdId, added_by: user.id })
  .select()
  .single();

// UPDATE -- always scope by household_id too
const { error } = await supabase
  .from("household_item")
  .update({ status: "done" })
  .eq("id", itemId)
  .eq("household_id", householdId);

// DELETE
const { error } = await supabase
  .from("household_item")
  .delete()
  .eq("id", itemId)
  .eq("household_id", householdId);

// COUNT / PAGINATION
const { data, count } = await supabase
  .from("household_item")
  .select("*", { count: "exact" })
  .eq("household_id", householdId)
  .range(0, 24);
```

**Important:** Always select specific columns in production code. Never `select("*")` except for quick prototyping.

## Server Action Pattern

Every Server Action follows this shape:

```typescript
// actions/items.ts
"use server";

import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createItemSchema } from "@home/types/schemas";

export async function createItem(householdId: string, formData: FormData) {
  // 1. Auth -- get user + verify household membership
  const { profile } = await getUserWithRole(householdId);

  // 2. Validate -- parse input with Zod
  const parsed = createItemSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    priority: formData.get("priority"),
    assigned_to: formData.get("assigned_to") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // 3. Execute -- Supabase query
  const supabase = createServerClient();
  const { error } = await supabase.from("household_item").insert({
    ...parsed.data,
    household_id: householdId,
    added_by: profile.id,
  });
  if (error) {
    return { error: { _form: ["Failed to create item"] } };
  }

  // 4. Revalidate -- bust relevant caches
  revalidateTag("items");
  revalidatePath("/app/dashboard");

  // 5. Redirect (or return result)
  redirect("/app/items");
}
```

### Server Action Files

| File | Actions |
|---|---|
| `actions/household.ts` | `createHousehold`, `updateHousehold`, `deleteHousehold`, `transferOwnership` |
| `actions/members.ts` | `changeRole`, `removeMember`, `leaveHousehold` |
| `actions/items.ts` | `createItem`, `updateItem`, `deleteItem`, `markItemDone`, `changeItemStatus` |
| `actions/routines.ts` | `createTask`, `updateTask`, `deleteTask`, `toggleTask` |
| `actions/reminders.ts` | `createReminder`, `updateReminder`, `deleteReminder`, `toggleReminderComplete` |
| `actions/urgent.ts` | `createUrgentProblem`, `resolveUrgentProblem`, `deleteUrgentProblem` |
| `actions/invite.ts` | `generateInvite`, `revokeInvite`, `acceptInvite` |
| `actions/profile.ts` | `updateProfile`, `deleteAccount` |

## Component Patterns

### When to Use Server vs Client Components

| Pattern | Type | Reason |
|---|---|---|
| List pages (items, routines, etc.) | **Server** | Data fetched server-side, no JS bundle |
| Detail pages (read-only sections) | **Server** | Rendered on server, interactive parts are Client islands |
| Filter bars, tabs | **Client** | Click handlers, URL search param updates |
| Forms (create/edit) | **Client** | useState for form state, validation, submission |
| Overflow menus (quick actions) | **Client** | Popover state, click handlers |
| Optimistic toggles (checkboxes) | **Client** | useOptimistic + useTransition |
| Dashboard summary cards | **Server** | Each fetches its own data server-side |
| Badges, indicators | **Server** | Pure display, no interactivity |

### Standard Form Page

```
FormPage (Client Component -- "use client")
  PageHeader                    title="Add Item" | "Edit Item"
  BackLink                      href="/items"
  Form (Client)
    FormField                   label + input + error
    FormField                   ...
    MemberSelect                household member dropdown
    SubmitButton                with loading spinner
```

### Standard List Page

```
ListPage (Server Component)
  PageHeader                    title + "Add" button link
  FilterBar (Client)            tabs/dropdowns, reads/writes URL search params
  List (Server)
    Card[] (Server)             per-entity card
      Badge, Indicator (Server)
      QuickActions (Client)     overflow menu with edit/delete/toggle
  EmptyState (Server)           shown when no data
```

### Optimistic Update Pattern

```typescript
"use client";
import { useOptimistic, useTransition } from "react";
import { toggleTask } from "@/actions/routines";

function TaskRow({ task, isCompleted }: { task: RoutineTask; isCompleted: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(isCompleted);

  function handleToggle() {
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      await toggleTask(task.id);
    });
  }

  return (
    <div className={isPending ? "opacity-70" : ""}>
      <Checkbox checked={optimisticCompleted} onCheckedChange={handleToggle} />
      <span>{task.title}</span>
    </div>
  );
}
```

## API Route Middleware Pattern

```typescript
// lib/api-middleware.ts
export function withHouseholdAuth(handler: RouteHandler) {
  return async (request: NextRequest, { params }: { params: Record<string, string> }) => {
    const supabase = createRouteHandlerClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { householdId } = params;
    const { data: membership } = await supabase
      .from("household_member")
      .select("*, household:household(*)")
      .eq("household_id", householdId)
      .eq("user_id", session.user.id)
      .single();

    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return handler(request, { user: session.user, household: membership.household, membership, supabase }, params);
  };
}

// Usage in route:
export const GET = withHouseholdAuth(async (request, { supabase, household }) => {
  const { data } = await supabase
    .from("household_item")
    .select("id, name, type, priority, status")
    .eq("household_id", household.id);
  return NextResponse.json({ data });
});
```

### API Response Format

```typescript
// Success: { "data": { ... } }
// Error:   { "error": "message", "details": { ... } }

// Status codes: 200 (OK), 201 (Created), 204 (Deleted),
//               400 (Validation), 401 (Unauth), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
```

## DB Gotchas and Key Behaviors

### Automatic Triggers
- **Profile auto-created** on signup via `handle_new_user` trigger on `auth.users`
- **Owner auto-added** as household member via `handle_new_household` trigger on `household` insert
- **`resolved_at` auto-set** when `household_item.status` changes to `done` (and cleared if reverted)
- **`updated_at` auto-set** on every UPDATE for all tables via `set_updated_at` trigger

### Task Cycle Logic
Completion is per-cycle, not permanent. A task is "done for this cycle" when `last_completed_at >= cycle_start`. Use the `get_cycle_start(recurrence)` DB function or calculate in app code:
- `daily` -> start of today
- `weekly` -> start of this week
- `monthly` -> start of this month

Completions are also logged in `routine_task_completion` for streak tracking and history.

### Invite Acceptance
Uses the `accept_invite(code)` DB function (SECURITY DEFINER). This atomically validates the invite, creates the membership, and marks the invite as accepted. Invites expire after 7 days.

### Consistency Constraints
- `household_item`: `status = 'done'` requires `resolved_at IS NOT NULL` (and vice versa)
- `reminder`: `is_completed = true` requires `completed_at IS NOT NULL`
- `urgent_problem`: `is_active = false` requires `resolved_at IS NOT NULL` and `resolved_by IS NOT NULL`
- `household_invite`: `status = 'accepted'` requires `accepted_by IS NOT NULL` and `accepted_at IS NOT NULL`

### RLS Helper Functions
These run with `SECURITY DEFINER` and are `STABLE` (cached per transaction):
- `is_household_member(household_id)` -- boolean membership check
- `get_household_role(household_id)` -- returns `member_role` enum
- `is_household_owner(household_id)` -- boolean owner check
- `guest_has_permission(household_id, section, level)` -- guest permission check

## Monorepo Structure

```
home-platform/
  apps/
    myhouz/                   # Next.js app
      app/                    # App Router pages
        page.tsx              # Landing page (/)
        (public)/             # /login, /signup, /invite/[code]
        app/                  # /app/... (authenticated)
          (auth-required)/    # AuthLayout + HouseholdLayout
            (household)/      # dashboard, items, routines, etc.
          onboarding/         # /app/onboarding
        api/                  # API routes (unchanged)
      actions/                # Server Actions (grouped by module)
      components/             # App-specific components (by feature)
      lib/                    # Utilities (utils.ts, constants.ts, api-middleware.ts)
      supabase/migrations/    # App-specific DB migrations
      tests/                  # Vitest + Playwright tests
  packages/
    auth/src/                 # getSession, getUser, getUserWithRole, UserProvider, HouseholdProvider, useUser, useHousehold
    db/src/                   # createServerClient, createRouteHandlerClient, createBrowserClient, createAdminClient, env
    types/src/                # All TS types, Zod schemas (schemas/), database.ts (auto-generated)
    ui/src/                   # shadcn/ui components, shared hooks, cn() utility
    config/                   # ESLint, TS base config, Tailwind preset
```

### Path Aliases

In `apps/myhouz/`, use `@/*` to reference files from the app root (maps to `./src/*`). Shared packages use their package names: `@home/auth`, `@home/db`, `@home/types`, `@home/ui`.

## MVP Scope (Build First)

- Household creation + invite-based member onboarding
- Household Members management (add, assign role, remove)
- Items to Buy (buy, repair, fix -- with priority and status)
- Routine Tasks (create, set recurrence, mark complete, streak tracking)
- Reminders (basic, assignable)
- Urgent Problems (in-app flag + dashboard banner)
- Web app only

**Not in MVP:** Bills, Passwords & Useful Info, Guest role, native mobile app.

## Code Conventions

- Use `npm` for all package operations
- File naming: `kebab-case` for files, `PascalCase` for components
- Server Actions in `actions/` directory with `"use server"` directive
- One export per Server Action file, grouped by module
- Supabase queries: always select specific columns, never `SELECT *` in production code
- Error handling: toast (sonner) for user-facing errors, `console.error` for unexpected errors
- Tests: Vitest for unit/integration, Playwright for E2E
- Type imports: always use `import type { ... }` for type-only imports (ESLint enforced)
- No `any` types -- use `unknown` with type guards if truly unknown
- Dark mode: use Tailwind `dark:` variant, `class` strategy via next-themes
- Font: Inter via `next/font/google`
- `/` serves the landing page; authenticated app lives under `/app/...`
- Backwards-compat redirects (`/dashboard` -> `/app/dashboard`, etc.) are configured in `next.config.ts`

## Common Pitfalls

1. **Forgetting `household_id` in queries.** Every query on a feature table must include `.eq("household_id", householdId)`. RLS is a safety net, not a substitute for scoping in app code.

2. **Using `getSession()` instead of `getUser()` for auth checks.** `getSession()` reads from the cookie and can be stale. `getUser()` verifies with Supabase Auth and is authoritative. Use `getUser()` for Server Components and Server Actions. The middleware uses `getUser()` for session refresh.

3. **Forgetting to revalidate after mutations.** Every Server Action that writes data must call `revalidateTag()` or `revalidatePath()`. Also revalidate `/app/dashboard` since it shows summary data from all modules.

4. **`resolved_at` on items is set by a DB trigger.** Do not manually set `resolved_at` when changing status to `done` -- the `handle_item_status_change` trigger handles it. Just set `status`.

5. **Routine tasks "reset" each cycle.** `last_completed_at` persists the timestamp of the last completion. The app must compare it against the cycle boundary to determine current-cycle status. There is no boolean `is_completed` column. Completions are also logged in `routine_task_completion` for streak tracking.

6. **Household switcher uses a cookie.** The `activeHouseholdId` cookie determines which household is loaded. Switching sets this cookie and calls `router.refresh()`. The HouseholdLayout reads it.

7. **Invite acceptance uses a DB function, not direct insert.** Call `accept_invite(code)` via RPC, not a manual insert into `household_member`. The function handles validation, membership creation, and invite status update atomically.

8. **PgBouncer transaction mode.** No prepared statements or session-level variables work across the pooled connection. `auth.uid()` works because it reads from JWT, not session state.

9. **`ON DELETE RESTRICT` on `household.owner_id`.** You cannot delete a user who owns a household. Ownership must be transferred first.

10. **Tailwind content paths must include shared packages.** The `tailwind.config.ts` must include `"../../packages/ui/src/**/*.{ts,tsx}"` in its content array, or shared component styles will be purged.

11. **No local Supabase / Docker.** The project only uses remote Supabase. Never run `supabase start`, `supabase db reset`, or use `--local` flags. Use `supabase db push` to apply migrations and `npm run db:types` (which uses `--linked`) to regenerate types.

12. **`supabase gen types` prints noise to stdout.** The CLI outputs "Initialising login role..." before the actual TypeScript. The `db:types` script filters this with `grep -v 'Initialising'`. If you pipe output manually, remember to filter or the generated file won't compile.

13. **`lucide-react/dynamic` requires >= 0.471.0.** The `DynamicIcon` component and `IconName` type are imported from `lucide-react/dynamic`. This subpath does not exist in older versions. The project is on 0.575.0+.

14. **Adding a new DB column requires 3 steps.** (1) Create migration with `supabase migration new`, (2) push with `supabase db push`, (3) regenerate types with `npm run db:types`. The build will fail until types are regenerated because Supabase's generated types enforce column existence at compile time.
