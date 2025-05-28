
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const crdButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        spectrum: "relative overflow-hidden backdrop-blur-md bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95",
        glass: "backdrop-blur-xl bg-black/30 border border-white/10 text-white hover:bg-black/40 transition-all shadow-lg",
        soft: "bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all",
        outline: "border border-white/20 bg-transparent text-white hover:bg-white/10",
        ghost: "text-white hover:bg-white/10 hover:text-white"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-xl px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "spectrum",
      size: "default"
    }
  }
);

export interface CrdButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof crdButtonVariants> {
  asChild?: boolean;
}

const CrdButton = React.forwardRef<HTMLButtonElement, CrdButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(crdButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
CrdButton.displayName = "CrdButton";

export { CrdButton, crdButtonVariants };
