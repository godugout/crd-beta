
import { toast } from 'sonner';
import { createToast, ToasterToast } from '@/types/toast';

export function useToastHelper() {
  const showToast = (options: Partial<ToasterToast>) => {
    const toastWithId = createToast(options);
    
    switch(options.variant) {
      case 'success':
        return toast.success(toastWithId.title as string, {
          description: toastWithId.description as string,
          duration: toastWithId.duration,
        });
      case 'destructive':
      case 'error':
        return toast.error(toastWithId.title as string, {
          description: toastWithId.description as string,
          duration: toastWithId.duration,
        });
      case 'warning':
        return toast.warning(toastWithId.title as string, {
          description: toastWithId.description as string,
          duration: toastWithId.duration,
        });
      case 'info':
        return toast.info(toastWithId.title as string, {
          description: toastWithId.description as string,
          duration: toastWithId.duration,
        });
      default:
        return toast(toastWithId.title as string, {
          description: toastWithId.description as string,
          duration: toastWithId.duration,
        });
    }
  };

  return {
    toast: showToast,
    success: (options: string | Partial<ToasterToast>) => {
      if (typeof options === 'string') {
        return showToast({ title: options, variant: 'success' });
      }
      return showToast({ ...options, variant: 'success' });
    },
    error: (options: string | Partial<ToasterToast>) => {
      if (typeof options === 'string') {
        return showToast({ title: options, variant: 'destructive' });
      }
      return showToast({ ...options, variant: 'destructive' });
    },
    warning: (options: string | Partial<ToasterToast>) => {
      if (typeof options === 'string') {
        return showToast({ title: options, variant: 'warning' });
      }
      return showToast({ ...options, variant: 'warning' });
    },
    info: (options: string | Partial<ToasterToast>) => {
      if (typeof options === 'string') {
        return showToast({ title: options, variant: 'info' });
      }
      return showToast({ ...options, variant: 'info' });
    }
  };
}
