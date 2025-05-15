
import { Skeleton } from '@/components/ui/skeleton';

interface TemplateSkeletonProps {
  count?: number;
}

const TemplateSkeleton = ({ count = 5 }: TemplateSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="flex-none w-[180px] md:w-[200px] lg:w-[220px]">
          <div className="aspect-[9/16] bg-white/5 rounded-md overflow-hidden relative">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      ))}
    </>
  );
};

export default TemplateSkeleton;
