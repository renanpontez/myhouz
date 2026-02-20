# MyHouz — Mobile App Context Document

**Created:** 2026-02-20
**App name:** MyHouz (mobile)
**Platform:** React Native (Expo)
**Owner:** Renan Martins (Tech & Brand)
**Parent documents:**
- [Product Context](./myhouz-product.md)
- [Frontend Architecture](./myhouz-frontend.md)
- [Database Schema](./myhouz-database.md)
- [Progress Tracker](./myhouz-progress.md)

---

## Table of Contents

1. [Overview & Stack](#1-overview--stack)
2. [Complete API Reference](#2-complete-api-reference)
3. [Authentication Flow for Mobile](#3-authentication-flow-for-mobile)
4. [Screen Map & Navigation Structure](#4-screen-map--navigation-structure)
5. [Data Models & TypeScript Types](#5-data-models--typescript-types)
6. [Business Logic to Replicate Client-Side](#6-business-logic-to-replicate-client-side)
7. [UX Patterns & Interactions](#7-ux-patterns--interactions)
8. [i18n Key Structure](#8-i18n-key-structure)
9. [Household Switching](#9-household-switching)
10. [Features NOT Yet Available (Stubs)](#10-features-not-yet-available-stubs)

---

## 1. Overview & Stack

### Recommended Stack

| Concern | Library | Notes |
|---|---|---|
| Platform | React Native + **Expo** (managed workflow) | SDK 52+, use `npx create-expo-app` |
| Navigation | **React Navigation** | Native stack + bottom tabs (`@react-navigation/native-stack`, `@react-navigation/bottom-tabs`) |
| Server state | **TanStack Query** (React Query v5) | Cache, refetch, optimistic updates. Drop-in for all API calls |
| Local state | **Zustand** | Lightweight — for activeHouseholdId, theme, onboarding state |
| Auth | `@supabase/supabase-js` + `@react-native-async-storage/async-storage` | Session persistence, auto-refresh |
| Styling | **NativeWind** (Tailwind for RN) | Parity with web Tailwind classes. Or `StyleSheet` if preferred |
| i18n | `i18next` + `react-i18next` | Same translation keys as web, separate JSON message files |
| Icons | `lucide-react-native` | Same icon names as web (`lucide-react`) |
| Forms | `react-hook-form` + `zod` | Same Zod schemas from `@home/types` |
| Date handling | `date-fns` | Same library as web |
| HTTP client | Built-in `fetch` or Supabase client | All API calls go through the Next.js REST API |
| Toast | `react-native-toast-message` | For success/error feedback |
| Haptics | `expo-haptics` | Feedback on task completion |
| Secure storage | `expo-secure-store` | For auth tokens if not using AsyncStorage |
| Deep linking | `expo-linking` | For invite URLs (`myhouz://invite/:code`) |

### Monorepo Placement

```
home-platform/
  apps/
    myhouz/                # Next.js web app (existing)
    myhouz-mobile/         # React Native Expo app (new)
  packages/
    types/                 # @home/types — shared types + Zod schemas (reused by mobile)
```

The mobile app can import `@home/types` directly from the monorepo for type definitions and Zod schemas. Database clients (`@home/db`) and auth helpers (`@home/auth`) are **not** shared — the mobile app uses the REST API instead of direct Supabase queries.

---

## 2. Complete API Reference

**Base URL:** `https://myhouz.app` (production) or `http://localhost:3000` (dev)

All endpoints return JSON. Authentication is via Supabase session token in the `Authorization: Bearer <token>` header, or via cookies if using the Supabase JS client directly.

### Response Format

```typescript
// Success
{ "data": T }

// Error
{ "error": "Human-readable message", "details"?: { ... } }
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 204 | Deleted (DELETE) |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Not authorized (wrong role or not a household member) |
| 404 | Entity not found |
| 500 | Server error |

---

### 2.1 Auth & User

#### `GET /api/user/profile`

Get the current user's profile.

**Auth:** Required (session token)

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "name": "Renan Martins",
    "email": "renan@example.com",
    "avatar_url": "https://..." | null,
    "created_at": "2026-02-18T10:00:00Z",
    "updated_at": "2026-02-18T10:00:00Z"
  }
}
```

---

#### `GET /api/user/households`

List all households the current user belongs to, with their role in each.

**Auth:** Required

**Response (200):**
```json
{
  "data": [
    {
      "household": {
        "id": "uuid",
        "name": "My Home",
        "owner_id": "uuid",
        "created_at": "2026-02-18T10:00:00Z",
        "updated_at": "2026-02-18T10:00:00Z"
      },
      "role": "owner"
    }
  ]
}
```

---

### 2.2 Household

#### `GET /api/household/:householdId`

Get household details + current user's membership.

**Auth:** Required + must be a member

**Response (200):**
```json
{
  "data": {
    "household": {
      "id": "uuid",
      "name": "My Home",
      "owner_id": "uuid",
      "created_at": "2026-02-18T10:00:00Z",
      "updated_at": "2026-02-18T10:00:00Z"
    },
    "membership": {
      "id": "uuid",
      "household_id": "uuid",
      "user_id": "uuid",
      "role": "owner",
      "joined_at": "2026-02-18T10:00:00Z",
      "permissions": {},
      "created_at": "2026-02-18T10:00:00Z",
      "updated_at": "2026-02-18T10:00:00Z"
    }
  }
}
```

---

#### `PATCH /api/household/:householdId`

Update household name. **Owner only.**

**Auth:** Required + owner role

**Request body:**
```json
{ "name": "Updated Home Name" }
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "name": "Updated Home Name",
    "owner_id": "uuid",
    "created_at": "2026-02-18T10:00:00Z",
    "updated_at": "2026-02-20T10:00:00Z"
  }
}
```

**Errors:** 403 if not owner, 400 if validation fails

---

#### `DELETE /api/household/:householdId`

Delete household. **Owner only, must be sole member.**

**Auth:** Required + owner role

**Response (200):**
```json
{ "data": { "deleted": true } }
```

**Errors:** 403 if not owner, 400 if other members still exist

---

### 2.3 Members

#### `GET /api/household/:householdId/members`

List all members of a household with their profile info.

**Auth:** Required + must be a member

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "household_id": "uuid",
      "user_id": "uuid",
      "role": "owner",
      "joined_at": "2026-02-18T10:00:00Z",
      "profile": {
        "id": "uuid",
        "name": "Renan Martins",
        "email": "renan@example.com",
        "avatar_url": "https://..." | null
      }
    }
  ]
}
```

---

#### `PATCH /api/household/:householdId/members/:memberId`

Change a member's role. **Owner only, cannot change own role.**

**Auth:** Required + owner role

**Request body:**
```json
{ "role": "member" }
```
Valid roles: `"owner"`, `"member"`

**Response (200):**
```json
{ "data": { "id": "uuid", "role": "member" } }
```

**Errors:** 403 if not owner, 400 if trying to change own role

---

#### `DELETE /api/household/:householdId/members/:memberId`

Remove a member from the household. **Owner only, cannot remove self.**

**Auth:** Required + owner role

**Response (200):**
```json
{ "data": { "removed": true } }
```

**Errors:** 403 if not owner, 400 if trying to remove self (use leave endpoint instead)

---

#### `POST /api/household/:householdId/members/leave`

Current user leaves the household. **Cannot leave if owner.**

**Auth:** Required + must be a member

**Request body:** None

**Response (200):**
```json
{ "data": { "left": true } }
```

**Errors:** 400 if user is the owner (must transfer ownership first)

---

### 2.4 Invites

#### `GET /api/household/:householdId/invites`

List pending invites. **Owner only.**

**Auth:** Required + owner role

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "abc123def456",
      "email": "carol@example.com" | null,
      "role": "member",
      "status": "pending",
      "expires_at": "2026-02-25T10:00:00Z",
      "created_at": "2026-02-18T10:00:00Z"
    }
  ]
}
```

---

#### `POST /api/household/:householdId/invites`

Generate a new invite link. **Owner only.**

**Auth:** Required + owner role

**Request body:**
```json
{
  "email": "carol@example.com",   // optional — sends email notification via Resend
  "role": "member"                 // "member" or "guest"
}
```

**Response (201):**
```json
{
  "data": {
    "code": "abc123def456",
    "inviteUrl": "https://myhouz.app/invite/abc123def456"
  }
}
```

**Notes:** Invite expires in 7 days. If email is provided and RESEND_API_KEY is configured, an email notification is sent.

---

#### `POST /api/household/:householdId/invites/:inviteId/revoke`

Revoke a pending invite. **Owner only.**

**Auth:** Required + owner role

**Request body:** None

**Response (200):**
```json
{ "data": { "revoked": true } }
```

---

#### `POST /api/invites/accept`

Accept an invite by code. This is **not** scoped to a household in the URL — the code determines the household.

**Auth:** Required (any authenticated user)

**Request body:**
```json
{ "code": "abc123def456" }
```

**Response (200):**
```json
{ "data": { "householdId": "uuid" } }
```

**Errors:** 400 if invite is invalid, expired, already used, or user is already a member

**Notes:** Calls the `accept_invite(code)` RPC function in Supabase, which atomically validates the invite, creates the membership, and marks the invite as accepted.

---

### 2.5 Routine Tasks

#### `GET /api/household/:householdId/routines`

List all routine tasks for a household.

**Auth:** Required + must be a member

**Query params:**
- `include=completions` — include full completion history for each task

**Response (200) — without completions:**
```json
{
  "data": [
    {
      "id": "uuid",
      "household_id": "uuid",
      "title": "Water the plants",
      "recurrence": "daily",
      "recurrence_meta": null,
      "assigned_to": "uuid" | null,
      "icon": "droplets" | null,
      "is_active": true,
      "last_completed_at": "2026-02-20T08:30:00Z" | null,
      "completed_by": "uuid" | null,
      "created_by": "uuid",
      "sort_order": 0,
      "created_at": "2026-02-18T10:00:00Z",
      "updated_at": "2026-02-20T08:30:00Z"
    }
  ]
}
```

**Response (200) — with `?include=completions`:**
Each task object includes an additional `completions` array:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Water the plants",
      "recurrence": "daily",
      "recurrence_meta": null,
      "completions": [
        {
          "id": "uuid",
          "task_id": "uuid",
          "completed_at": "2026-02-20T08:30:00Z",
          "completed_by": "uuid",
          "created_at": "2026-02-20T08:30:00Z"
        }
      ]
    }
  ]
}
```

---

#### `POST /api/household/:householdId/routines`

Create a new routine task.

**Auth:** Required + must be a member

**Request body:**
```json
{
  "title": "Water the plants",
  "recurrence": "daily",
  "recurrence_meta": null,
  "assigned_to": "uuid" | null,
  "icon": "droplets" | null
}
```

**Recurrence values:** `"daily"`, `"weekly"`, `"monthly"`, `"weekdays"`, `"weekends"`, `"custom"`

**RecurrenceMeta (when recurrence is "custom"):**
```json
// Option A: specific days of the week
{ "type": "days_of_week", "days": [1, 3, 5] }  // Mon, Wed, Fri (0=Sun, 6=Sat)

// Option B: interval
{ "type": "interval", "every": 2, "unit": "weeks" }  // Every 2 weeks
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "household_id": "uuid",
    "title": "Water the plants",
    "recurrence": "daily",
    "recurrence_meta": null,
    "assigned_to": null,
    "icon": "droplets",
    "is_active": true,
    "last_completed_at": null,
    "completed_by": null,
    "created_by": "uuid",
    "sort_order": 0,
    "created_at": "2026-02-20T10:00:00Z",
    "updated_at": "2026-02-20T10:00:00Z"
  }
}
```

---

#### `GET /api/household/:householdId/routines/:taskId`

Get a single task with its last 50 completions.

**Auth:** Required + must be a member

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "household_id": "uuid",
    "title": "Water the plants",
    "recurrence": "daily",
    "recurrence_meta": null,
    "assigned_to": null,
    "icon": "droplets",
    "is_active": true,
    "last_completed_at": "2026-02-20T08:30:00Z",
    "completed_by": "uuid",
    "created_by": "uuid",
    "sort_order": 0,
    "created_at": "2026-02-18T10:00:00Z",
    "updated_at": "2026-02-20T08:30:00Z",
    "completions": [
      {
        "id": "uuid",
        "task_id": "uuid",
        "completed_at": "2026-02-20T08:30:00Z",
        "completed_by": "uuid",
        "created_at": "2026-02-20T08:30:00Z"
      }
    ]
  }
}
```

---

#### `PATCH /api/household/:householdId/routines/:taskId`

Update a task.

**Auth:** Required + must be a member

**Request body (all fields optional):**
```json
{
  "title": "Updated title",
  "recurrence": "weekly",
  "recurrence_meta": null,
  "assigned_to": "uuid" | null,
  "icon": "spray-can" | null,
  "is_active": true
}
```

**Response (200):** Updated task object

---

#### `DELETE /api/household/:householdId/routines/:taskId`

Delete a task and all its completions.

**Auth:** Required + must be a member

**Response (200):**
```json
{ "data": { "deleted": true } }
```

---

#### `POST /api/household/:householdId/routines/:taskId/toggle`

Toggle task completion for the current cycle. If already completed this cycle, un-completes it. If not completed, marks it complete.

**Auth:** Required + must be a member

**Request body:** None

**Response (200):**
```json
{ "data": { "completed": true } }   // or false if un-completed
```

**Behavior:**
1. Calculates current cycle start based on task recurrence
2. If `last_completed_at >= cycleStart`: un-complete (clear `last_completed_at`, delete completion record)
3. If not completed: complete (set `last_completed_at` to now, create completion record)

---

### 2.6 Auth Session

#### `GET /api/auth/session`

Get the current Supabase session (if any).

**Auth:** None (reads from cookie)

**Response (200):**
```json
{ "session": { ... } | null }
```

---

## 3. Authentication Flow for Mobile

### Supabase Auth (No Cookies)

The mobile app uses Supabase JS client with `AsyncStorage` for session persistence, not cookies:

```typescript
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,  // important for RN
    },
  }
);
```

### Email/Password Auth

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { name } },
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({ email, password });

// Sign out
await supabase.auth.signOut();

// Get current session
const { data: { session } } = await supabase.auth.getSession();
```

### OAuth (Google)

Use `expo-auth-session` or `expo-web-browser` for the OAuth redirect flow:

```typescript
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

const redirectUrl = makeRedirectUri({ scheme: "myhouz" });

const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: redirectUrl,
    skipBrowserRedirect: true,
  },
});

