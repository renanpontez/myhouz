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
import { getTranslations } from "next-intl/server";
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

export default async function LandingPage() {
  const t = await getTranslations("landing");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav t={t} />
      <main>
        <Hero t={t} />
        <Problems t={t} />
        <Features t={t} />
        <HowItWorks t={t} />
        <SocialProof t={t} />
        <Pricing t={t} />
        <FinalCta t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslatorFn = (key: string, values?: Record<string, any>) => string;
interface SectionProps {
  t: TranslatorFn;
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

function Nav({ t }: SectionProps) {
  return (
    <header className="sticky top-0 z-20 bg-card/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-primary tracking-tight"
          >
            MyHouz
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.features")}
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.howItWorks")}
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.pricing")}
            </Link>
          </nav>

          <div className="hidden md:block">
            <Button asChild size="default">
              <Link href="/signup">{t("nav.getStarted")}</Link>
            </Button>
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero({ t }: SectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32"
    >
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
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/8 border border-primary/15 rounded-full mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-medium text-primary">
                {t("hero.eyebrow")}
              </span>
            </div>

            <h1
              id="hero-heading"
              className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-foreground"
            >
              {t("hero.titleStart")}{" "}
              <span className="text-primary">{t("hero.titleHighlight")}</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-base px-7 h-12">
                <Link href="/signup">{t("hero.ctaPrimary")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-7 h-12"
              >
                <Link href="#how-it-works">{t("hero.ctaSecondary")}</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5 justify-center lg:justify-start">
              <TrustPill text={t("hero.trustNoCreditCard")} />
              <TrustPill text={t("hero.trustFreePlan")} />
              <TrustPill text={t("hero.trustQuickSetup")} />
            </div>
          </div>

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

function Problems({ t }: SectionProps) {
  const painPoints = [
    { icon: Brain, titleKey: "pain1Title" as const, bodyKey: "pain1Body" as const },
    { icon: MessageSquare, titleKey: "pain2Title" as const, bodyKey: "pain2Body" as const },
    { icon: Wrench, titleKey: "pain3Title" as const, bodyKey: "pain3Body" as const },
    { icon: AlertTriangle, titleKey: "pain4Title" as const, bodyKey: "pain4Body" as const },
  ];

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
            {t("problems.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            {t("problems.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {painPoints.map((point) => (
            <PainCard
              key={point.titleKey}
              icon={point.icon}
              heading={t(`problems.${point.titleKey}`)}
              body={t(`problems.${point.bodyKey}`)}
            />
          ))}
        </div>

        <p className="mt-12 text-center text-lg font-semibold text-foreground">
          {t("problems.fixesAll")}
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

function Features({ t }: SectionProps) {
  const features = [
    {
      icon: ShoppingCart,
      nameKey: "itemsName" as const,
      descKey: "itemsDescription" as const,
      color: "bg-info/10 text-info",
    },
    {
      icon: CheckSquare,
      nameKey: "routinesName" as const,
      descKey: "routinesDescription" as const,
      color: "bg-success/10 text-success",
    },
    {
      icon: Bell,
      nameKey: "remindersName" as const,
      descKey: "remindersDescription" as const,
      color: "bg-warning/10 text-warning",
    },
    {
      icon: AlertOctagon,
      nameKey: "urgentName" as const,
      descKey: "urgentDescription" as const,
      color: "bg-destructive/10 text-destructive",
      accent: true,
    },
    {
      icon: Users,
      nameKey: "membersName" as const,
      descKey: "membersDescription" as const,
      color: "bg-primary/10 text-primary",
    },
    {
      icon: LayoutDashboard,
      nameKey: "dashboardName" as const,
      descKey: "dashboardDescription" as const,
      color: "bg-brand-accent/10 text-brand-accent",
    },
  ];

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
            {t("features.title")}{" "}
            <span className="text-primary">{t("features.titleHighlight")}</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.nameKey}
              icon={feature.icon}
              name={t(`features.${feature.nameKey}`)}
              description={t(`features.${feature.descKey}`)}
              color={feature.color}
              accent={feature.accent}
            />
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

function HowItWorks({ t }: SectionProps) {
  const steps = [
    { number: "1", titleKey: "step1Title" as const, descKey: "step1Description" as const },
    { number: "2", titleKey: "step2Title" as const, descKey: "step2Description" as const },
    { number: "3", titleKey: "step3Title" as const, descKey: "step3Description" as const },
  ];

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
            {t("howItWorks.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
          <div
            className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-border"
            aria-hidden="true"
          />

          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={t(`howItWorks.${step.titleKey}`)}
              description={t(`howItWorks.${step.descKey}`)}
            />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button asChild size="lg" className="text-base px-8 h-12">
            <Link href="/signup">{t("howItWorks.cta")}</Link>
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

function SocialProof({ t }: SectionProps) {
  const testimonials = [
    {
      quoteKey: "quote1" as const,
      nameKey: "name1" as const,
      locationKey: "location1" as const,
      age: 29,
      initials: "L",
      avatarColor: "bg-primary/20 text-primary",
    },
    {
      quoteKey: "quote2" as const,
      nameKey: "name2" as const,
      locationKey: "location2" as const,
      age: 26,
      initials: "M",
      avatarColor: "bg-success/20 text-success",
    },
    {
      quoteKey: "quote3" as const,
      nameKey: "name3" as const,
      locationKey: "location3" as const,
      age: 37,
      initials: "J",
      avatarColor: "bg-brand-accent/20 text-brand-accent",
    },
  ];

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
            {t("socialProof.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            {t("socialProof.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <TestimonialCard
              key={item.nameKey}
              quote={t(`socialProof.${item.quoteKey}`)}
              name={t(`socialProof.${item.nameKey}`)}
              age={item.age}
              location={t(`socialProof.${item.locationKey}`)}
              initials={item.initials}
              avatarColor={item.avatarColor}
            />
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

function Pricing({ t }: SectionProps) {
  const freeFeatures = [
    t("pricing.freeFeature1"),
    t("pricing.freeFeature2"),
    t("pricing.freeFeature3"),
    t("pricing.freeFeature4"),
    t("pricing.freeFeature5"),
    t("pricing.freeFeature6"),
  ];

  const plusFeatures = [
    t("pricing.plusFeature1"),
    t("pricing.plusFeature2"),
    t("pricing.plusFeature3"),
    t("pricing.plusFeature4"),
    t("pricing.plusFeature5"),
    t("pricing.plusFeature6"),
  ];

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
            {t("pricing.title")}{" "}
            <span className="text-primary">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            {t("pricing.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free plan */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {t("pricing.freeName")}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{t("pricing.freePrice")}</span>
                <span className="text-muted-foreground text-sm">{t("pricing.freeInterval")}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t("pricing.freeDescription")}
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {freeFeatures.map((f) => (
                <PricingFeature key={f} text={f} />
              ))}
            </ul>

            <Button asChild variant="outline" size="lg" className="w-full h-11">
              <Link href="/signup">{t("pricing.freeCta")}</Link>
            </Button>
          </div>

          {/* Plus plan */}
          <div className="bg-primary rounded-xl p-8 shadow-lg flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="text-xs font-semibold bg-primary-foreground/20 text-primary-foreground px-2.5 py-1 rounded-full">
                {t("pricing.plusRecommended")}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wide mb-2">
                {t("pricing.plusName")}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary-foreground">
                  {t("pricing.plusPrice")}
                </span>
                <span className="text-primary-foreground/70 text-sm">
                  {t("pricing.plusInterval")}
                </span>
              </div>
              <p className="text-primary-foreground/70 text-sm mt-1">
                {t("pricing.plusDescription")}
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {plusFeatures.map((f) => (
                <PricingFeature key={f} text={f} inverted />
              ))}
            </ul>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="w-full h-11 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
            >
              <Link href="/signup">{t("pricing.plusCta")}</Link>
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t("pricing.noCreditCard")}
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

function FinalCta({ t }: SectionProps) {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="py-20 md:py-28 relative overflow-hidden"
    >
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
          {t("finalCta.title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {t("finalCta.subtitle")}
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="text-base px-10 h-12">
            <Link href="/signup">{t("finalCta.cta")}</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("finalCta.disclaimer")}
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function Footer({ t }: SectionProps) {
  const footerLinks = {
    [t("footer.product")]: [
      { label: t("footer.features"), href: "#features" },
      { label: t("footer.howItWorks"), href: "#how-it-works" },
      { label: t("footer.pricing"), href: "#pricing" },
    ],
    [t("footer.company")]: [
      { label: t("footer.blog"), href: "/blog" },
      { label: t("footer.about"), href: "/about" },
      { label: t("footer.contact"), href: "/contact" },
    ],
    [t("footer.legal")]: [
      { label: t("footer.privacy"), href: "/privacy" },
      { label: t("footer.terms"), href: "/terms" },
    ],
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-xl font-bold text-primary tracking-tight"
            >
              MyHouz
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t("footer.tagline")}
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
            &copy; {t("footer.copyright")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("footer.madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}
