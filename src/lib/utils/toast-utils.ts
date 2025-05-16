
import { toast } from '@/hooks/use-toast';

export const toastUtils = {
  show: (title: string, description?: string, variant: "default" | "destructive" = 'default', duration?: number) => {
    return toast({
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      variant,
      duration
    });
  },
  
  success: (title: string, description?: string, duration?: number) => {
    return toastUtils.show(title, description, 'default', duration);
  },
  
  error: (title: string, description?: string, duration?: number) => {
    return toastUtils.show(title, description, 'destructive', duration);
  },
  
  warning: (title: string, description?: string, duration?: number) => {
    return toastUtils.show(title, description, 'default', duration);
  },
  
  info: (title: string, description?: string, duration?: number) => {
    return toastUtils.show(title, description, 'default', duration);
  }
};

export default toastUtils;