if (data?.url) {
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
  if (result.type === "success") {
    const url = new URL(result.url);
    // Extract tokens from URL fragment and set session
    const access_token = url.hash.match(/access_token=([^&]*)/)?.[1];
    const refresh_token = url.hash.match(/refresh_token=([^&]*)/)?.[1];
    if (access_token && refresh_token) {
      await supabase.auth.setSession({ access_token, refresh_token });
    }
  }
}
```

### Token Management

The Supabase JS client handles token refresh automatically when `autoRefreshToken: true`. For API calls to the Next.js backend, include the access token:

```typescript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### Deep Link Handling for Invites

Register `myhouz://` scheme in `app.json`:

```json
{
  "expo": {
    "scheme": "myhouz",
    "plugins": [
      ["expo-linking"]
    ]
  }
}
```

Handle incoming deep links:

```typescript
import * as Linking from "expo-linking";

// Listen for invite deep links: myhouz://invite/abc123def456
Linking.addEventListener("url", ({ url }) => {
  const parsed = Linking.parse(url);
  if (parsed.path === "invite" && parsed.queryParams?.code) {
    // Navigate to invite accept screen
    navigation.navigate("InviteAccept", { code: parsed.queryParams.code });
  }
});
```

### Auth State Listener

```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) {
      // Navigate to main app
    } else if (event === "SIGNED_OUT") {
      // Navigate to login
    }
  });

  return () => subscription.unsubscribe();
}, []);
```

