import Link from "next/link";

export default function UrgentPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Problemas Urgentes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Problemas criticos que precisam de atencao imediata
          </p>
        </div>
        <Link
          href="/app/urgent/new"
          className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground"
        >
          Reportar
        </Link>
      </div>
      <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Nenhum problema urgente. Tudo tranquilo!
      </div>
    </div>
  );
}
