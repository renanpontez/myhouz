import Link from "next/link";
import { Card, CardContent } from "@home/ui";
import {
  ShoppingCart,
  ListChecks,
  Bell,
  AlertTriangle,
  Users,
} from "lucide-react";

const SECTIONS = [
  {
    href: "/app/items",
    label: "Itens",
    description: "Comprar, consertar e reparar",
    icon: ShoppingCart,
  },
  {
    href: "/app/routines",
    label: "Rotinas",
    description: "Checklists recorrentes",
    icon: ListChecks,
  },
  {
    href: "/app/reminders",
    label: "Lembretes",
    description: "Tarefas e prazos",
    icon: Bell,
  },
  {
    href: "/app/urgent",
    label: "Urgente",
    description: "Problemas criticos",
    icon: AlertTriangle,
    variant: "destructive" as const,
  },
  {
    href: "/app/members",
    label: "Membros",
    description: "Quem mora aqui",
    icon: Users,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sua casa em um so lugar
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
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
