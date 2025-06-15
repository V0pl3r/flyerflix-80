
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      console.log('Paste event detected');
      // Call original onPaste if provided
      if (props.onPaste) {
        props.onPaste(e);
      }
      // Force background color after paste
      setTimeout(() => {
        const target = e.target as HTMLInputElement;
        target.style.backgroundColor = 'var(--background)';
        console.log('Background color forced after paste');
      }, 0);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      console.log('Focus event detected');
      const target = e.target as HTMLInputElement;
      target.style.backgroundColor = 'var(--background)';
      if (props.onFocus) {
        props.onFocus(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      console.log('Blur event detected');
      const target = e.target as HTMLInputElement;
      target.style.backgroundColor = 'var(--background)';
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          backgroundColor: 'var(--background) !important',
          ...props.style
        }}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
