import Link from "next/link";

export default function ItemsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Items to Buy</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Things to buy, repair, or fix
          </p>
        </div>
        <Link
          href="/items/new"
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Add Item
        </Link>
      </div>
      {/* ItemsFilterBar + ItemsList will go here */}
      <div className="mt-6 rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Items list placeholder
      </div>
    </div>
  );
}
