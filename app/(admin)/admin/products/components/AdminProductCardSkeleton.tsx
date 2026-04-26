import { ShoppingBag } from "lucide-react";

export function AdminProductCardSkeleton() {
  return (
    <div className="bg-card rounded-3xl border shadow-sm overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-3/4 relative bg-muted overflow-hidden rounded-t-3xl">
        <div className="absolute inset-0 p-5">
           <div className="w-full h-full bg-muted-foreground/10 rounded-2xl" />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1 w-2/3">
            <div className="h-6 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
          <div className="h-8 bg-muted rounded w-1/4" />
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed">
          <div className="h-6 bg-muted rounded w-20" />
          <div className="h-8 bg-muted rounded w-24" />
        </div>
      </div>
    </div>
  );
}
