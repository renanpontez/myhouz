import Link from "next/link";

export default function UrgentPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Urgent Problems</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Critical issues that need immediate attention
          </p>
        </div>
        <Link
          href="/urgent/new"
          className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground"
        >
          Report Problem
        </Link>
      </div>
      <div className="mt-6 rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Urgent problems list placeholder
      </div>
    </div>
  );
}
