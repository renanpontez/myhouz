import { getTranslations } from "next-intl/server";

interface ProblemDetailPageProps {
  params: Promise<{ problemId: string }>;
}

export default async function ProblemDetailPage({
  params,
}: ProblemDetailPageProps) {
  const { problemId } = await params;
  const t = await getTranslations("urgent");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("detailTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Problem ID: {problemId}
      </p>
      <div className="mt-6 rounded-2xl border p-8 text-center text-sm text-muted-foreground">
        {t("detailPlaceholder")}
      </div>
    </div>
  );
}
