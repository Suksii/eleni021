import Skeleton from "@/features/shared/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-64 bg-surface-3" />
      <Skeleton className="h-96 bg-surface-3" />
    </div>
  );
}
