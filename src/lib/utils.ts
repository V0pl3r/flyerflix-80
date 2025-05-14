
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add aspect ratio component from shadcn
export const AspectRatio = ({ ratio = 16 / 9, children, className }: {
  ratio?: number;
  children: React.ReactNode;
  className?: string;
}) => {
  const paddingTop = `${(1 / ratio) * 100}%`;
  
  return (
    <div
      className={`relative w-full ${className || ''}`}
      style={{ paddingTop }}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
};
