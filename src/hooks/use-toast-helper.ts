
import { toast } from "sonner";
import { createToast } from "@/lib/utils/toast-utils";
import { ToastVariant } from "@/types/toast";

export const useShowToast = () => {
  const showToast = (
    title: string,
    description?: string,
    variant: ToastVariant = "default",
    duration?: number
  ) => {
    const toastConfig = createToast({
      title,
      description,
      variant, 
      duration
    });

    toast(toastConfig);
  };

  return {
    showToast,
    success: (title: string, description?: string) => 
      showToast(title, description, "success"),
    error: (title: string, description?: string) => 
      showToast(title, description, "destructive"),
    warning: (title: string, description?: string) => 
      showToast(title, description, "warning"),
    info: (title: string, description?: string) => 
      showToast(title, description, "info"),
  };
};

export default useShowToast;
