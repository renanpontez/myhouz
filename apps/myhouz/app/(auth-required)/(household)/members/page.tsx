import Link from "next/link";

export default function MembersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            People in your household
          </p>
        </div>
        <Link
          href="/members/invite"
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Invite Member
        </Link>
      </div>
      <div className="mt-6 rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Members list placeholder
      </div>
    </div>
  );
}
