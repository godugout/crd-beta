
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast as useToastImplementation, toast } from "@/components/ui/use-toast";

// Re-export components for easier consumption
export { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport };

// Re-export the toast hook and function
export const useToast = useToastImplementation;
export { toast };
