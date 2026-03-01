import { getTranslations } from "next-intl/server";
import { BackLink } from "@/components/shared/BackLink";
import { TaskForm } from "@/components/routines/TaskForm";

export default async function NewTaskPage() {
  const t = await getTranslations("routines");

  return (
    <div className="px-4 py-6 sm:p-6">
      <BackLink href="/app/routines" />
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{t("newTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("newSubtitle")}
        </p>
      </div>
      <div className="mt-6 max-w-md">
        <TaskForm mode="create" />
      </div>
    </div>
  );
}
