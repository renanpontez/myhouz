interface ReminderDetailPageProps {
  params: Promise<{ reminderId: string }>;
}

export default async function ReminderDetailPage({
  params,
}: ReminderDetailPageProps) {
  const { reminderId } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Reminder Detail</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Reminder ID: {reminderId}
      </p>
      <div className="mt-6 rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Reminder detail + edit placeholder
      </div>
    </div>
  );
}
