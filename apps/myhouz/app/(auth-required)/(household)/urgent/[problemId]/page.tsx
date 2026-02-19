interface ProblemDetailPageProps {
  params: Promise<{ problemId: string }>;
}

export default async function ProblemDetailPage({
  params,
}: ProblemDetailPageProps) {
  const { problemId } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Problem Detail</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Problem ID: {problemId}
      </p>
      <div className="mt-6 rounded-2xl border p-8 text-center text-sm text-muted-foreground">
        Problem detail + resolve section placeholder
      </div>
    </div>
  );
}
