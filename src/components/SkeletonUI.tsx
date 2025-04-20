
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
      
      <div className="border rounded-md">
        <div className="border-b bg-muted/40 p-4">
          <div className="grid grid-cols-5 gap-4">
            {Array(columns).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
        
        <div className="divide-y">
          {Array(rows).fill(0).map((_, rowIndex) => (
            <div key={rowIndex} className="p-4">
              <div className="grid grid-cols-5 gap-4">
                {Array(columns).fill(0).map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-5 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border rounded-md p-4 space-y-4">
      <Skeleton className="h-8 w-2/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="flex space-x-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      
      <div className="flex space-x-3">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
