
import { type ToastProps } from "@radix-ui/react-toast"

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

export interface ToasterToast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToasterToastWithStatus extends ToasterToast {
  open?: boolean;
  ariaLive?: 'assertive' | 'off' | 'polite';
  onOpenChange?: (open: boolean) => void;
}

// Add a utility function to create toast with ID
export const createToast = (toast: Partial<ToasterToast>): ToasterToast => {
  return {
    id: crypto.randomUUID?.() || String(Date.now()),
    ...toast
  };
};
