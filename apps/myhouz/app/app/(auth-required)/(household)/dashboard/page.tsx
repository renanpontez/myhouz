import Link from "next/link";
import { Card, CardContent } from "@home/ui";
import {
  ShoppingCart,
  ListChecks,
  Bell,
  AlertTriangle,
  Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  const sections = [
    {
      href: "/app/items",
      label: t("itemsLabel"),
      description: t("itemsDescription"),
      icon: ShoppingCart,
    },
    {
      href: "/app/routines",
      label: t("routinesLabel"),
      description: t("routinesDescription"),
      icon: ListChecks,
    },
    {
      href: "/app/reminders",
      label: t("remindersLabel"),
      description: t("remindersDescription"),
      icon: Bell,
    },
    {
      href: "/app/urgent",
      label: t("urgentLabel"),
      description: t("urgentDescription"),
      icon: AlertTriangle,
      variant: "destructive" as const,
    },
    {
      href: "/app/members",
      label: t("membersLabel"),
      description: t("membersDescription"),
      icon: Users,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("subtitle")}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    section.variant === "destructive"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{section.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
