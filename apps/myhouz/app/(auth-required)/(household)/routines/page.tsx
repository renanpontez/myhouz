import Link from "next/link";

export default function RoutinesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Routines</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recurring checklists for your household
          </p>
        </div>
        <Link
          href="/routines/new"
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          New Checklist
        </Link>
      </div>
      <div className="mt-6 rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Checklists list placeholder
      </div>
    </div>
  );
}
