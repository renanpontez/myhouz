import { Skeleton } from "@home/ui";

export default function ItemDetailLoading() {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-32" />
      <Skeleton className="mt-6 h-64 rounded-lg" />
    </div>
  );
}
