import type { Metadata } from "next";
import Link from "next/link";
import {
  Brain,
  MessageSquare,
  Wrench,
  AlertTriangle,
  ShoppingCart,
  CheckSquare,
  Bell,
  AlertOctagon,
  Users,
  LayoutDashboard,
  Check,
  Twitter,
  Instagram,
} from "lucide-react";
import { Button } from "@home/ui";
import { MobileNav } from "@/components/landing/MobileNav";
import { AppMockup } from "@/components/landing/AppMockup";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "MyHouz — Your Home, Finally Organized",
  description:
    "MyHouz gives everyone under your roof one place to track tasks, manage household needs, and handle what matters. Start free today.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://myhouz.app/" },
  openGraph: {
    type: "website",
    url: "https://myhouz.app/",
    title: "MyHouz — Your Home, Finally Organized",
    description:
      "One place for tasks, items to buy, routines, reminders, and urgent problems. Built for everyone under your roof.",
    siteName: "MyHouz",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyHouz — Your Home, Finally Organized",
    description:
      "One place for tasks, items to buy, routines, reminders, and urgent problems. Built for everyone under your roof.",
  },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Problems />
        <Features />
        <HowItWorks />
        <SocialProof />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

function Nav() {
  return (
    <header className="sticky top-0 z-20 bg-card/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-primary tracking-tight"
          >
            MyHouz
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button asChild size="default">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu — client island */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32"
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(293 76% 54% / 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/8 border border-primary/15 rounded-full mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-medium text-primary">
                Shared household management
              </span>
            </div>

            <h1
              id="hero-heading"
              className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-foreground"
            >
              Your home,{" "}
              <span className="text-primary">finally organized.</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              MyHouz gives everyone under your roof a single place to track
              tasks, manage household needs, and handle what matters — without
              the chaos of group chats.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-base px-7 h-12">
                <Link href="/signup">Get Started — Free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-7 h-12"
              >
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center gap-5 justify-center lg:justify-start">
              <TrustPill text="No credit card required" />
              <TrustPill text="Free plan, always" />
              <TrustPill text="Up and running in 30 seconds" />
            </div>
          </div>

          {/* Right: app mockup */}
          <div className="flex justify-center lg:justify-end">
            <AppMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustPill({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Check size={14} className="text-success flex-shrink-0" />
      {text}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const painPoints = [
  {
    icon: Brain,
    heading: "The grocery list lives in someone's head",
    body: "And when that person is busy, everyone waits or makes a duplicate trip.",
  },
  {
    icon: MessageSquare,
    heading: "Important messages get buried in the group chat",
    body: "Between memes and weekend plans, the broken fridge reminder disappears.",
  },
  {
    icon: Wrench,
    heading: "Nobody knows who was supposed to fix the leaky faucet",
    body: "It was mentioned three weeks ago. Someone said they'd handle it. Nothing happened.",
  },
  {
    icon: AlertTriangle,
    heading: "A pipe bursts and no one knows who to call",
    body: "The plumber's number is in someone's old texts. The building manager's contact is unknown.",
  },
];

function Problems() {
  return (
    <section
      aria-labelledby="problems-heading"
      className="py-20 md:py-28 bg-secondary/40"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="problems-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Sound familiar?
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Every household runs into the same friction. It does not have to be
            this way.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {painPoints.map((point) => (
            <PainCard key={point.heading} {...point} />
          ))}
        </div>

        <p className="mt-12 text-center text-lg font-semibold text-foreground">
          MyHouz fixes all of this.
        </p>
      </div>
    </section>
  );
}

function PainCard({
  icon: Icon,
  heading,
  body,
}: {
  icon: React.ElementType;
  heading: string;
  body: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
        <Icon size={20} className="text-destructive" />
      </div>
      <h3 className="text-sm font-semibold text-foreground leading-snug mb-2">
        {heading}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

const features = [
  {
    icon: ShoppingCart,
    name: "Items to Buy",
    description:
      "Track what your home needs — things to buy, repair, or fix. Assign to members, set priorities, and mark done when handled.",
    color: "bg-info/10 text-info",
  },
  {
    icon: CheckSquare,
    name: "Routine Checklists",
    description:
      "Create daily, weekly, or monthly task lists. Everyone sees what has been done and what is still waiting.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Bell,
    name: "Reminders",
    description:
      "Never forget what matters. Set reminders and assign them to the right person in your household.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: AlertOctagon,
    name: "Urgent Problems",
    description:
      "Something broke? Flag it as urgent. Everyone in your household gets notified instantly.",
    color: "bg-destructive/10 text-destructive",
    accent: true,
  },
  {
    icon: Users,
    name: "Household Members",
    description:
      "Invite everyone via a shareable link. No complicated setup or lengthy onboarding flow.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: LayoutDashboard,
    name: "Smart Dashboard",
    description:
      "See everything at a glance — what is pending, what is urgent, and what has already been handled.",
    color: "bg-brand-accent/10 text-brand-accent",
  },
];

function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-20 md:py-28"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Everything your household needs.{" "}
            <span className="text-primary">One place.</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
            Built around how households actually work — not how productivity
            tools think they should work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.name} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  name,
  description,
  color,
  accent,
}: {
  icon: React.ElementType;
  name: string;
  description: string;
  color: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`bg-card border rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md ${
        accent ? "border-destructive/30" : "border-border"
      }`}
    >
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${color}`}
      >
        <Icon size={22} />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// How It Works
// ---------------------------------------------------------------------------

const steps = [
  {
    number: "1",
    title: "Create your household",
    description:
      "Sign up and give your home a name. Takes 30 seconds. No credit card needed.",
  },
  {
    number: "2",
    title: "Invite your people",
    description:
      "Share a link. Roommates, partner, family — anyone under your roof joins instantly.",
  },
  {
    number: "3",
    title: "Start organizing",
    description:
      "Add items, set routines, assign reminders. The whole house stays in sync from day one.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="py-20 md:py-28 bg-secondary/40"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Up and running in 3 steps
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            No setup guide. No onboarding call. Just your household, organized.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-border"
            aria-hidden="true"
          />

          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button asChild size="lg" className="text-base px-8 h-12">
            <Link href="/signup">Create Your Household</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center md:items-center">
      <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-md mb-6">
        <span className="text-3xl font-bold text-primary-foreground">
          {number}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Social Proof
// ---------------------------------------------------------------------------

const testimonials = [
  {
    quote:
      "I stopped being the only one who knew what the house needed. Now we both see it.",
    name: "Lucas",
    age: 29,
    location: "São Paulo",
    initials: "L",
    avatarColor: "bg-primary/20 text-primary",
  },
  {
    quote:
      "The WhatsApp group was chaos. MyHouz actually keeps things organized — even my roommate uses it.",
    name: "Mariana",
    age: 26,
    location: "Rio de Janeiro",
    initials: "M",
    avatarColor: "bg-success/20 text-success",
  },
  {
    quote:
      "Simple enough that my spouse actually uses it. That is the real test.",
    name: "Jordan",
    age: 37,
    location: "Austin",
    initials: "J",
    avatarColor: "bg-brand-accent/20 text-brand-accent",
  },
];

function SocialProof() {
  return (
    <section
      aria-labelledby="social-proof-heading"
      className="py-20 md:py-28"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2
            id="social-proof-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Built for real households
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Not ideal households. Not aspiring households. Actual ones.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  quote,
  name,
  age,
  location,
  initials,
  avatarColor,
}: {
  quote: string;
  name: string;
  age: number;
  location: string;
  initials: string;
  avatarColor: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-4">
      {/* Quote marks */}
      <div className="text-4xl font-serif leading-none text-primary/30 select-none">
        &ldquo;
      </div>
      <p className="text-base text-foreground leading-relaxed -mt-3">
        {quote}
      </p>
      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarColor}`}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}, {age}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

const freePlanFeatures = [
  "Up to 3 household members",
  "50 items across all categories",
  "5 routine checklists",
  "20 reminders",
  "Urgent Problems",
  "Invite via shareable link",
];

const plusPlanFeatures = [
  "Up to 10 household members",
  "Unlimited items, checklists, reminders",
  "Bills management",
  "Passwords & Useful Info",
  "Guest access (cleaners, visitors)",
  "Priority support",
];

function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-20 md:py-28 bg-secondary/40"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2
            id="pricing-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Simple pricing.{" "}
            <span className="text-primary">One household, one plan.</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Start free. Upgrade when your household grows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free plan */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Free
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Everything you need to get started.
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {freePlanFeatures.map((f) => (
                <PricingFeature key={f} text={f} />
              ))}
            </ul>

            <Button asChild variant="outline" size="lg" className="w-full h-11">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Plus plan */}
          <div className="bg-primary rounded-xl p-8 shadow-lg flex flex-col relative overflow-hidden">
            {/* Recommended badge */}
            <div className="absolute top-4 right-4">
              <span className="text-xs font-semibold bg-primary-foreground/20 text-primary-foreground px-2.5 py-1 rounded-full">
                Recommended
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wide mb-2">
                Plus
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary-foreground">
                  $6
                </span>
                <span className="text-primary-foreground/70 text-sm">
                  /month
                </span>
              </div>
              <p className="text-primary-foreground/70 text-sm mt-1">
                or $55/year — save two months.
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {plusPlanFeatures.map((f) => (
                <PricingFeature key={f} text={f} inverted />
              ))}
            </ul>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="w-full h-11 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
            >
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          No credit card required for the free plan. Cancel anytime.
        </p>
      </div>
    </section>
  );
}

function PricingFeature({
  text,
  inverted = false,
}: {
  text: string;
  inverted?: boolean;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <Check
        size={15}
        className={`mt-0.5 flex-shrink-0 ${
          inverted ? "text-primary-foreground/80" : "text-success"
        }`}
      />
      <span
        className={`text-sm leading-relaxed ${
          inverted ? "text-primary-foreground/90" : "text-foreground"
        }`}
      >
        {text}
      </span>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Final CTA
// ---------------------------------------------------------------------------

function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="py-20 md:py-28 relative overflow-hidden"
    >
      {/* Background tint */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, hsl(293 76% 54% / 0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          id="final-cta-heading"
          className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
        >
          Your household deserves better than a group chat.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Join thousands of households that stopped arguing about who was
          supposed to buy toilet paper.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="text-base px-10 h-12">
            <Link href="/signup">Get Started — It&apos;s Free</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          No credit card. No commitment. Just a more organized home.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ],
  Company: [
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-xl font-bold text-primary tracking-tight"
            >
              MyHouz
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              One place for everything your home needs.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://twitter.com/myhouz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MyHouz on X (Twitter)"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://instagram.com/myhouz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MyHouz on Instagram"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-4">
                {group}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 MyHouz. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with care for households everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
