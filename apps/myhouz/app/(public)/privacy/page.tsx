import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Privacy Policy and Terms of Use | myhouz",
  description: "myhouz Privacy Policy and Terms of Use — how we collect, use, and protect your data.",
};

export default async function PrivacyPage() {
  const t = await getTranslations("legal");

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; {t("backHome")}
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("pageTitle")}</h1>
        <p className="text-sm text-muted-foreground mb-12">
          {t("effectiveDate", { date: "March 5, 2026" })}
        </p>

        {/* ── Privacy Policy ── */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 mb-16">
          <h2 className="text-2xl font-bold tracking-tight">{t("privacyHeading")}</h2>

          <section>
            <p className="text-muted-foreground leading-relaxed">{t("privacyIntro")}</p>
          </section>

          {/* Personal Information We Collect */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("p1Title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("p1Intro")}</p>

            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("p1a")}</li>
              <li>{t("p1b")}</li>
              <li>{t("p1c")}</li>
            </ul>
          </section>

          {/* Collection Technologies */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("p2Title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("p2Intro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("p2a")}</li>
              <li>{t("p2b")}</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("p3Title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("p3Intro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("p3a")}</li>
              <li>{t("p3b")}</li>
              <li>{t("p3c")}</li>
              <li>{t("p3d")}</li>
              <li>{t("p3e")}</li>
            </ul>
          </section>

          {/* Sharing Your Information */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("p4Title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("p4Intro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("p4a")}</li>
              <li>{t("p4b")}</li>
              <li>{t("p4c")}</li>
              <li>{t("p4d")}</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("p5Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("p5Body")}</p>
          </section>

          {/* Data Retention */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("p6Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("p6Body")}</p>
          </section>

          {/* Your Rights */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("p7Title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("p7Intro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("p7a")}</li>
              <li>{t("p7b")}</li>
              <li>{t("p7c")}</li>
              <li>{t("p7d")}</li>
              <li>{t("p7e")}</li>
            </ul>
          </section>

          {/* For Brazilian Residents (LGPD) */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("p8Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("p8Body")}</p>
          </section>

          {/* Data Security */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("p9Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("p9Body")}</p>
          </section>

          {/* Children's Data */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("p10Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("p10Body")}</p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("p11Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("p11Body")}</p>
          </section>
        </div>

        {/* ── Terms of Use ── */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 mb-16">
          <h2 className="text-2xl font-bold tracking-tight">{t("termsHeading")}</h2>

          {/* Acceptance of Terms */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("t1Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("t1Body")}</p>
          </section>

          {/* Service Description */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("t2Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("t2Body")}</p>
          </section>

          {/* User Account */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("t3Title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("t3Intro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("t3a")}</li>
              <li>{t("t3b")}</li>
              <li>{t("t3c")}</li>
              <li>{t("t3d")}</li>
              <li>{t("t3e")}</li>
            </ul>
          </section>

          {/* User Content */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("t4Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("t4Body")}</p>
          </section>

          {/* Prohibited Conduct */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("t5Title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("t5Intro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("t5a")}</li>
              <li>{t("t5b")}</li>
              <li>{t("t5c")}</li>
              <li>{t("t5d")}</li>
              <li>{t("t5e")}</li>
              <li>{t("t5f")}</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("t6Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("t6Body")}</p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("t7Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("t7Body")}</p>
          </section>

          {/* Service Modifications */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("t8Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("t8Body")}</p>
          </section>

          {/* Termination */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("t9Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("t9Body")}</p>
          </section>

          {/* Governing Law */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("t10Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("t10Body")}</p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h3 className="text-xl font-semibold mb-3">{t("t11Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("t11Body")}</p>
          </section>
        </div>

        {/* ── Contact ── */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">{t("contactTitle")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("contactBody")}{" "}
            <a href="mailto:hello@myhouz.app" className="text-primary hover:underline">
              hello@myhouz.app
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