---

## 4. Screen Map & Navigation Structure

### Navigation Architecture

```
RootNavigator (conditional on auth state)
│
├── AuthStack (unauthenticated)
│   ├── LoginScreen
│   ├── SignupScreen
│   └── InviteAcceptScreen          deep link: myhouz://invite/:code
│
├── OnboardingStack (authenticated, no household)
│   ├── OnboardingScreen            "Join or create household"
│   └── CreateHouseholdScreen       "Create your household"
│
└── MainTabNavigator (authenticated + household selected)
    │
    ├── DashboardTab
    │   └── DashboardScreen
    │
    ├── RoutinesTab
    │   └── RoutinesStack
    │       ├── RoutinesListScreen
    │       ├── TaskDetailScreen     route: /routines/:taskId
    │       ├── CreateTaskScreen     route: /routines/new
    │       └── EditTaskScreen       route: /routines/:taskId/edit
    │
    ├── ItemsTab
    │   └── ItemsStack
    │       ├── ItemsListScreen      (stub — API pending)
    │       ├── CreateItemScreen     (stub)
    │       └── ItemDetailScreen     (stub)
    │
    ├── MembersTab
    │   └── MembersStack
    │       ├── MembersListScreen
    │       └── InviteScreen         owner only
    │
    └── MoreTab
        └── MoreStack
            ├── MoreMenuScreen       links to settings, reminders, urgent
            ├── SettingsScreen
            ├── HouseholdSettingsScreen   owner only
            ├── RemindersListScreen       (stub — API pending)
            └── UrgentListScreen          (stub — API pending)
```

