export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your household at a glance
      </p>
      {/* UrgentProblemsBanner, DashboardGrid with summary cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Items to Buy</p>
          <p className="mt-1 text-2xl font-bold">-</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Routines Today</p>
          <p className="mt-1 text-2xl font-bold">-</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Upcoming Reminders</p>
          <p className="mt-1 text-2xl font-bold">-</p>
        </div>
      </div>
    </div>
  );
}
