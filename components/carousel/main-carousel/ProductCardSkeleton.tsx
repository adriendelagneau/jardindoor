import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-sm ring-1 ring-black/5">
      {/* Image Skeleton */}
      <Skeleton className="aspect-3/4 w-full rounded-2xl" />

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
        {/* Name Skeleton */}
        <Skeleton className="h-7 w-3/4 rounded-lg" />

        {/* Description Skeleton */}
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>

        {/* Price Skeleton */}
        <div className="mt-4 flex flex-col space-y-1">
          <Skeleton className="h-3 w-12 rounded-sm" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>

        {/* Button Skeleton */}
        <Skeleton className="mt-8 h-[50px] w-full rounded-full" />
      </div>
    </div>
  );
}
