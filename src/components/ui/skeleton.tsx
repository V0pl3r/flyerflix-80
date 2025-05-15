
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Specialized skeletons for common use cases
function TemplateCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full aspect-[9/16] relative", className)}>
      <Skeleton className="w-full h-full rounded-md" />
      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

function TextSkeleton({ width = "full", height = "4" }: { width?: string; height?: string }) {
  return <Skeleton className={`h-${height} w-${width}`} />;
}

function AvatarSkeleton({ size = "12" }: { size?: string }) {
  return <Skeleton className={`h-${size} w-${size} rounded-full`} />;
}

function CardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="pt-2 flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// Loading indicator with fade-in
function FadeInSkeleton({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div 
      className="animate-fade-in" 
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export { 
  Skeleton, 
  TemplateCardSkeleton, 
  TextSkeleton, 
  AvatarSkeleton, 
  CardSkeleton,
  FadeInSkeleton
}
