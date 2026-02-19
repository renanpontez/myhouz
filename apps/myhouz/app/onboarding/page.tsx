import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome to MyHouz</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new household or join an existing one
        </p>
      </div>
      <div className="space-y-3">
        <Link
          href="/onboarding/create"
          className="block rounded-lg border p-4 text-center hover:bg-accent"
        >
          <span className="font-medium">Create a household</span>
          <p className="mt-1 text-sm text-muted-foreground">
            Start fresh with a new household
          </p>
        </Link>
        <div className="rounded-lg border p-4 text-center text-muted-foreground">
          <span className="font-medium">Join with invite link</span>
          <p className="mt-1 text-sm">
            Ask your household owner for an invite link
          </p>
        </div>
      </div>
    </div>
  );
}
