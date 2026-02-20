# myhouz Landing Page — AI Generation Prompt

Copy everything below the horizontal rule and paste it into v0, Bolt, or your AI design tool of choice.

---

## PROMPT START

Build a complete, production-ready marketing landing page for **myhouz** — a shared household management web app. Output a single Next.js page file (or a set of clearly labeled component files) using **Tailwind CSS** and **shadcn/ui** component patterns. The page must be fully responsive, accessible (WCAG 2.1 AA), and visually polished on first generation.

---

### PRODUCT CONTEXT

**App name:** myhouz (the "z" is intentional — never write "MyHouse")

**One-liner:** A shared household management app that centralizes tasks, household needs, reminders, and critical info for everyone living under the same roof.

**Primary tagline (EN):** "Your home, finally organized."
**Secondary tagline (EN):** "Stop texting the group chat. Start managing your home."
**Brazilian tagline (PT-BR, shown as supporting copy):** "A casa toda na mesma página."

**Value proposition:** myhouz replaces the patchwork of WhatsApp groups, sticky notes, shared spreadsheets, and verbal agreements that most households rely on today. It gives every person in a household — couples, roommates, multi-generational families — one organized space where nothing falls through the cracks.

**Primary market:** Brazil (pt-BR), with simultaneous US English launch.

**Target audience:** Adults aged 22–45 who share a home with at least one other adult. Couples, roommates, multi-generational families. They are currently coordinating via WhatsApp groups, shared Google Sheets, or just memory — and it is not working.

**Business model:** Freemium. The free tier is permanently useful. Plus plan at $6/month (US) or R$19/mês (Brazil) unlocks advanced features. No credit card required to start.

**Brand personality:** Calm, direct, collaborative, quietly smart, warm without being infantile. No productivity-app jargon ("supercharge", "streamline", "synergize"). No excessive emojis. No gamification. Treat users as competent adults.

---

### DESIGN SYSTEM — FOLLOW EXACTLY

**Font:** Inter (import via Google Fonts or next/font/google). Use Inter for all headings and body text. No secondary display font.

**Font weights used:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Color palette:**
```
--primary:        #0F6FBF   /* Teal-blue — CTAs, links, key actions */
--primary-hover:  #0C5A9E   /* Darker on hover */
--primary-fg:     #FFFFFF   /* White text on primary */

--accent:         #F08C28   /* Warm amber — urgency, highlights, badges */
--accent-hover:   #D4771A
--accent-fg:      #FFFFFF

--background:     #F9F7F5   /* Warm off-white page background */
--surface:        #FFFFFF   /* Card and section backgrounds */

--text-primary:   #272B33   /* Soft charcoal — main body text */
--text-secondary: #5A6073   /* Muted — secondary labels, captions */
--text-muted:     #8C93A3   /* Placeholder, helper text */

--border:         #E2DDD8   /* Dividers, card borders */

--success:        #2E7D52   /* Muted green — done states */
--success-bg:     #EDF7F1

--destructive:    #C0392B   /* Muted red — urgent, high priority */
--destructive-bg: #FDF0EE
```

**Border radius:**
- Cards, panels, modals: `rounded-xl` (12px)
- Buttons: `rounded-lg` (8px)
- Badges/pills: `rounded-full`
- Inputs: `rounded-md` (8px) — not used on this page, just for reference

**Shadows:**
- Cards: `shadow-sm` (subtle, soft)
- Elevated cards on hover: `shadow-md`
- No hard drop shadows

**Spacing:** 8px base grid. Section vertical padding: `py-20` (desktop), `py-14` (mobile). Container: `max-w-6xl mx-auto px-6`.

**Button specs:**
- Primary CTA: filled `--primary` background, white text, `rounded-lg`, `px-6 py-3`, `font-semibold`, `text-base`, minimum height 48px
- Secondary CTA: outlined, `--primary` border and text, same sizing
- Hover: smooth 150ms transition, darken by 8%

---

### ICONS

Use **Lucide React** icon library for all icons. Line-based, 1.5px stroke, rounded caps. Import individually (e.g., `import { ShoppingCart } from "lucide-react"`). Sizes: 20px for inline, 24px for feature icons, 32–40px for large feature icons in the grid.

Do not use any other icon library. Do not use emoji as icons.

---

