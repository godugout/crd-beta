
import { toast } from 'sonner';

// Toast types
export interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'info' | 'warning';
  duration?: number;
  action?: React.ReactNode;
}

/**
 * Standardized toast function that works across different toast implementations
 */
export const showToast = (options: ToastOptions) => {
  const { title, description, variant = 'default', duration = 5000 } = options;
  
  // Map variant to appropriate toast method in Sonner
  switch (variant) {
    case 'success':
      return toast.success(title, {
        description,
        duration
      });
    case 'info':
      return toast.info(title, {
        description,
        duration
      });
    case 'warning':
      return toast.warning(title, {
        description,
        duration
      });
    case 'destructive':
      return toast.error(title, {
        description,
        duration
      });
    default:
      return toast(title, {
        description,
        duration
      });
  }
};

export default showToast;
