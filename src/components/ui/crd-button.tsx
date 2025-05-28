
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const crdButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        spectrum: "relative overflow-hidden backdrop-blur-md bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95",
        glass: "backdrop-blur-xl bg-black/30 border border-white/10 text-white hover:bg-black/40 transition-all shadow-lg",
        soft: "bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all",
        outline: "border border-white/20 bg-transparent text-white hover:bg-white/10",
        ghost: "text-white hover:bg-white/10 hover:text-white",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        gradient: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700",
        rainbow: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-white",
        pill: "rounded-full px-6",
        tag: "rounded-lg px-3 py-1 text-xs",
        navItem: "rounded-lg hover:bg-accent hover:text-accent-foreground",
        navItemActive: "rounded-lg bg-accent text-accent-foreground",
        featured: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl",
        link: "text-primary underline-offset-4 hover:underline"
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