### PAGE STRUCTURE — BUILD ALL 7 SECTIONS

#### SECTION 1 — HERO

Layout: Full-width, centered, two-column on desktop (text left, visual right), single column on mobile.

**Content (left column):**
- Small eyebrow label above headline: "Household Management" — small caps, `--primary` color, `font-medium`, `text-sm`
- H1 headline: **"Your home, finally organized."** — `text-5xl` (desktop), `text-4xl` (mobile), `font-bold`, `--text-primary` color, line-height 1.1
- Subheadline paragraph: "myhouz gives every person in your household one shared space for tasks, reminders, checklists, and urgent problems — so nothing gets lost in the group chat again." — `text-lg`, `--text-secondary`, `leading-relaxed`, max-width 480px
- Two CTA buttons side by side (stacked on mobile):
  1. Primary: "Get Started Free" — filled `--primary`
  2. Secondary: "See How It Works" — outlined `--primary`
- Trust micro-copy below buttons: "Free plan available. No credit card required. Works on any device." — `text-sm`, `--text-muted`

**Content (right column):**
- A stylized UI mockup placeholder rendered as a realistic-looking card composition using Tailwind and HTML — no actual images needed. Show three stacked cards that simulate the app's list interface:
  - Card 1 (Items to Buy): Shows a badge "Buy" in blue, item name "Dishwasher tabs", priority dot in amber, status "Pending", small circular avatar placeholder "L"
  - Card 2 (Routine): Shows a badge "Weekly" in gray, checklist name "Apartment cleaning", a thin progress bar at 60% complete, small circular avatar placeholder "M"
  - Card 3 (Urgent): Shows a pulsing red dot, text "Water heater leak — reported", badge "Urgent" in red
- These cards should have `bg-white`, `rounded-xl`, `shadow-md`, `p-4`, stacked at slight offsets to create depth
- Wrap the card composition in a `rounded-2xl` container with a subtle gradient background using the `--background` color

