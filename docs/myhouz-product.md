# MyHouz — Product Context Document

**Created:** 2026-02-17
**App name:** MyHouz
**Status:** MVP in progress — core features implemented
**Owners:** Renan Martins (Tech & Brand) · Andressa Hora (Marketing & Business)
**Connected ideas:** [Pet Manager](./pet-manager.md), [Vehicle Manager](./vehicle-manager.md), [Grocery Manager](./grocery-manager.md)

---

## Product Definition

**One-liner:** A shared household management app that centralizes bills, tasks, household needs, and critical info for everyone living under the same roof.

**Short description:** MyHouz gives all members of a household a single place to track recurring tasks, manage bills, track things that need to be purchased or fixed, store sensitive household info, and respond to urgent issues — with role-based access so external visitors (cleaners, guests) only see what's relevant to them.

---

## Core Feature Modules

| Module | Description |
|---|---|
| **Bills** | Track household bills: amount, due date, paid status, responsible party. Recurring or one-off. |
| **Reminders** | General-purpose reminders for household tasks. Assignable to members. |
| **Items to Buy** | Track things the household needs: items to purchase (wishlist), things to repair/fix, replacements needed. Each item can have a type (buy / repair / fix), priority, and status. |
| **Household Members** | Manage who lives in or has access to the house. Profile per person, tied to access level. |
| **Routine Checklists** | Recurring task templates (daily/weekly/monthly). Examples: water plants, clean bathroom. Completion tracked per cycle. |
| **Urgent Problems** | High-priority flag for critical issues. Triggers push notification to all relevant members + persistent highlight on home screen until resolved. |
| **Passwords & Useful Info** | Secure storage for household-scoped data: WiFi credentials, alarm codes, emergency contacts, utility account numbers, etc. |
| **Access Control** | Role-based permissions. Controls which modules and data each user can see or interact with. |

---

## User Roles & Access Levels

Three roles to start. Expand only if a real use case demands it.

### Owner
- Full access to all modules
- Manages members and their roles
- Can delete household or transfer ownership
- Only role that can access Passwords & Useful Info (by default)

### Member
- Access to: Bills, Reminders, Items to Buy, Routine Checklists, Urgent Problems
- Can view/edit shared data within those modules
- Cannot manage other members or access sensitive info unless explicitly granted

### Guest (Limited Access)
- Designed for external parties (e.g., cleaner, dog walker, temporary visitor)
- Access is scoped explicitly per guest: Owner selects which modules/views are visible
- Likely access: Routine Checklists (read-only), specific Reminders
- No access to: Bills, Passwords, member management, Urgent Problems

**Access rules (decided):**
- Only Owners can manage Guest access
- Owner configures per-guest permissions: which sections are visible + read-only vs read/write per section
- Guests can perform actions (e.g., mark checklist items complete) only if granted write access to that section
- Passwords module is Owner-only by default; Owner can grant access to specific Members

---

## Technical Stack Summary

| Layer | Technology |
|---|---|
| Web app + API | Next.js (App Router) — serves both frontend and API routes |
| Mobile app | React Native (Expo) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth — social sign-in (Google, Apple), email/password, free tier |
| Notifications | Email + in-browser (no native push for MVP) |
| Sensitive data storage | Simple password prompt to reveal secrets; Face ID unlock deferred to later |

---

## Key Architectural Considerations

**Multi-tenancy model (confirmed)**
Each household is a tenant. All data is scoped to a `household_id`. A user can belong to multiple households from day one — schema must support this even if the UI initially shows a single household switcher.

**Real-time sync**
Optimistic UI + polling is acceptable for MVP. No WebSocket infrastructure needed initially. Supabase Realtime can be layered in later if needed.

**Invite-based onboarding**
Users join a household via invite link or code, not by creating a household themselves first. This needs to be a first-class flow, not an afterthought.

**Notification strategy**
Urgent Problems use email + in-browser alerts for MVP. No native push notifications initially. Expo Push can be added when the React Native app ships.

**Sensitive data access**
Passwords & Useful Info module is protected by a simple password re-prompt (user must re-enter their account password to view secrets). Face ID / biometric unlock deferred to post-MVP. Data still encrypted at rest via Supabase (database-level encryption), but no field-level encryption needed for MVP.

**Offline support**
The app should be tolerant of intermittent connectivity for basic operations (viewing lists, marking items done). Consider PWA with service worker or React Native with local SQLite + sync for offline resilience.

**Integration surface**
Three connected products share the same household context: Pet Manager, Vehicle Manager, Grocery Manager. Design the API with clean module boundaries. Shared auth (Supabase), shared `household_id` scope, separate feature modules. Consider a monorepo structure to share types, auth, and DB client across all products.

---

## Data Domains / Entities

