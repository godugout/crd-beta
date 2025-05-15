
import { toast, type Toast } from '@/components/ui/use-toast';

// Generate a simple unique ID for toasts
const generateToastId = (): string => {
  return `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Toast utilities
export const toastUtils = {
  success: (title: string, description?: string) => {
    toast({
      id: generateToastId(),
      title,
      description,
      variant: 'default'
    });
  },
  
  error: (title: string, description?: string) => {
    toast({
      id: generateToastId(),
      title,
      description,
      variant: 'destructive'
    });
  },
  
  info: (title: string, description?: string) => {
    toast({
      id: generateToastId(),
      title,
      description,
      variant: 'info'
    });
  },
  
  warning: (title: string, description?: string) => {
    toast({
      id: generateToastId(),
      title,
      description,
      variant: 'warning'
    });
  },
  
  custom: (options: Omit<Toast, 'id'>) => {
    toast({
      id: generateToastId(),
      ...options
    });
  }
};

// Legacy function for backward compatibility
export const showToast = (options: { title: string; description?: string; variant?: 'default' | 'destructive' | 'info' | 'warning'; duration?: number; }) => {
  const { title, description, variant = 'default', duration } = options;
  toast({
    id: generateToastId(),
    title,
    description,
    variant,
    duration
  });
};

export default toastUtils;
