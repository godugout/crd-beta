
import { ToastAction } from "@/components/ui/toast";

export interface ToastConfig {
  title: string;
  description?: string;
  action?: ToastAction;
  variant?: "default" | "destructive";
  id?: string;
  duration?: number;
}

export const createToast = (config: ToastConfig) => {
  return {
    id: config.id || Date.now().toString(),
    title: config.title,
    description: config.description,
    action: config.action,
    variant: config.variant || "default",
    duration: config.duration || 3000,
  };
};