### Web-to-Mobile Route Mapping

| Web Route | Mobile Screen | Status |
|---|---|---|
| `/login` | `LoginScreen` | Ready |
| `/signup` | `SignupScreen` | Ready |
| `/invite/[code]` | `InviteAcceptScreen` | Ready |
| `/app/onboarding` | `OnboardingScreen` | Ready |
| `/app/onboarding/create` | `CreateHouseholdScreen` | Ready |
| `/app/dashboard` | `DashboardScreen` | Ready |
| `/app/routines` | `RoutinesListScreen` | Ready |
| `/app/routines/new` | `CreateTaskScreen` | Ready |
| `/app/routines/[taskId]` | `TaskDetailScreen` | Ready |
| `/app/routines/[taskId]/edit` | `EditTaskScreen` | Ready |
| `/app/items` | `ItemsListScreen` | Stub (API pending) |
| `/app/items/new` | `CreateItemScreen` | Stub (API pending) |
| `/app/items/[itemId]` | `ItemDetailScreen` | Stub (API pending) |
| `/app/reminders` | `RemindersListScreen` | Stub (API pending) |
| `/app/urgent` | `UrgentListScreen` | Stub (API pending) |
| `/app/members` | `MembersListScreen` | Ready |
| `/app/members/invite` | `InviteScreen` | Ready |
| `/app/settings` | `SettingsScreen` | Ready |
| `/app/settings/household` | `HouseholdSettingsScreen` | Ready |

---

## 5. Data Models & TypeScript Types

These types can be imported from `@home/types` in the monorepo, or copied into the mobile app if a separate package is preferred.

### Profile

```typescript
interface Profile {
  id: string;                        // UUID
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;                // ISO 8601 datetime
  updated_at: string;
}
```

### Household

```typescript
interface Household {
  id: string;
  name: string;
  owner_id: string;                  // UUID ref to Profile
  created_at: string;
  updated_at: string;
}
```

### HouseholdMember

