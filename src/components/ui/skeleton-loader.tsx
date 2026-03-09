import { cn } from "@/lib/utils";

// Base skeleton
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-muted", className)} />
);

// Skeleton card
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("space-y-3 rounded-2xl border border-border bg-card p-6", className)}>
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="space-y-2 pt-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  </div>
);

// Event card skeleton
export const SkeletonEventCard = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="space-y-1.5 pt-1">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
      <Skeleton className="h-10 w-full mt-3" />
    </div>
  </div>
);

// Job card skeleton
export const SkeletonJobCard = () => (
  <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <Skeleton className="h-12 w-full" />
    <div className="flex gap-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-20" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-5 w-14 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-12 rounded-full" />
    </div>
    <Skeleton className="h-9 w-full" />
  </div>
);

// Course card skeleton
export const SkeletonCourseCard = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card">
    <Skeleton className="h-40 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

// Blog card skeleton
export const SkeletonBlogCard = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

// Grid of skeletons
export const SkeletonGrid = ({
  count = 6,
  component: Component = SkeletonCard,
  className,
}: {
  count?: number;
  component?: React.ComponentType;
  className?: string;
}) => (
  <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <Component key={i} />
    ))}
  </div>
);

// List skeleton
export const SkeletonList = ({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Text lines skeleton
export const SkeletonText = ({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full")}
      />
    ))}
  </div>
);

// Profile skeleton
export const SkeletonProfile = () => (
  <div className="flex items-center gap-4">
    <Skeleton className="h-16 w-16 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

// Table skeleton
export const SkeletonTable = ({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) => (
  <div className="space-y-3">
    <div className="flex gap-4 border-b border-border pb-3">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="flex gap-4 py-2">
        {Array.from({ length: cols }).map((_, colIdx) => (
          <Skeleton key={colIdx} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);
