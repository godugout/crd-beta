
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast as useToastOriginal } from "@/components/ui/use-toast";

export { useToastOriginal as useToast, toast } from "@/components/ui/use-toast";
export { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport };
