import { getTranslations } from "next-intl/server";

interface ReminderDetailPageProps {
  params: Promise<{ reminderId: string }>;
}

export default async function ReminderDetailPage({
  params,
}: ReminderDetailPageProps) {
  const { reminderId } = await params;
  const t = await getTranslations("reminders");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("detailTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Reminder ID: {reminderId}
      </p>
      <div className="mt-6 rounded-2xl border p-8 text-center text-sm text-muted-foreground">
        {t("detailPlaceholder")}
      </div>
    </div>
  );
}
