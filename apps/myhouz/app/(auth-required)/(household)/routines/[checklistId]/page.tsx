interface ChecklistDetailPageProps {
  params: Promise<{ checklistId: string }>;
}

export default async function ChecklistDetailPage({
  params,
}: ChecklistDetailPageProps) {
  const { checklistId } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Checklist Detail</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Checklist ID: {checklistId}
      </p>
      <div className="mt-6 rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Checklist detail + items placeholder
      </div>
    </div>
  );
}