```typescript
type MemberRole = "owner" | "member" | "guest";

interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;                   // UUID ref to Profile
  role: MemberRole;
  joined_at: string;
  permissions: Record<string, string>;   // JSONB — for guest role (post-MVP)
  created_at: string;
  updated_at: string;
}

// With profile join (from /members endpoint)
interface HouseholdMemberWithProfile extends HouseholdMember {
  profile: Pick<Profile, "id" | "name" | "email" | "avatar_url">;
}
```

### HouseholdInvite

```typescript
type InviteStatus = "pending" | "accepted" | "revoked" | "expired";

interface HouseholdInvite {
  id: string;
  household_id: string;
  code: string;
  email: string | null;
  role: MemberRole;
  status: InviteStatus;
  invited_by: string;                // UUID ref to Profile
  accepted_by: string | null;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}
```

### RoutineTask

```typescript
type RecurrenceType = "daily" | "weekly" | "monthly" | "weekdays" | "weekends" | "custom";

type RecurrenceMeta =
  | { type: "days_of_week"; days: number[] }      // 0=Sun, 1=Mon, ..., 6=Sat
  | { type: "interval"; every: number; unit: "days" | "weeks" | "months" }
  | null;

interface RoutineTask {
  id: string;
  household_id: string;
  title: string;
  recurrence: RecurrenceType;
  recurrence_meta: RecurrenceMeta;
  assigned_to: string | null;         // UUID ref to Profile
  icon: string | null;                // Lucide icon name (e.g., "droplets", "spray-can")
  is_active: boolean;
  last_completed_at: string | null;
  completed_by: string | null;        // UUID ref to Profile
  created_by: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

### RoutineTaskCompletion

```typescript
interface RoutineTaskCompletion {
  id: string;
  task_id: string;
  completed_at: string;               // ISO 8601 datetime
  completed_by: string;               // UUID ref to Profile
  created_at: string;
}
```

### HouseholdItem (Items to Buy — API pending)

```typescript
type ItemType = "buy" | "repair" | "fix";
type ItemPriority = "low" | "medium" | "high";
type ItemStatus = "pending" | "in_progress" | "done";

