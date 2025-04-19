
import { toast } from 'sonner';

type ToastVariant = 'default' | 'success' | 'info' | 'warning' | 'error' | 'destructive';

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const showToast = ({ title, description, variant = 'default', duration = 5000, action }: ToastProps) => {
    switch (variant) {
      case 'success':
        toast.success(title, {
          description,
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick
          } : undefined
        });
        break;
      case 'info':
      case 'default':
        toast(title, {
          description,
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick
          } : undefined
        });
        break;
      case 'warning':
        toast.warning(title, {
          description,
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick
          } : undefined
        });
        break;
      case 'error':
      case 'destructive':
        toast.error(title, {
          description,
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick
          } : undefined
        });
        break;
    }
  };

  return {
    toast: showToast
  };
};
