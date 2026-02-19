import Link from "next/link";

export default function RoutinesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rotinas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Checklists recorrentes da sua casa
          </p>
        </div>
        <Link
          href="/app/routines/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Nova rotina
        </Link>
      </div>
      <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Nenhuma rotina ainda. Crie a primeira!
      </div>
    </div>
  );
}
