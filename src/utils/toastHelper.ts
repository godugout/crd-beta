
import { toast } from 'sonner';
import React from 'react';

// Define the ToastOptions type that matches what sonner expects
interface ToastOptions {
  id?: string | number;
  duration?: number;
  icon?: string | React.ReactNode;
  description?: string | React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick: () => void;
  } | React.ReactNode;
  onDismiss?: () => void;
  onAutoClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  dismissible?: boolean;
}

// Helper function to safely call toast methods
export const showToast = {
  success: (message: string, options: ToastOptions = {}) => {
    return toast.success(message, options as any);
  },
  
  error: (message: string, options: ToastOptions = {}) => {
    return toast.error(message, options as any);
  },
  
  info: (message: string, options: ToastOptions = {}) => {
    return toast.info(message, options as any);
  },
  
  warning: (message: string, options: ToastOptions = {}) => {
    return toast.warning(message, options as any);
  },
  
  // For custom toast displays - fixed to properly handle React nodes
  custom: (content: React.ReactNode, options: ToastOptions = {}) => {
    return toast(content as any, options as any);
  }
};

// Default export for backwards compatibility
export default showToast;
