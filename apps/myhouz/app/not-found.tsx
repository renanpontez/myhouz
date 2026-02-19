import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">{t("pageNotFound")}</p>
      <Link
        href="/app/dashboard"
        className="mt-4 text-sm text-primary underline-offset-4 hover:underline"
      >
        {t("goToDashboard")}
      </Link>
    </div>
  );
}
