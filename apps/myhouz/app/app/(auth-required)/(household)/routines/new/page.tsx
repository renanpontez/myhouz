import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { TaskForm } from "@/components/routines/TaskForm";

export default async function NewTaskPage() {
  const t = await getTranslations("routines");
  const tNav = await getTranslations("nav");

  return (
    <div className="px-4 py-6 sm:p-6">
      <Breadcrumb items={[
        { label: tNav("dashboard"), href: "/app/dashboard" },
        { label: t("title"), href: "/app/routines" },
        { label: t("newTitle") },
      ]} />
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
