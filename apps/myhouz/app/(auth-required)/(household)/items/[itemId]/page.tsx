interface ItemDetailPageProps {
  params: Promise<{ itemId: string }>;
}

export default async function ItemDetailPage({
  params,
}: ItemDetailPageProps) {
  const { itemId } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Item Detail</h1>
      <p className="mt-1 text-sm text-muted-foreground">Item ID: {itemId}</p>
      {/* Item detail + edit form will go here */}
      <div className="mt-6 rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Item detail placeholder
      </div>
    </div>
  );
}
