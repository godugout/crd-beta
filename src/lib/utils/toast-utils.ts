
import { toast } from '@/hooks/use-toast';
import { ToastVariant } from '@/types/toast';

export const toastUtils = {
  show: (title: string, description?: string, variant: ToastVariant = 'default', duration?: number) => {
    return toast({
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      variant,
      duration
    });
  },
  
  success: (title: string, description?: string, duration?: number) => {
    return toastUtils.show(title, description, 'success', duration);
  },
  
  error: (title: string, description?: string, duration?: number) => {
    return toastUtils.show(title, description, 'destructive', duration);
  },
  
  warning: (title: string, description?: string, duration?: number) => {
    return toastUtils.show(title, description, 'warning', duration);
  },
  
  info: (title: string, description?: string, duration?: number) => {
    return toastUtils.show(title, description, 'info', duration);
  }
};

export default toastUtils;
