export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your profile and preferences
      </p>
      <div className="mt-6 space-y-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Profile settings placeholder
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Theme settings placeholder
          </p>
        </div>
      </div>
    </div>
  );
}
