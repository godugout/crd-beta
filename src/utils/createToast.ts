
import type { Toast, ToastVariant } from "@/types/toast";

export function createToast(options: {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactNode;
}): Toast {
  return {
    title: options.title,
    description: options.description,
    variant: options.variant || "default",
    duration: options.duration || 3000,
    action: options.action,
    open: true
  };
}
