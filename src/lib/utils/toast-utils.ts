
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// Helper to create toast with proper ID
export const createToast = (config: {
  title: string;
  description?: string;
  variant?: "success" | "error" | "warning" | "info" | "destructive";
  duration?: number;
}) => {
  const { title, description, variant, duration } = config;
  
  // Convert variant if needed (for compatibility)
  let toastVariant = variant;
  if (variant === "error") {
    toastVariant = "destructive";
  }
  
  return {
    id: uuidv4(),
    title,
    description,
    variant: toastVariant,
    ...(duration ? { duration } : {})
  };
};

// Toast utility with predefined methods
export const toastUtils = {
  success: (title: string, description?: string) => {
    toast(createToast({ title, description, variant: "success" }));
  },
  error: (title: string, description?: string) => {
    toast(createToast({ title, description, variant: "error" }));
  },
  warning: (title: string, description?: string) => {
    toast(createToast({ title, description, variant: "warning" }));
  },
  info: (title: string, description?: string) => {
    toast(createToast({ title, description, variant: "info" }));
  }
};