interface HouseholdItem {
  id: string;
  household_id: string;
  name: string;
  type: ItemType;
  priority: ItemPriority;
  status: ItemStatus;
  assigned_to: string | null;
  notes: string | null;
  added_by: string;
  resolved_at: string | null;         // Auto-set by DB trigger when status='done'
  created_at: string;
  updated_at: string;
}
```

### Reminder (API pending)

```typescript
interface Reminder {
  id: string;
  household_id: string;
  title: string;
  due_at: string;                     // ISO 8601 datetime
  assigned_to: string | null;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

### UrgentProblem (API pending)

```typescript
interface UrgentProblem {
  id: string;
  household_id: string;
  title: string;
  description: string;
  reported_by: string;
  is_active: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}
```

### API Response Wrappers

```typescript
interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
```

### Zod Schemas for Client-Side Validation

Import from `@home/types` or replicate. All schemas accept a translator function `t(key: string) => string` for i18n error messages:

```typescript
// Routine task
createTaskSchema(t)        // title (1-200), recurrence, recurrence_meta?, assigned_to?, icon?
createUpdateTaskSchema(t)  // all optional

// Household
createHouseholdSchema(t)   // name (1-200)

// Auth
createLoginSchema(t)       // email, password (min 1)
createSignupSchema(t)      // name (1-100), email, password (min 6)

// Invite
createGenerateInviteSchema(t)  // email? (valid format), role ("member" | "guest")
```

---

## 6. Business Logic to Replicate Client-Side

These functions exist in the web app at `lib/cycle.ts` and `lib/streak.ts`. They should be replicated in the mobile app for UI calculations (the API does not return computed fields like `isCompletedThisCycle` or `streak`).

### Cycle Calculation

```typescript
import { startOfDay, startOfWeek, startOfMonth, getDay } from "date-fns";

/**
 * Returns the start of the current cycle for a given recurrence type.
 */
function getCycleStart(recurrence: string, _meta?: RecurrenceMeta): Date {
  const now = new Date();
  switch (recurrence) {
    case "daily":
    case "weekdays":
    case "weekends":
    case "custom":
      return startOfDay(now);
    case "weekly":
      return startOfWeek(now, { weekStartsOn: 1 });  // Monday
    case "monthly":
      return startOfMonth(now);
    default:
      return startOfDay(now);
  }
}
```

### Is Completed This Cycle

```typescript
/**
 * Checks if a task is completed for the current cycle.
 * Compare last_completed_at against the cycle boundary.
 */
function isCompletedThisCycle(
  lastCompletedAt: string | null,
  recurrence: string,
  meta?: RecurrenceMeta,
): boolean {
  if (!lastCompletedAt) return false;
  const cycleStart = getCycleStart(recurrence, meta);
  return new Date(lastCompletedAt) >= cycleStart;
}
```

### Is Active Today / On Date

```typescript
/**
 * Checks if a task should appear as active on a given date.
 * Used to filter tasks on the list screen and calendar.
 */
function isActiveOnDate(
  recurrence: string,
  meta: RecurrenceMeta | undefined,
  date: Date,
): boolean {
  const dayOfWeek = getDay(date); // 0=Sun, 1=Mon, ..., 6=Sat

  switch (recurrence) {
    case "daily":
    case "monthly":
    case "weekly":
      return true;
    case "weekdays":
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case "weekends":
      return dayOfWeek === 0 || dayOfWeek === 6;
    case "custom": {
      if (!meta) return true;
      if (meta.type === "days_of_week") return meta.days.includes(dayOfWeek);
      return true;  // interval — always show
    }
    default:
      return true;
  }
}

function isActiveToday(recurrence: string, meta?: RecurrenceMeta): boolean {
  return isActiveOnDate(recurrence, meta, new Date());
}
```

### Streak Calculation

```typescript
import { isBefore, subDays, subWeeks, subMonths } from "date-fns";

interface CompletionRecord {
  completed_at: string;
}

/**
 * Calculates the current streak (consecutive cycles with at least one completion).
 * Walks backwards through cycles. Allows 1-cycle grace (current cycle may still be in progress).
 * Returns 0 if no completions or the most recent cycle was missed.
 */
function calculateStreak(
  recurrence: string,
  meta: RecurrenceMeta,
  completions: CompletionRecord[],
): number {
  if (completions.length === 0) return 0;

  const sorted = [...completions].sort(
    (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime(),
  );

  const currentCycleStart = getCycleStart(recurrence, meta);

  // Check if the current cycle has a completion
  const hasCurrentCycle = sorted.some(
    (c) => new Date(c.completed_at) >= currentCycleStart,
  );

  let streak = hasCurrentCycle ? 1 : 0;
  let cycleStart = hasCurrentCycle
    ? getPreviousCycleStart(recurrence, meta, currentCycleStart)
    : currentCycleStart;

  // Grace: if current cycle has no completion, check previous cycle
  if (!hasCurrentCycle) {
    const prevCycleStart = getPreviousCycleStart(recurrence, meta, currentCycleStart);
    const hasPrevCycle = sorted.some((c) => {
      const d = new Date(c.completed_at);
      return d >= prevCycleStart && d < currentCycleStart;
    });
    if (!hasPrevCycle) return 0;
    streak = 1;
    cycleStart = getPreviousCycleStart(recurrence, meta, prevCycleStart);
  }

  // Walk backwards counting consecutive cycles
  for (let i = 0; i < 1000; i++) {
    const cycleEnd = getNextCycleStart(recurrence, meta, cycleStart);
    const hasCompletion = sorted.some((c) => {
      const d = new Date(c.completed_at);
      return d >= cycleStart && d < cycleEnd;
    });
    if (!hasCompletion) break;
    streak++;
    cycleStart = getPreviousCycleStart(recurrence, meta, cycleStart);
    const oldest = sorted[sorted.length - 1];
    if (oldest && isBefore(cycleStart, startOfDay(new Date(oldest.completed_at)))) break;
  }

  return streak;
}

function getPreviousCycleStart(recurrence: string, _meta: RecurrenceMeta, fromDate: Date): Date {
  switch (recurrence) {
    case "daily": case "weekdays": case "weekends": case "custom":
      return subDays(fromDate, 1);
    case "weekly":
      return subWeeks(fromDate, 1);
    case "monthly":
      return subMonths(fromDate, 1);
    default:
      return subDays(fromDate, 1);
  }
}

function getNextCycleStart(recurrence: string, _meta: RecurrenceMeta, fromDate: Date): Date {
  switch (recurrence) {
    case "daily": case "weekdays": case "weekends": case "custom":
      return startOfDay(new Date(fromDate.getTime() + 86400000));
    case "weekly":
      return new Date(fromDate.getTime() + 7 * 86400000);
    case "monthly":
      return subMonths(fromDate, -1);
    default:
      return startOfDay(new Date(fromDate.getTime() + 86400000));
  }
}
```

### Recurrence Description (Human-Readable)

```typescript
/**
 * Returns a human-readable description for custom recurrence.
 * Returns null if not custom recurrence.
 */
function getRecurrenceDescription(
  recurrence: string,
  meta: RecurrenceMeta,
  dayLabels: string[],              // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  unitLabels: Record<string, string>, // { days: "days", weeks: "weeks", months: "months" }
): string | null {
  if (recurrence !== "custom" || !meta) return null;

  if (meta.type === "days_of_week") {
    // Sort starting from Monday
    const sorted = [...meta.days].sort((a, b) => {
      const orderA = a === 0 ? 7 : a;
      const orderB = b === 0 ? 7 : b;
      return orderA - orderB;
    });
    return sorted.map((d) => dayLabels[d]).join(", ");
  }

  if (meta.type === "interval") {
    const unitLabel = unitLabels[meta.unit] ?? meta.unit;
    return meta.every === 1 ? unitLabel : `${meta.every} ${unitLabel}`;
  }

  return null;
}
```

---

## 7. UX Patterns & Interactions

### Optimistic Updates

Task toggle should feel instant:

```typescript
// Using TanStack Query
const queryClient = useQueryClient();

const toggleMutation = useMutation({
  mutationFn: (taskId: string) =>
    fetch(`${API_URL}/api/household/${householdId}/routines/${taskId}/toggle`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
  onMutate: async (taskId) => {
    await queryClient.cancelQueries({ queryKey: ["routines", householdId] });
    const previous = queryClient.getQueryData(["routines", householdId]);

    // Optimistically update the cache
    queryClient.setQueryData(["routines", householdId], (old: RoutineTask[]) =>
      old.map((t) =>
        t.id === taskId
          ? {
              ...t,
              last_completed_at: isCompletedThisCycle(t.last_completed_at, t.recurrence, t.recurrence_meta)
                ? null
                : new Date().toISOString(),
            }
          : t,
      ),
    );

    return { previous };
  },
  onError: (_err, _taskId, context) => {
    // Revert on error
    queryClient.setQueryData(["routines", householdId], context?.previous);
    Toast.show({ type: "error", text1: t("error.toggleTaskError") });
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["routines", householdId] });
  },
});
```

### Pull-to-Refresh

Every list screen should support pull-to-refresh:

```typescript
const { data, refetch, isRefetching } = useQuery({
  queryKey: ["routines", householdId],
  queryFn: fetchRoutines,
});

<FlatList
  data={data}
  refreshing={isRefetching}
  onRefresh={refetch}
  renderItem={({ item }) => <TaskRow task={item} />}
/>
```

### Haptic Feedback

Trigger haptic feedback on task completion:

```typescript
import * as Haptics from "expo-haptics";

function handleToggle(taskId: string) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  toggleMutation.mutate(taskId);
}
```

### Skeleton Loaders

Show skeleton placeholders while data loads:

```typescript
if (isLoading) {
  return (
    <View>
      {[...Array(5)].map((_, i) => (
        <SkeletonTaskRow key={i} />
      ))}
    </View>
  );
}
```

### Toast Notifications

Use `react-native-toast-message` for success/error feedback:

```typescript
import Toast from "react-native-toast-message";

// Success
Toast.show({ type: "success", text1: t("common.save"), text2: t("routines.taskCreated") });

// Error
Toast.show({ type: "error", text1: t("error.somethingWentWrong") });
```

### Swipe Actions on List Items

Use `react-native-gesture-handler` or `react-native-swipeable-item` for swipe-to-delete or swipe-to-complete actions on list rows.

### Bottom Sheet for Quick Actions

Use `@gorhom/bottom-sheet` for contextual action menus (similar to overflow menus on web). Show options like Edit, Delete, Change Role on long press.

---

## 8. i18n Key Structure

The web app defines all translations in `messages/pt-BR.json` and `messages/en-US.json`. The mobile app should use the **same namespace keys** for consistency. You can either:

1. **Import the JSON files directly** from the web app via the monorepo
2. **Copy them** into the mobile app's assets

### Namespace Overview

| Namespace | Keys (examples) | Used By |
|---|---|---|
| `common` | back, or, loading, save, cancel, delete, edit, add, close, confirm, search, appName, switchHousehold, createNewHousehold | Global UI |
| `metadata` | title, description | App title/description |
| `nav` | dashboard, items, routines, reminders, urgent, members, settings, home | Navigation labels |
| `auth` | email, password, name, login, signup, logout, welcomeBack, createAccount, noAccount, hasAccount, authError, invalidCredentials | Auth screens |
| `onboarding` | subtitle, createHousehold, hasInvite, inviteCodeLabel, createTitle, householdNameLabel, createButton | Onboarding screens |
| `invite` | invalidTitle, expiredTitle, youWereInvited, invitedBy, memberCount, acceptInvite, joinHousehold | Invite screens |
| `dashboard` | title, subtitle, itemsLabel, routinesLabel, remindersLabel, urgentLabel, membersLabel, calendar.title, calendar.noTasks, calendar.today | Dashboard screen |
| `items` | title, subtitle, addButton, empty, newTitle, detailTitle | Items screens |
| `routines` | title, subtitle, addButton, empty, newTitle, editTitle, titleLabel, recurrenceLabel, assignedToLabel, unassigned, createButton, saveButton, deleteButton, deleteConfirm, completedAt, notActiveToday, todayProgress, allDoneToday, streak, completionHistory, noCompletions, customDaysOfWeek, customInterval, every, iconLabel | Routines screens |
| `reminders` | title, subtitle, addButton, empty, newTitle, detailTitle | Reminders screens |
| `urgent` | title, subtitle, addButton, empty, newTitle, detailTitle | Urgent screens |
| `members` | title, subtitle, inviteButton, empty, inviteTitle, emailLabel, roleLabel, generateLink, linkGenerated, copyLink, linkCopied, removeMember, changeRole, leave, leaveConfirm, removeConfirm, pendingInvites, revoke, revokeConfirm, owner, you | Members screens |
| `settings` | title, subtitle, profileSection, appearanceSection, languageSection, languagePortuguese, languageEnglish, householdTitle, householdInfoSection, householdNameLabel, householdNameSaved, deleteHousehold, deleteHouseholdConfirm, dangerZone | Settings screens |
| `validation` | emailInvalid, passwordRequired, passwordMin, nameRequired, nameMax, householdNameRequired, householdNameMax, titleRequired, titleMax, descriptionRequired, descriptionMax | Form validation |
| `error` | somethingWentWrong, failedToLoad, pageNotFound, createHouseholdError, acceptInviteError, invalidOrExpiredInvite, generateInviteError, removeMemberError, changeRoleError, leaveHouseholdError, ownerCannotLeave, createTaskError, updateTaskError, deleteTaskError, toggleTaskError | Error messages |
| `enums` | priority.low/medium/high, type.buy/repair/fix, status.pending/in_progress/done, role.owner/member/guest, recurrence.daily/weekly/monthly/custom | Enum display labels |

### i18n Setup for React Native

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ptBR from "./messages/pt-BR.json";
import enUS from "./messages/en-US.json";

i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": { translation: ptBR },
    "en-US": { translation: enUS },
  },
  lng: "pt-BR",              // Default language (Brazil-first)
  fallbackLng: "en-US",
  interpolation: { escapeValue: false },
});
```

Usage:

```typescript
import { useTranslation } from "react-i18next";

