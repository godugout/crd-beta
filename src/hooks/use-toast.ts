
import { toast as sonnerToast, type ToastT } from 'sonner';
import { type ReactNode } from 'react';

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

// Create a fixed toastFunction that conforms to our expectations
const showToast = ({ title, description, variant = 'default', duration = 5000, action }: ToastProps) => {
  switch (variant) {
    case 'success':
      return sonnerToast.success(title, {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick
        } : undefined
      });
    case 'info':
    case 'default':
      return sonnerToast(title, {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick
        } : undefined
      });
    case 'warning':
      return sonnerToast.warning(title, {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick
        } : undefined
      });
    case 'error':
    case 'destructive':
      return sonnerToast.error(title, {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick
        } : undefined
      });
    default:
      return sonnerToast(title, {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick
        } : undefined
      });
  }
};

// Define our toast object with proper function signatures
export const toast = {
  // Direct toast method that takes a ToastProps object
  toast: (props: ToastProps) => showToast(props),
  
  // Variant-specific methods
  default: (title: string, options?: ToastOptions) => 
    showToast({ title, ...options, variant: 'default' }),
  success: (title: string, options?: ToastOptions) => 
    showToast({ title, ...options, variant: 'success' }),
  info: (title: string, options?: ToastOptions) => 
    showToast({ title, ...options, variant: 'info' }),
  warning: (title: string, options?: ToastOptions) => 
    showToast({ title, ...options, variant: 'warning' }),
  error: (title: string, options?: ToastOptions) => 
    showToast({ title, ...options, variant: 'error' }),
  destructive: (title: string, options?: ToastOptions) => 
    showToast({ title, ...options, variant: 'destructive' }),
};

// Our hook to use toast
export const useToast = () => {
  return {
    toast: showToast,
    toasts: [] // Empty toasts array to match expected interface
  };
};
