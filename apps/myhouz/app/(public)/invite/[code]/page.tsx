interface InvitePageProps {
  params: Promise<{ code: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">You have been invited</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Invite code: {code}
          </p>
        </div>
        {/* Invite acceptance flow will go here */}
        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          Invite acceptance placeholder
        </div>
      </div>
    </div>
  );
}