function TaskRow({ task }: { task: RoutineTask }) {
  const { t } = useTranslation();
  return <Text>{t("routines.todayProgress", { count: 3, total: 5 })}</Text>;
}
```

---

## 9. Household Switching

### Storage

Store the active household ID in AsyncStorage (or Zustand with AsyncStorage persistence):

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACTIVE_HOUSEHOLD_KEY = "activeHouseholdId";

async function getActiveHouseholdId(): Promise<string | null> {
  return AsyncStorage.getItem(ACTIVE_HOUSEHOLD_KEY);
}

async function setActiveHouseholdId(id: string): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_HOUSEHOLD_KEY, id);
}
```

### Zustand Store

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppStore {
  activeHouseholdId: string | null;
  setActiveHouseholdId: (id: string) => void;
}

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      activeHouseholdId: null,
      setActiveHouseholdId: (id) => set({ activeHouseholdId: id }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

### Household Picker UI

Place a household picker in the profile/settings area or as a header component. When the user switches:

1. Update `activeHouseholdId` in store
2. Invalidate all TanStack Query caches (they're keyed by `householdId`)
3. Navigate to dashboard

```typescript
function switchHousehold(newId: string) {
  useAppStore.getState().setActiveHouseholdId(newId);
  queryClient.invalidateQueries();
  navigation.navigate("Dashboard");
}
```

### Auto-Select on First Load

On app startup, after fetching user households:
1. If `activeHouseholdId` exists in storage and is still valid, use it
2. Otherwise, pick the first household in the list
3. If user has no households, navigate to OnboardingStack

---

## 10. Features NOT Yet Available (Stubs)

These features have their web page stubs and types/schemas defined, but the server actions and API routes are **not yet implemented**. The mobile app should show these screens as "coming soon" or hide them until the backend is ready.

### Items to Buy

- **What exists:** Types (`HouseholdItem`), Zod schemas (`createItemSchema`, `createUpdateItemSchema`), web page stubs, DB table + RLS policies
- **What's missing:** API routes (`/api/household/:id/items`), server actions (all throw "Not implemented")
- **Mobile approach:** Build the UI screens but disable data fetching until API routes are created

### Reminders

- **What exists:** Types (`Reminder`), Zod schemas, web page stubs, DB table + RLS policies
- **What's missing:** API routes (`/api/household/:id/reminders`), server actions
- **Mobile approach:** Same as Items — stub UI, enable when API is ready

### Urgent Problems

- **What exists:** Types (`UrgentProblem`), Zod schemas, web page stubs, DB table + RLS policies
- **What's missing:** API routes (`/api/household/:id/urgent`), server actions
- **Mobile approach:** Same as above

### Profile Updates

- **What exists:** Types, Zod schema (`createUpdateProfileSchema`)
- **What's missing:** API route for profile updates, server actions for `updateProfile`, `deleteAccount`
- **Mobile approach:** Show profile info as read-only until the API is available

### Push Notifications

- **Not started at all.** Expo Push Notifications will be added to send alerts for urgent problems and reminders.
- **Plan:** Use `expo-notifications` with Expo Push Token, store token in a `push_token` table (to be created), trigger push from server on urgent problem creation and reminder due date.

### Offline Support

- **Not planned for initial mobile release.** Future: local SQLite database (`expo-sqlite`) with sync logic for viewing lists and toggling tasks offline.

### Transfer Ownership

- **Server action exists as stub** — throws "Not implemented". The API route does not exist yet.

---

*This document is the complete reference for building the MyHouz React Native mobile app. It should be updated as new API routes are implemented and features are completed on the web app.*
