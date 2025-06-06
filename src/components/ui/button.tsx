
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--brand-primary)] text-white shadow-sm hover:opacity-90 hover:shadow-[var(--shadow-brand)]",
        destructive: "bg-red-600 text-white hover:bg-red-600/90 shadow-sm hover:shadow-red-600/25",
        outline: "border-2 border-[var(--border-highlight)] bg-transparent text-white hover:bg-white/5 hover:border-[var(--border-glow)]",
        secondary: "bg-[var(--bg-elevated)] text-white hover:bg-[var(--bg-elevated)]/90 shadow-sm",
        ghost: "text-white hover:bg-white/10 hover:text-white",
        link: "text-[var(--brand-primary)] underline-offset-4 hover:underline",
        gradient: "relative overflow-hidden text-white shadow-md bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:shadow-[var(--shadow-brand)] transition-all transform hover:scale-[1.02]",
        rainbow: "relative overflow-hidden text-white shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] backdrop-blur-sm bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-accent)] to-[var(--brand-secondary)] bg-size-[200%_200%] animate-gradient-shift",
        glass: "glass-button backdrop-blur-xl bg-white/8 border border-white/10 text-white hover:bg-white/12 hover:border-white/20 transition-all transform hover:shadow-md",
        soft: "bg-white/8 border border-white/10 text-white hover:bg-white/12 transition-colors",
        pill: "rounded-full px-4 py-1.5 text-xs font-semibold bg-[var(--bg-elevated)] text-white hover:bg-[var(--bg-elevated)]/90",
        tag: "tag-pill rounded-full px-3 py-1 text-xs font-medium",
        navItem: "nav-item px-4 py-2 rounded-xl transition-colors text-white/80 hover:bg-white/5 hover:text-white",
        navItemActive: "nav-item-active bg-white/10 text-white font-semibold shadow-sm",
        featured: "relative overflow-hidden backdrop-blur-md bg-gradient-to-r from-[var(--brand-warning)] to-[var(--brand-accent)] text-white shadow-md hover:shadow-[var(--shadow-accent)] transition-all transform hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs font-semibold",
        lg: "h-12 rounded-xl px-8 text-base font-bold",
        xl: "h-14 rounded-xl px-10 text-lg font-bold",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
