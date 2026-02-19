import Link from "next/link";

export default function RemindersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reminders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Never forget important household tasks
          </p>
        </div>
        <Link
          href="/reminders/new"
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          New Reminder
        </Link>
      </div>
      <div className="mt-6 rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Reminders list placeholder
      </div>
    </div>
  );
}
