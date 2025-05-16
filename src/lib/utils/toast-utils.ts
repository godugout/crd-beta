
import { toast } from "sonner";
import { ToastVariant } from "@/types/toast";

// Helper functions for toast notifications
export const toastUtils = {
  success: (title: string, description?: string) => {
    toast.success(title, {
      description,
      duration: 3000,
    });
  },
  
  error: (title: string, description?: string) => {
    toast.error(title, {
      description,
      duration: 5000,
    });
  },
  
  warning: (title: string, description?: string) => {
    toast.warning(title, {
      description,
      duration: 4000,
    });
  },
  
  info: (title: string, description?: string) => {
    toast.info(title, {
      description,
      duration: 3000,
    });
  },
  
  custom: (title: string, {
    description,
    variant = "default",
    duration = 3000,
    action
  }: {
    description?: string;
    variant?: ToastVariant;
    duration?: number;
    action?: React.ReactNode;
  } = {}) => {
    toast(title, {
      description,
      duration,
      action,
    });
  }
};
