
import { toast as sonnerToast } from 'sonner';
import { ToasterToast, createToast } from '@/types/toast';

type ToastOptions = Omit<ToasterToast, 'id'>;

// Create a wrapper around sonner toast that automatically adds an ID
export const toast = {
  // Simple toast
  toast: (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      return sonnerToast(options);
    }
    const toastWithId = createToast(options);
    return sonnerToast(toastWithId.title as string, { 
      description: toastWithId.description as string,
      duration: toastWithId.duration,
    });
  },
  
  // Success toast
  success: (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      return sonnerToast.success(options);
    }
    const toastWithId = createToast(options);
    return sonnerToast.success(toastWithId.title as string, {
      description: toastWithId.description as string,
      duration: toastWithId.duration,
    });
  },
  
  // Error toast
  error: (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      return sonnerToast.error(options);
    }
    const toastWithId = createToast(options);
    return sonnerToast.error(toastWithId.title as string, {
      description: toastWithId.description as string,
      duration: toastWithId.duration,
    });
  },
  
  // Warning toast
  warning: (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      return sonnerToast.warning(options);
    }
    const toastWithId = createToast(options);
    return sonnerToast.warning(toastWithId.title as string, {
      description: toastWithId.description as string,
      duration: toastWithId.duration,
    });
  },
  
  // Info toast
  info: (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      return sonnerToast.info(options);
    }
    const toastWithId = createToast(options);
    return sonnerToast.info(toastWithId.title as string, {
      description: toastWithId.description as string,
      duration: toastWithId.duration,
    });
  }
};
