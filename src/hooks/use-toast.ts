
import { toast as sonnerToast } from 'sonner';

export type ToastVariant = 'default' | 'success' | 'info' | 'warning' | 'error' | 'destructive';

export interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type Toast = {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  variant?: ToastVariant;
  duration?: number;
  ariaLive?: 'assertive' | 'off' | 'polite';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const toasts: Toast[] = [];

const showToast = ({ title, description, variant = 'default', duration = 5000, action }: ToastProps) => {
  switch (variant) {
    case 'success':
      sonnerToast.success(title, {
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
      sonnerToast(title, {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick
        } : undefined
      });
      break;
    case 'warning':
      sonnerToast.warning(title, {
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
      sonnerToast.error(title, {
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

// Export the toast function directly rather than as a property
export const toast = {
  // Direct access methods for specific variants
  default: (title: string, options?: ToastOptions) => showToast({ title, ...options, variant: 'default' }),
  success: (title: string, options?: ToastOptions) => showToast({ title, ...options, variant: 'success' }),
  info: (title: string, options?: ToastOptions) => showToast({ title, ...options, variant: 'info' }),
  warning: (title: string, options?: ToastOptions) => showToast({ title, ...options, variant: 'warning' }),
  error: (title: string, options?: ToastOptions) => showToast({ title, ...options, variant: 'error' }),
  destructive: (title: string, options?: ToastOptions) => showToast({ title, ...options, variant: 'destructive' }),
  // Original toast method for backward compatibility
  toast: showToast,
  // Direct access to sonnerToast methods
  ...sonnerToast
};

export const useToast = () => {
  return {
    toast: showToast,
    toasts
  };
};
