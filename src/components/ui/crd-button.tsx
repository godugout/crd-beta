
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-primary/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-crd-primary text-white shadow-sm hover:bg-crd-primary/90",
        destructive: "bg-crd-error text-white hover:bg-crd-error/90",
        outline: "border border-input bg-transparent hover:bg-white/5 hover:text-crd-primary",
        secondary: "bg-crd-secondary text-crd-body hover:bg-crd-secondary/80",
        ghost: "hover:bg-white/5 hover:text-crd-primary",
        link: "text-crd-primary underline-offset-4 hover:underline",
        gradient: "relative overflow-hidden text-white shadow-md bg-gradient-to-r from-crd-primary to-blue-600 hover:shadow-lg transition-all transform hover:scale-[1.03]",
        rainbow: "relative overflow-hidden text-white shadow-md bg-gradient-to-r from-[#FF5C69] via-[#2AFC98] to-[#38B6FF] hover:shadow-lg transition-all transform hover:scale-[1.03]",
        glass: "backdrop-blur-xl bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-all transform hover:shadow-md",
        spectrum: "relative overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 text-white shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] after:absolute after:inset-0 after:bg-[var(--gradient-rainbow)] after:opacity-20 after:z-[-1]",
        pill: "rounded-full px-4 py-1.5 text-xs font-semibold bg-black/20 text-white hover:bg-black/30",
        tag: "rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/10 text-white hover:bg-white/15",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-11 rounded-xl px-8",
        xl: "h-12 rounded-xl px-10 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CrdButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const CrdButton = React.forwardRef<HTMLButtonElement, CrdButtonProps>(
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
CrdButton.displayName = "CrdButton"

export { CrdButton, buttonVariants }
