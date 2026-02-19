export default function HouseholdSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Household Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your household (owner only)
      </p>
      <div className="mt-6 space-y-6">
        <div className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Household Info</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit household name placeholder
          </p>
        </div>
        <div className="rounded-2xl border border-destructive p-6">
          <h2 className="text-lg font-semibold text-destructive">
            Danger Zone
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Transfer ownership / delete household placeholder
          </p>
        </div>
      </div>
    </div>
  );
}
