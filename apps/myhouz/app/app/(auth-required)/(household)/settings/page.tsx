export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Configuracoes</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Gerencie seu perfil e preferencias
      </p>
      <div className="mt-6 space-y-6">
        <div className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Perfil</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configuracoes de perfil em breve
          </p>
        </div>
        <div className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Aparencia</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configuracoes de tema em breve
          </p>
        </div>
      </div>
    </div>
  );
}
