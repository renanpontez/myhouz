import Link from "next/link";

export default function MembersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Membros</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quem mora na sua casa
          </p>
        </div>
        <Link
          href="/members/invite"
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Convidar
        </Link>
      </div>
      <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Lista de membros em breve
      </div>
    </div>
  );
}
