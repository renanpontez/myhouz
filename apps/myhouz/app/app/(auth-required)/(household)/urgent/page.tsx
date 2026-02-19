import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function UrgentPage() {
  const t = await getTranslations("urgent");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <Link
          href="/app/urgent/new"
          className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground"
        >
          {t("addButton")}
        </Link>
      </div>
      <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        {t("empty")}
      </div>
    </div>
  );
}