```
Household
  - id, name, created_at
  - owner_id (FK -> User)

User
  - id, name, email, avatar
  - can belong to multiple households

HouseholdMember
  - household_id, user_id, role (owner | member | guest)
  - permissions: [{ section, access: read | write }]  (for guests, configured by Owner)

Bill
  - household_id, name, amount, due_date, recurrence, paid_by, status

Reminder
  - household_id, title, due_at, assigned_to, completed

HouseholdItem (Items to Buy)
  - household_id, name, type (buy | repair | fix), priority (low | medium | high)
  - status (pending | in_progress | done), added_by, assigned_to, notes, resolved_at

RoutineChecklist
  - household_id, title, recurrence (daily | weekly | monthly | custom)
  - RoutineChecklistItem: checklist_id, label, last_completed_at, completed_by

UrgentProblem
  - household_id, title, description, reported_by, resolved_at, is_active

HouseholdSecret (Passwords & Useful Info)
  - household_id, label, value_encrypted, category (password | contact | code | other)
  - visible_to_roles (array)
```

---

## MVP Scope

### Phase 1 — MVP (Build first)

Goal: Validate core daily utility. Get one household using it every day.

- Household creation + invite-based member onboarding
- Household Members management (add, assign role, remove)
- Items to Buy (household needs tracker — buy, repair, fix — with priority and status)
- Routine Checklists (create, set recurrence, mark complete)
- Reminders (basic, assignable)
- Urgent Problems (in-app flag + home screen highlight; push notifications as fast follow)
- Web app only (Next.js); mobile as PWA or deferred to Phase 2

**Skip in MVP:** Bills, Passwords & Useful Info, Guest role (unless a specific use case is confirmed)

Rationale: Items to Buy and checklists are the highest-frequency touchpoints. They drive daily habit formation. Bills and passwords are important but lower frequency and higher risk (auth, encryption) — worth getting right rather than fast.

---

### Current Implementation Status (as of 2026-02-20)

**Done:**
- Auth: Email/password login + signup, Google OAuth, session management, auth middleware
- Onboarding: Create household flow with auto-membership
- Routine Tasks: Full CRUD + toggle completion + streaks + completion history + icon picker + custom recurrence (daily/weekly/monthly/weekdays/weekends/custom days/interval)
- Household Members: List, change role, remove member, leave household
- Invites: Generate link (with optional email notification via Resend), copy link, revoke, accept (with deep link support)
- Dashboard: Summary widgets for routines + items + reminders, calendar view with task schedule
- Settings: Household name editing, delete household, language selector (pt-BR / en-US)
- REST API: 14 route files implemented for mobile app consumption (auth, user, household, members, invites, routines)
- i18n: Full pt-BR + en-US translation coverage across all namespaces
- Shared packages: @home/auth, @home/db, @home/types, @home/ui — all fully operational

**Remaining for MVP:**
- Items to Buy: Page stubs exist, server actions + API routes need implementation
- Reminders: Page stubs exist, server actions + API routes need implementation
- Urgent Problems: Page stubs exist, server actions + API routes need implementation
- Profile updates: Server action stubs, needs implementation
- Transfer ownership: Single unimplemented household action

**Data model change:** The routines module diverged from the original design. Instead of `routine_checklist` (container) + `routine_checklist_item` (sub-tasks), the implementation uses `routine_task` (standalone task) + `routine_task_completion` (history). This is simpler, supports streaks, and maps better to real usage patterns.

---

### Phase 2 — Post-validation

- Bills management (recurring billing, due date alerts)
- Passwords & Useful Info (with encryption)
- Guest access (scoped permissions)
- Native mobile app (React Native) + push notifications
- Multi-household support (for users managing more than one property)

### Phase 3 — Expansion (define when Phase 2 ships)

- Integration with connected products: Pet Manager, Vehicle Manager, Grocery Manager
- Reporting (bill history, task completion rates)
- Shared calendar view across modules
- Biometric unlock (Face ID) for Passwords module
- Native push notifications via Expo Push
- External service integrations (bank feeds for bills, smart home triggers, etc.)

---

## Decisions Log

All original open questions have been resolved.

| # | Question | Decision |
|---|---|---|
| 1 | Mobile strategy | React Native (Expo) |
| 2 | Auth provider | Supabase Auth — social sign-in (Google, Apple) + email/password, free tier |
| 3 | Real-time approach | Optimistic UI + polling for MVP. No WebSockets needed initially |
| 4 | Passwords module security | Simple password re-prompt to view secrets. Face ID deferred to later |
| 5 | Multi-household from day one | Yes — schema supports it from the start |
| 6 | Guest permission granularity | Owner configures per-guest: which sections + read/write per section |
| 7 | Connected ideas | Pet Manager, Vehicle Manager, Grocery Manager — shared household context, auth, and DB |
| 8 | Notification fallback | Email + in-browser alerts |
