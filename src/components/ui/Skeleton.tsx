import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700', className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
      <Skeleton className="h-32 w-full mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-3" />
      <Skeleton className="h-6 w-1/3 mb-1" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

export function StoreSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
