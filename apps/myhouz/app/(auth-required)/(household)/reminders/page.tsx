import Link from "next/link";

export default function RemindersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lembretes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Nunca esqueca tarefas importantes
          </p>
        </div>
        <Link
          href="/reminders/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Novo lembrete
        </Link>
      </div>
      <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Nenhum lembrete ainda. Crie o primeiro!
      </div>
    </div>
  );
}
