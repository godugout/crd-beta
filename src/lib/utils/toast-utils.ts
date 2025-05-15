
import { toast } from "@/components/ui/use-toast";
import { createToast } from "@/types/toast";

export const toastUtils = {
  success: (title: string, description?: string, duration?: number) => {
    toast(createToast({
      title,
      description,
      variant: "success",
      duration: duration || 3000
    }));
  },

  error: (title: string, description?: string, duration?: number) => {
    toast(createToast({
      title,
      description,
      variant: "destructive",
      duration: duration || 5000
    }));
  },

  info: (title: string, description?: string, duration?: number) => {
    toast(createToast({
      title,
      description,
      variant: "info",
      duration: duration || 3000
    }));
  },

  warning: (title: string, description?: string, duration?: number) => {
    toast(createToast({
      title,
      description,
      variant: "warning",
      duration: duration || 4000
    }));
  }
};
