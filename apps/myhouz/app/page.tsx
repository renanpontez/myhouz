import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
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
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { ParallaxBackground } from "@/components/landing/ParallaxBackground";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { LocaleSwitcher } from "@/components/landing/LocaleSwitcher";

const APP_STORE_URL = "https://apps.apple.com/br/app/myhouz/id6760033780";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "myhouz — Your Home, Finally Organized",
  description:
    "myhouz gives everyone under your roof one app to track tasks, manage household needs, and handle what matters. Download free on iOS.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://myhouz.app/" },
  openGraph: {
    type: "website",
    url: "https://myhouz.app/",
    title: "myhouz — Your Home, Finally Organized",
    description:
      "One app for tasks, items to buy, routines, reminders, and urgent problems. Built for everyone under your roof.",
    siteName: "myhouz",
  },
  twitter: {
    card: "summary_large_image",
    title: "myhouz — Your Home, Finally Organized",
    description:
      "One app for tasks, items to buy, routines, reminders, and urgent problems. Built for everyone under your roof.",
  },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function LandingPage() {
  const t = await getTranslations("landing");

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden">
      <ParallaxBackground />
      <Nav t={t} />
      <main className="relative z-[1]">
        <Hero t={t} />
        <Features t={t} />
        <SocialProof t={t} />
        <AppShowcase t={t} />
        <HowItWorks t={t} />
        <Pricing t={t} />
        <Team t={t} />
        <Faq t={t} />
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
// Shared
// ---------------------------------------------------------------------------

function SectionBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border/60 bg-white/60 dark:bg-card/60 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
      {text}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

function Nav({ t }: SectionProps) {
  return (
    <header className="sticky top-0 z-20 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-lg shadow-sm shadow-black/5 border border-black/[0.04] dark:border-white/10 px-4 sm:px-6">
        <div className="relative flex items-center justify-between h-14">
          <Link href="/" className="flex items-center" aria-label="myhouz home">
            <Image
              src="/myhouz-fulllogo.svg"
              alt="myhouz"
              width={759}
              height={289}
              className="h-6 w-auto"
              priority
            />
          </Link>

          <nav
            className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2"
            aria-label="Main navigation"
          >
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
            <Link
              href="#faq"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.faq")}
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3"
            >
              {t("nav.login")}
            </Link>
            <Button
              asChild
              size="sm"
              className="rounded-full px-5 font-medium"
            >
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                {t("nav.downloadApp")}
              </a>
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
      className="relative pt-16 pb-24 md:pt-20 md:pb-32 overflow-x-clip"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered text */}
        <div className="text-center max-w-3xl mx-auto">
          <h1
            id="hero-heading"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground"
          >
            {t("hero.titleStart")}{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t("hero.titleHighlight")}
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {t("hero.subtitle")}
          </p>

          {/* App Store badges */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-foreground text-background px-5 py-3 rounded-xl hover:bg-foreground/90 transition-colors"
            >
              <AppleIcon />
              <div className="text-left">
                <p className="text-[10px] leading-none opacity-80">{t("hero.appStoreLabel")}</p>
                <p className="text-sm font-semibold leading-tight">App Store</p>
              </div>
            </a>
            <div
              className="inline-flex items-center gap-2.5 bg-muted/60 text-muted-foreground px-5 py-3 rounded-xl cursor-default opacity-50"
              title={t("hero.playStoreLabel")}
            >
              <PlayStoreIcon />
              <div className="text-left">
                <p className="text-[10px] leading-none opacity-80">{t("hero.playStoreLabel")}</p>
                <p className="text-sm font-semibold leading-tight">Google Play</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phone mockups cluster */}
        <div className="relative mt-14 sm:mt-16">
          {/* Decorative orbital rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full border border-border/30" />
            <div className="absolute w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] rounded-full border border-border/20" />
          </div>

          {/* Floating feature cards */}
          <HeroFloatingCards t={t} />

          {/* 3-phone fan arrangement */}
          <div className="relative z-10 flex items-end justify-center">
            {/* Left phone */}
            <div className="hidden md:block -rotate-12 translate-y-6 -mr-10 opacity-90">
              <PhoneMockup screen="items" className="w-[220px] sm:w-[240px]" />
            </div>

            {/* Center phone (hero) */}
            <div className="relative z-20">
              <PhoneMockup screen="dashboard" />
            </div>

            {/* Right phone */}
            <div className="hidden md:block rotate-12 translate-y-6 -ml-10 opacity-90">
              <PhoneMockup screen="items" className="w-[220px] sm:w-[240px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroFloatingCards({ t }: SectionProps) {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none hidden lg:block" aria-hidden="true">
      {/* Top-left card */}
      <div className="absolute top-8 left-[5%] bg-white dark:bg-card rounded-xl shadow-lg px-4 py-3 border border-border/40 max-w-[180px]">
        <p className="text-[10px] font-semibold text-foreground">{t("mockup.urgentBanner")}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-[9px] text-destructive font-medium">Active</span>
        </div>
      </div>

      {/* Top-right card */}
      <div className="absolute top-12 right-[5%] bg-white dark:bg-card rounded-xl shadow-lg px-4 py-3 border border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center">
            <Check size={12} className="text-success" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-foreground">{t("mockup.routine1")}</p>
            <p className="text-[9px] text-muted-foreground">4/6</p>
          </div>
        </div>
      </div>

      {/* Bottom-left card */}
      <div className="absolute bottom-32 left-[2%] bg-white dark:bg-card rounded-xl shadow-lg px-4 py-3 border border-border/40">
        <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1">{t("mockup.itemsToBuy")}</p>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-3 rounded-full bg-destructive" />
          <span className="text-[10px] text-foreground font-medium">{t("mockup.item1")}</span>
        </div>
      </div>

      {/* Bottom-right card */}
      <div className="absolute bottom-28 right-[3%] bg-white dark:bg-card rounded-xl shadow-lg px-4 py-3 border border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-primary/20 border border-white text-[7px] font-bold text-primary flex items-center justify-center">R</div>
            <div className="w-5 h-5 rounded-full bg-success/20 border border-white text-[7px] font-bold text-success flex items-center justify-center">A</div>
          </div>
          <span className="text-[10px] text-foreground font-medium">{t("mockup.memberCount")}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

function Features({ t }: SectionProps) {
  const featureCards = [
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
      className="py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-12">
          <SectionBadge text={t("features.badge")} />
          <h2
            id="features-heading"
            className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            {t("features.title")}{" "}
            <span className="text-primary">{t("features.titleHighlight")}</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
            {t("features.subtitle")}
          </p>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feature, index) => (
            <RevealOnScroll key={feature.nameKey} staggerIndex={index}>
              <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm transition-colors hover:bg-white/80 dark:hover:bg-card/80 h-full">
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center mb-4 ${feature.color}`}
                >
                  <feature.icon size={22} />
                </div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  {t(`features.${feature.nameKey}`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`features.${feature.descKey}`)}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// App Showcase
// ---------------------------------------------------------------------------

function AppShowcase({ t }: SectionProps) {
  return (
    <section
      id="app-showcase"
      aria-labelledby="app-showcase-heading"
      className="py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Row 1: Phone left, text right */}
        <RevealOnScroll>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="flex justify-center lg:justify-start">
              <PhoneMockup screen="dashboard" />
            </div>
            <div>
              <SectionBadge text={t("appShowcase.badge1")} />
              <h3
                id="app-showcase-heading"
                className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-foreground"
              >
                {t("appShowcase.title1")}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {t("appShowcase.description1")}
              </p>
              <ul className="mt-5 space-y-3">
                <ShowcaseBullet text={t("appShowcase.bullet1a")} />
                <ShowcaseBullet text={t("appShowcase.bullet1b")} />
                <ShowcaseBullet text={t("appShowcase.bullet1c")} />
              </ul>
            </div>
          </div>
        </RevealOnScroll>

        {/* Row 2: Text left, phone right */}
        <RevealOnScroll>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <SectionBadge text={t("appShowcase.badge2")} />
              <h3 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {t("appShowcase.title2")}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {t("appShowcase.description2")}
              </p>
              <ul className="mt-5 space-y-3">
                <ShowcaseBullet text={t("appShowcase.bullet2a")} />
                <ShowcaseBullet text={t("appShowcase.bullet2b")} />
                <ShowcaseBullet text={t("appShowcase.bullet2c")} />
              </ul>
            </div>
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <PhoneMockup screen="items" />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function ShowcaseBullet({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check size={16} className="mt-0.5 flex-shrink-0 text-primary" />
      <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
    </li>
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
      className="py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-14">
          <SectionBadge text={t("howItWorks.badge")} />
          <h2
            id="how-it-works-heading"
            className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            {t("howItWorks.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            {t("howItWorks.subtitle")}
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
          <div
            className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-border"
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <RevealOnScroll key={step.number} staggerIndex={index}>
              <div className="flex flex-col items-center text-center">
                <div className="relative z-10 w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-md mb-6">
                  <span className="text-3xl font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(`howItWorks.${step.titleKey}`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {t(`howItWorks.${step.descKey}`)}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="mt-14 text-center">
          <Button asChild size="lg" className="text-base px-8 h-12 rounded-full">
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              {t("howItWorks.cta")}
            </a>
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Social Proof
// ---------------------------------------------------------------------------

function SocialProof({ t }: SectionProps) {
  const personas = [
    {
      key: "persona1",
      emoji: "🏠",
      accentColor: "text-primary",
      borderGradient: "from-primary/30 via-primary/10 to-transparent",
    },
    {
      key: "persona2",
      emoji: "🤝",
      accentColor: "text-success",
      borderGradient: "from-success/30 via-success/10 to-transparent",
    },
    {
      key: "persona3",
      emoji: "👨‍👩‍👧",
      accentColor: "text-brand-accent",
      borderGradient: "from-brand-accent/30 via-brand-accent/10 to-transparent",
    },
  ];

  return (
    <section
      aria-labelledby="social-proof-heading"
      className="py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-14">
          <SectionBadge text={t("socialProof.badge")} />
          <h2
            id="social-proof-heading"
            className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            {t("socialProof.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            {t("socialProof.subtitle")}
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-6">
          {personas.map((persona, index) => (
            <RevealOnScroll key={persona.key} staggerIndex={index}>
              <div className="relative bg-white dark:bg-card rounded-2xl shadow-sm overflow-hidden h-full">
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${persona.borderGradient}`}
                  aria-hidden="true"
                />
                <div className="p-6 pt-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full bg-secondary/80 flex items-center justify-center text-xl flex-shrink-0">
                      {persona.emoji}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground leading-snug">
                        {t(`socialProof.${persona.key}Name`)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(`socialProof.${persona.key}Tagline`)}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check
                          size={16}
                          className={`mt-0.5 flex-shrink-0 ${persona.accentColor}`}
                        />
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {t(`socialProof.${persona.key}Bullet${i}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
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
      className="py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-14">
          <SectionBadge text={t("pricing.badge")} />
          <h2
            id="pricing-heading"
            className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            {t("pricing.title")}{" "}
            <span className="text-primary">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            {t("pricing.subtitle")}
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free plan */}
          <RevealOnScroll>
            <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm flex flex-col h-full">
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
              <Button asChild variant="outline" size="lg" className="w-full h-11 rounded-full">
                <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                  {t("pricing.freeCta")}
                </a>
              </Button>
            </div>
          </RevealOnScroll>

          {/* Plus plan */}
          <RevealOnScroll staggerIndex={1}>
            <div className="bg-primary rounded-2xl p-8 shadow-lg flex flex-col relative overflow-hidden h-full">
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
                className="w-full h-11 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
              >
                <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                  {t("pricing.plusCta")}
                </a>
              </Button>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {t("pricing.noCreditCard")}
          </p>
        </RevealOnScroll>
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
// Team
// ---------------------------------------------------------------------------

function Team({ t }: SectionProps) {
  const members = [
    {
      nameKey: "renan" as const,
      initials: "RM",
      avatarColor: "bg-primary/20 text-primary",
    },
    {
      nameKey: "andressa" as const,
      initials: "AH",
      avatarColor: "bg-brand-accent/20 text-brand-accent",
    },
  ];

  return (
    <section
      aria-labelledby="team-heading"
      className="py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-14">
          <SectionBadge text={t("team.badge")} />
          <h2
            id="team-heading"
            className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            {t("team.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("team.subtitle")}
          </p>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {members.map((member, index) => (
            <RevealOnScroll key={member.nameKey} staggerIndex={index}>
              <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 ${member.avatarColor}`}
                    aria-hidden="true"
                  >
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground leading-snug">
                      {t(`team.${member.nameKey}.name`)}
                    </p>
                    <span className="inline-block mt-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {t(`team.${member.nameKey}.role`)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`team.${member.nameKey}.bio`)}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

function Faq({ t }: SectionProps) {
  const faqItems = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
  ];

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-16 md:py-24"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-10">
          <SectionBadge text={t("faq.badge")} />
          <h2
            id="faq-heading"
            className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            {t("faq.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            {t("faq.subtitle")}
          </p>
        </RevealOnScroll>

        <RevealOnScroll>
          <FaqAccordion items={faqItems} />
        </RevealOnScroll>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Final CTA
// ---------------------------------------------------------------------------

function FinalCta({ t }: SectionProps) {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="py-16 md:py-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="bg-foreground text-background rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <h2
              id="final-cta-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight"
            >
              {t("finalCta.title")}
            </h2>
            <p className="mt-4 text-lg opacity-80 leading-relaxed max-w-xl mx-auto">
              {t("finalCta.subtitle")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-background text-foreground px-5 py-3 rounded-xl hover:bg-background/90 transition-colors"
              >
                <AppleIcon />
                <div className="text-left">
                  <p className="text-[10px] leading-none opacity-60">Download on the</p>
                  <p className="text-sm font-semibold leading-tight">App Store</p>
                </div>
              </a>
            </div>
            <div className="mt-4">
              <Link
                href="/signup"
                className="text-sm opacity-60 hover:opacity-100 underline underline-offset-4 transition-opacity"
              >
                {t("finalCta.webNote")}
              </Link>
            </div>
            <p className="mt-4 text-sm opacity-50">
              {t("finalCta.disclaimer")}
            </p>
          </div>
        </RevealOnScroll>
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
    [t("footer.download")]: [
      { label: t("footer.appStore"), href: APP_STORE_URL, external: true },
      { label: t("footer.playStore"), href: "#", disabled: true },
      { label: t("footer.webApp"), href: "/signup" },
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
    <footer className="bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center" aria-label="myhouz home">
              <Image
                src="/myhouz-fulllogo.svg"
                alt="myhouz"
                width={759}
                height={289}
                className="h-7 w-auto"
              />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://twitter.com/myhouz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="myhouz on X (Twitter)"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://instagram.com/myhouz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="myhouz on Instagram"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : "disabled" in link && link.disabled ? (
                      <span className="text-sm text-muted-foreground/50 cursor-default">
                        {link.label}
                      </span>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
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

// ---------------------------------------------------------------------------
// SVG Icons for App Store Badges
// ---------------------------------------------------------------------------

function AppleIcon() {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="currentColor">
      <path d="M16.52 12.46c-.03-2.82 2.3-4.17 2.41-4.24-1.31-1.92-3.36-2.18-4.09-2.21-1.74-.18-3.4 1.03-4.28 1.03-.88 0-2.25-1-3.7-.98-1.9.03-3.66 1.11-4.64 2.82-1.98 3.44-.51 8.54 1.42 11.33.94 1.37 2.07 2.9 3.54 2.85 1.42-.06 1.96-.92 3.68-.92 1.72 0 2.21.92 3.72.89 1.53-.03 2.5-1.39 3.43-2.76 1.08-1.59 1.53-3.13 1.55-3.21-.03-.01-2.98-1.15-3.01-4.56l-.03-.04zM13.68 3.82C14.49 2.83 15.04 1.48 14.9 0c-1.16.05-2.56.77-3.39 1.75-.74.86-1.39 2.24-1.22 3.56 1.29.1 2.61-.66 3.39-1.49z" />
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor">
      <path d="M1.22.46C.94.76.78 1.2.78 1.78v18.44c0 .58.16 1.02.44 1.32l.07.07L11.4 11.5v-.25L1.29.39l-.07.07z" />
      <path d="M14.77 14.87l-3.37-3.37v-.25l3.37-3.37.08.04 3.99 2.27c1.14.65 1.14 1.71 0 2.36l-3.99 2.27-.08.05z" />
      <path d="M14.85 14.82L11.4 11.37 1.22 21.54c.38.4.99.45 1.69.06l11.94-6.78" />
      <path d="M14.85 7.93L2.91.39C2.21 0 1.6.05 1.22.46l10.18 10.17 3.45-3.45-.07-.07.07-.08z" />
    </svg>
  );
}