**Background:** Section background `--background` (#F9F7F5). No hero image. Clean and minimal.

---

#### SECTION 2 — PROBLEM STATEMENT

Layout: Centered, max-width 720px, text-focused.

**Content:**
- Section label: "Sound familiar?" — `text-sm`, `font-medium`, `--accent` color
- H2: "Tired of scattered messages and forgotten tasks?" — `text-3xl`, `font-bold`
- Paragraph: "Most households run on group chats, sticky notes, and wishful thinking. Things fall through the cracks. Responsibilities go unacknowledged. And when something urgent happens — a broken appliance, an unpaid bill — there's no structured way to handle it. myhouz gives your household a proper operating system, without the complexity of a project management tool."
- Three problem cards in a row (stacked on mobile), each with:
  - A Lucide icon (MessageCircle, AlertTriangle, Clock — all in `--accent` color, 28px)
  - A short bold label: "Lost in the chat", "No one knows who did it", "Urgent issues go unnoticed"
  - One sentence of supporting copy in `--text-secondary`
- Card style: `bg-white`, `rounded-xl`, `shadow-sm`, `p-6`, left border strip 3px `--accent`

**Section background:** `--background`

---

#### SECTION 3 — FEATURES GRID

Layout: Centered heading + subheading, then a 2x2 or 2x3 grid of feature cards below (2 columns on tablet, 3 on desktop, 1 on mobile).

**Section heading:** "Everything your household needs, in one place" — `text-3xl`, `font-bold`, centered
**Section subheading:** "From the weekly grocery run to the burst pipe at midnight — myhouz has a module for it." — `text-lg`, `--text-secondary`, centered

**Feature cards — use exactly these 5:**

1. **Items to Buy**
   - Icon: `ShoppingCart` (Lucide, 32px, `--primary` color)
   - Title: "Items to Buy"
   - Description: "Track everything your household needs — groceries, repairs, replacements. Assign type (buy, repair, fix), set priority, and assign to a member. Nothing gets forgotten."
   - Badge: "Buy · Repair · Fix" in `--primary` with light `--primary` background

2. **Routine Checklists**
   - Icon: `CheckSquare` (Lucide, 32px, `--primary` color)
   - Title: "Routine Checklists"
   - Description: "Create recurring task lists for daily, weekly, or monthly routines. Mark items complete each cycle. See who did what and when — no more 'I thought you were doing it.'"
   - Badge: "Daily · Weekly · Monthly" in `--primary` with light background

3. **Reminders**
   - Icon: `Bell` (Lucide, 32px, `--primary` color)
   - Title: "Reminders"
   - Description: "Set reminders for any household task and assign them to specific members. Due dates, assignees, and completion status — all visible to everyone in the household."
   - Badge: "Assignable · Trackable" in `--primary` with light background

4. **Urgent Problems**
   - Icon: `AlertOctagon` (Lucide, 32px, `--destructive` color)
   - Title: "Urgent Problems"
   - Description: "Flag critical household issues and notify all members instantly. A persistent alert stays visible on everyone's dashboard until the problem is resolved. No more emergencies buried in chat."
   - Badge: "Instant Alerts" in `--destructive` with `--destructive-bg` background

5. **Household Members**
   - Icon: `Users` (Lucide, 32px, `--primary` color)
   - Title: "Household Members"
   - Description: "Invite people with a link. Assign roles. Everyone gets access to everything they need — and only what they need. Ownership can be transferred as your household evolves."
   - Badge: "Invite-based" in `--success` with `--success-bg` background

**Card style:** `bg-white`, `rounded-xl`, `shadow-sm`, `p-6`, `border border-[--border]`. On hover: `shadow-md`, `border-[--primary]` transition 150ms.

**Section background:** Slightly darker warm off-white: `#F3F0EC`

---

#### SECTION 4 — HOW IT WORKS

Layout: Centered heading, then three steps in a horizontal row (stacked vertically on mobile) connected by a subtle dashed line between them.

**Section heading:** "Up and running in minutes" — `text-3xl`, `font-bold`, centered
**Subheading:** "No setup guides. No training. Just invite your household and start organizing." — `text-lg`, `--text-secondary`, centered

**Three steps:**

1. **Step 1 — Create your household**
   - Circle number badge: "1" — 48px circle, `--primary` background, white text, `font-bold`
   - Step title: "Create your household" — `text-xl`, `font-semibold`
   - Step description: "Sign up in seconds and give your household a name. You're the owner — you control who's in and what they can see."
   - Icon below title: `Home` (Lucide, 32px, `--primary`)

2. **Step 2 — Invite your people**
   - Circle number badge: "2"
   - Step title: "Invite your people"
   - Step description: "Share a single invite link. Your partner, roommates, or family members join with one click. No separate account setup required on their end."
   - Icon: `Link` (Lucide, 32px, `--primary`)

3. **Step 3 — Start organizing together**
   - Circle number badge: "3"
   - Step title: "Start organizing together"
   - Step description: "Add tasks, set reminders, flag urgent problems, build checklists. Everything is shared and visible in real time. The house practically runs itself."
   - Icon: `Sparkles` (Lucide, 32px, `--primary`)

**Connector:** A horizontal dashed line (`border-dashed border-[--border]`) connecting the three step circles on desktop. Hidden on mobile.

**Section background:** `--background`

---

#### SECTION 5 — SOCIAL PROOF

Layout: Centered heading + 3 testimonial cards in a row (stacked on mobile).

**Section heading:** "Households that actually stay organized" — `text-3xl`, `font-bold`, centered

**Three testimonial cards:**

1. **Lucas & Ana, São Paulo**
   - Avatar: Placeholder circle with initials "LA", `--primary` background
   - Star rating: 5 stars (use five `★` characters in `--accent` color)
   - Quote: "We used to argue about who was supposed to buy dishwasher tabs or fix the leaking faucet. Now everything is in myhouz and we both see it. No more arguments — just a shared list that actually gets done."
   - Attribution: "Lucas & Ana — couple, apartment in São Paulo"

2. **Mariana, Fernanda & Clara, Rio de Janeiro**
   - Avatar: Three small overlapping circles with initials "M", "F", "C"
   - Star rating: 5 stars
   - Quote: "The WhatsApp group was chaos. Important tasks were getting buried. myhouz gave us one place where chores are assigned, visible, and actually completed. The cleaning rotation alone saved us from a dozen arguments."
   - Attribution: "Three roommates, apartment in Rio de Janeiro"

3. **Jordan & Sarah, Austin TX**
   - Avatar: Placeholder circle with initials "JS", `--primary` background
   - Star rating: 5 stars
   - Quote: "I needed something simple enough that Sarah would actually use it alongside me. myhouz nailed it. The Urgent Problems alert alone was worth it — we had a pipe issue at 11pm and both of us knew instantly."
   - Attribution: "Jordan & Sarah — homeowners, Austin, Texas"

**Card style:** `bg-white`, `rounded-xl`, `shadow-sm`, `p-6`, `border border-[--border]`

**Below the testimonials, centered:** A row of trust indicators:
- "Free to start" with a `CheckCircle` Lucide icon in `--success`
- "Works on any device" with a `Monitor` icon in `--success`
- "No credit card required" with a `ShieldCheck` icon in `--success`

**Section background:** `#F3F0EC`

---

#### SECTION 6 — FINAL CTA

Layout: Full-width section with a centered card, max-width 640px. The section itself has a `--primary` background with white text.

**Content:**
- H2: "Your household deserves better than a group chat." — `text-3xl`, `font-bold`, `text-white`
- Paragraph: "Join thousands of households who replaced scattered messages with one organized space. Free to start — no credit card, no setup complexity, no learning curve." — `text-lg`, `text-white/80`
- Primary CTA button (inverted): White background, `--primary` text, `font-semibold`, `rounded-lg`, `px-8 py-4`, large
- CTA label: "Get Started Free"
- Below button: "Already have an account? Sign in" — `text-white/70`, `text-sm`, with a text link

**Section background:** `--primary` (#0F6FBF)

Note: The background can optionally include a very subtle geometric pattern (thin grid lines or dots in white at 5% opacity) to add texture without being distracting.

---

#### SECTION 7 — FOOTER

Layout: Dark footer. Four columns on desktop, two on mobile, one on smallest screens.

**Footer background:** `#1C2228` (near-black, not pure black)
**Footer text:** `#9CA3AF` (muted gray)
**Footer links hover:** white

**Column 1 — Brand:**
- App name "myhouz" in white, `font-bold`, `text-xl`
- Tagline: "Your home, finally organized." in muted gray
- Small paragraph: "A shared household management app built for couples, roommates, and families."
- Social icons (placeholder): Twitter/X, Instagram, TikTok — use `ExternalLink` Lucide icon as placeholder for each

**Column 2 — Product:**
- Heading: "Product" — `text-sm`, `font-semibold`, `text-white`
- Links: Features, Pricing, How It Works, Changelog, Roadmap

**Column 3 — Company:**
- Heading: "Company" — same style
- Links: About, Blog, Press Kit, Contact

**Column 4 — Legal:**
- Heading: "Legal" — same style
- Links: Privacy Policy, Terms of Service, Cookie Policy

**Bottom bar:** Full-width divider line, then copyright row:
- Left: "© 2026 myhouz. All rights reserved."
- Right: Language toggle — two links: "English" (active, white) | "Português" (muted)

---

### NAVIGATION (STICKY HEADER)

Sticky top navbar. Background: `bg-white/95` with `backdrop-blur-sm`. Bottom border: 1px `--border`. Height: 64px.

**Left:** App name "myhouz" in `--primary`, `font-bold`, `text-xl`. Optionally prepend a small house icon (`Home` Lucide, 18px).

**Center (desktop only):** Navigation links — Features, How It Works, Pricing (ghost text links, `--text-secondary`, hover `--text-primary`)

**Right:**
- "Sign In" — ghost text link, `--text-secondary`
- "Get Started Free" — filled primary button, `rounded-lg`, `px-4 py-2`, `text-sm`, `font-semibold`

**Mobile:** Hide center links. Show hamburger menu icon (`Menu` Lucide) on the right, replacing the two right-side elements. The hamburger opens a slide-down mobile menu (use a simple `useState` toggle) with all links and both buttons stacked.

---

### TECHNICAL REQUIREMENTS

**Framework:** Next.js 15 (App Router). The output should be a valid `page.tsx` file at `app/(marketing)/page.tsx` or equivalent, or a set of component files with clear import structure.

**Language:** TypeScript. All components typed. No `any`. Use `import type` for type-only imports.

**Styling:** Tailwind CSS 3 only. No inline styles. No CSS modules. Use Tailwind utility classes throughout. Define custom colors in the component as Tailwind arbitrary values (e.g., `bg-[#0F6FBF]`) since this is a standalone marketing page — no need for a full Tailwind config extension.

**Icons:** Lucide React only. Import individually. No icon CDN.

**Animations:** Use Tailwind's built-in `transition`, `duration-150`, `ease-in-out` for hover effects. The urgent problems pulsing red dot should use Tailwind's `animate-pulse`. No external animation libraries.

**Accessibility:**
- All images/icons have `aria-label` or `alt` text
- Buttons have descriptive labels
- Color contrast meets WCAG AA (4.5:1 for normal text)
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<h1>` through `<h3>` hierarchy correct
- One `<h1>` on the page (in the hero)
- Focusable elements have visible focus rings

**Performance:**
- No hero image (UI mockup is HTML/CSS only)
- No external image dependencies
- Minimal JavaScript — only the mobile nav toggle needs `useState`; everything else is static
- Mark the page as a Server Component except for the mobile nav toggle which must be extracted into a `"use client"` component

**Meta tags (include in the page's `<head>` via Next.js Metadata API):**
```typescript
export const metadata: Metadata = {
  title: "myhouz — Your Home, Finally Organized | Household Management App",
  description: "myhouz gives your household one shared space for tasks, reminders, checklists, and urgent problems. Free to start. Built for couples, roommates, and families.",
  keywords: ["household management app", "shared to-do list for roommates", "home organization app", "chore tracker", "household tasks app"],
  openGraph: {
    title: "myhouz — Your Home, Finally Organized",
    description: "Replace scattered messages with one organized space for your entire household.",
    url: "https://myhouz.app",
    siteName: "myhouz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "myhouz — Your Home, Finally Organized",
    description: "Replace scattered messages with one organized space for your entire household.",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://myhouz.app",
    languages: {
      "en-US": "https://myhouz.app/en",
      "pt-BR": "https://myhouz.app/pt-br",
    },
  },
}
```

**JSON-LD structured data** — include a `<script type="application/ld+json">` block in the page with SoftwareApplication schema:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "myhouz",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web",
  "description": "A shared household management app that centralizes tasks, household needs, reminders, and critical info for everyone living under the same roof.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free plan available"
  }
}
```

---

### COPY TONE RULES

- Second person throughout: "your household", "you", "your home" — never third person
- Short sentences. No sentence longer than 20 words in body copy.
- No jargon: do not use "streamline", "supercharge", "leverage", "synergy", "optimize", "productivity suite"
- Avoid exclamation marks in body copy (one is acceptable in the hero maximum)
- Error states (if any placeholders): human language, never technical
- The word "free" appears in at least two CTAs to reinforce the no-risk entry point

---

### WHAT NOT TO DO

- Do not use stock photo placeholders or `<img>` tags pointing to placeholder services
- Do not use any external CSS framework other than Tailwind
- Do not use any component library other than shadcn/ui patterns (you can reference shadcn structure but implement with Tailwind — do not import from shadcn directly since this is a standalone page)
- Do not add a cookie consent banner, chat widget, or any third-party embed
- Do not add multiple competing CTAs in the same viewport — each section has one primary action
- Do not use lorem ipsum — all copy must be the real copy provided above
- Do not add a pricing section (pricing page is separate) — only mention "free" and reference pricing conceptually
- Do not make the hero headline longer than 8 words
- Do not use pure black (`#000000`) anywhere — use `--text-primary` (#272B33) for darkest text
- Do not use pure white backgrounds for the page itself — use `--background` (#F9F7F5)

---

### OUTPUT FORMAT

Output the following files:

1. `app/(marketing)/page.tsx` — the main landing page Server Component with all sections composed together and metadata export
2. `components/marketing/nav.tsx` — the sticky navigation with mobile menu toggle (Client Component with `"use client"`)
3. `components/marketing/hero.tsx` — hero section with the UI mockup composition
4. `components/marketing/features.tsx` — features grid
5. `components/marketing/how-it-works.tsx` — three-step section
6. `components/marketing/social-proof.tsx` — testimonials
7. `components/marketing/cta.tsx` — final CTA section
8. `components/marketing/footer.tsx` — footer

Each file should have clean TypeScript, proper imports, and no `TODO` comments — this is production-ready output. Include all copy exactly as specified in this prompt.

## PROMPT END
