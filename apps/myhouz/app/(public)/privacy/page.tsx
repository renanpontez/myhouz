import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Privacy Policy | myhouz",
  description: "myhouz Privacy Policy — how we collect, use, and protect your data.",
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

        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("privacyTitle")}</h1>
        <p className="text-sm text-muted-foreground mb-12">
          {t("effectiveDate", { date: "March 5, 2026" })}
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t("p1Title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("p1Body")}</p>
          </section>

          {/* 2. Data We Collect */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t("p2Title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("p2Intro")}</p>

            <h3 className="text-base font-medium mb-2">{t("p2aTitle")}</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("p2a1")}</li>
              <li>{t("p2a2")}</li>
              <li>{t("p2a3")}</li>
            </ul>

            <h3 className="text-base font-medium mt-4 mb-2">{t("p2bTitle")}</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("p2b1")}</li>
              <li>{t("p2b2")}</li>
              <li>{t("p2b3")}</li>
              <li>{t("p2b4")}</li>
            </ul>

            <h3 className="text-base font-medium mt-4 mb-2">{t("p2cTitle")}</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("p2c1")}</li>
              <li>{t("p2c2")}</li>
            </ul>
          </section>

          {/* 3. How We Use Your Data */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t("p3Title")}</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("p3a")}</li>
              <li>{t("p3b")}</li>
              <li>{t("p3c")}</li>
              <li>{t("p3d")}</li>
              <li>{t("p3e")}</li>
            </ul>
          </section>

          {/* 4. Data Sharing */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t("p4Title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("p4Intro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("p4a")}</li>
              <li>{t("p4b")}</li>
              <li>{t("p4c")}</li>
            </ul>
          </section>

          {/* 5. Data Retention */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t("p5Title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("p5Body")}</p>
          </section>

          {/* 6. Your Rights */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t("p6Title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("p6Intro")}</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{t("p6a")}</li>
              <li>{t("p6b")}</li>
              <li>{t("p6c")}</li>
              <li>{t("p6d")}</li>
              <li>{t("p6e")}</li>
            </ul>
          </section>

          {/* 7. Security */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t("p7Title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("p7Body")}</p>
          </section>

          {/* 8. Children */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t("p8Title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("p8Body")}</p>
          </section>

          {/* 9. LGPD */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t("p9Title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("p9Body")}</p>
          </section>

          {/* 10. Changes */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t("p10Title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("p10Body")}</p>
          </section>

          {/* 11. Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t("p11Title")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("p11Body")}{" "}
              <a href="mailto:hello@myhouz.app" className="text-primary hover:underline">
                hello@myhouz.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
