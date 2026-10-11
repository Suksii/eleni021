import { cn } from "@/lib/utils/cn";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

// Bazni blok za sve skeletone — `animate-pulse` i boja stoje na jednom mestu,
// dimenzije/radius dolaze kroz `className`.
export default function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-surface-2 animate-pulse rounded-lg", className)}
      {...props}
    />
  );
}
