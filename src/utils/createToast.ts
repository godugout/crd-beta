
import type { ToastOptions } from "@/types/toast";

export function createToast(options: Omit<ToastOptions, "id">): ToastOptions {
  return {
    ...options,
    variant: options.variant || "default"
  }
}
