
import { useState } from 'react';
import { toast as sonnerToast, ToastT } from 'sonner';
import { Toast, ToastOptions, ToastVariant } from '@/types/toast';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (options: ToastOptions | string) => {
    const toastOptions = typeof options === 'string' ? { description: options } : options;
    const { variant = 'default', ...rest } = toastOptions;

    // Map our variant to sonner variant
    const sonnerVariant = variant === 'error' ? 'destructive' : variant;

    // Create toast with sonner
    sonnerToast[sonnerVariant === 'destructive' ? 'error' : 
                sonnerVariant === 'success' ? 'success' : 
                sonnerVariant === 'warning' ? 'warning' : 
                sonnerVariant === 'info' ? 'info' : 'default'](
      toastOptions.title || '',
      { description: toastOptions.description }
    );

    // Create toast for our internal state
    const newToast: Toast = {
      ...rest,
      variant,
      id: crypto.randomUUID?.() || String(Date.now()),
      open: true,
    };

    setToasts((currentToasts) => [...currentToasts, newToast]);
    return newToast;
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      setToasts((current) =>
        current.filter((toast) => toast.id !== toastId)
      );
    } else {
      setToasts([]);
    }
  };

  return {
    toast,
    dismiss,
    toasts,
  };
}

// Re-export toast from Sonner for convenience
export { toast } from 'sonner';
