
import type { ToastVariant } from "@/types/toast"
import { cva } from "class-variance-authority"
import type { ToastIconName } from "@/components/ui/toast/icons"

export const toastViewportStyles = "fixed top-4 right-4 z-[100] flex max-h-screen w-full max-w-[420px] flex-col-reverse p-4"

export const toastStyles = cva(
  [
    "group pointer-events-auto relative flex w-full items-center justify-between",
    "space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
    "data-[swipe=cancel]:translate-x-0",
    "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
    "data-[swipe=move]:transition-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
    "data-[state=open]:slide-in-from-top-full",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-gray-700/30 bg-gray-800/50 text-white/80 backdrop-blur-md",
        destructive: "border-red-500/30 bg-red-900/50 text-white/80 backdrop-blur-md",
        success: "border-green-500/30 bg-green-900/50 text-white/80 backdrop-blur-md",
        warning: "border-yellow-500/30 bg-yellow-900/50 text-white/80 backdrop-blur-md",
        info: "border-blue-500/30 bg-blue-900/50 text-white/80 backdrop-blur-md",
        error: "border-red-500/30 bg-red-900/50 text-white/80 backdrop-blur-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const toastTitleStyles = "text-white/80 text-sm font-semibold"
export const toastDescriptionStyles = "text-white/60 text-sm"

export const toastAccessibilityConfig = {
  role: "status", 
  "aria-live": "polite",
  defaultDuration: 5000, // 5 seconds for standard notifications
  shortDuration: 3000,   // 3 seconds for simple notifications
  longDuration: 8000    // 8 seconds for more complex information
}

export const toastIconConfig: Record<ToastVariant, ToastIconName | null> = {
  default: null,
  success: "CheckCircle",
  warning: "AlertTriangle",
  destructive: "AlertCircle",
  info: "Info",
  error: "AlertCircle" // Added error variant
}
