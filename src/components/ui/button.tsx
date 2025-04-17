
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--brand-primary)] text-[var(--text-primary)] shadow-sm hover:opacity-90",
        destructive: "bg-red-600 text-white hover:bg-red-600/90",
        outline: "border border-input bg-background hover:bg-muted hover:text-[var(--brand-primary)]",
        secondary: "bg-[rgba(55,65,81,0.4)] text-[var(--text-primary)] hover:bg-[rgba(55,65,81,0.5)]",
        ghost: "hover:bg-muted hover:text-[var(--brand-primary)]",
        link: "text-[var(--brand-primary)] underline-offset-4 hover:underline",
        gradient: "relative overflow-hidden text-white shadow-md bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:shadow-lg transition-all transform hover:scale-[1.03]",
        rainbow: "relative overflow-hidden text-white shadow-md hover:shadow-lg transition-all transform hover:scale-[1.03] backdrop-blur-sm bg-black/20 border border-white/10 after:absolute after:inset-0 after:bg-[var(--gradient-rainbow)] after:opacity-20 after:z-[-1]",
        glass: "glass-button text-[var(--text-primary)] hover-lift",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base font-semibold",
        icon: "h-10 w-10 rounded-full",
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
