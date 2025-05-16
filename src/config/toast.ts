
import { cva } from "class-variance-authority";
import { ToastVariant } from "@/types/toast";

export const toastStyles = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        success:
          "border-green-500 bg-green-500 text-white dark:border-green-900 dark:bg-green-900",
        warning:
          "border-yellow-500 bg-yellow-500 text-white dark:border-yellow-900 dark:bg-yellow-900",
        info:
          "border-blue-500 bg-blue-500 text-white dark:border-blue-900 dark:bg-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
