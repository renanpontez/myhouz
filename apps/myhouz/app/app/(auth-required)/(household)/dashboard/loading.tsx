import { Skeleton } from "@home/ui";

export default function DashboardLoading() {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-64" />

      {/* Calendar skeleton */}
      <div className="mt-6">
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    </div>
  );
}
