
import { toast, ToastOptions } from 'sonner';
import React from 'react';

// Helper function to safely call toast methods
export const showToast = {
  success: (message: string, options = {}) => {
    return toast.success(message, options);
  },
  
  error: (message: string, options = {}) => {
    return toast.error(message, options);
  },
  
  info: (message: string, options = {}) => {
    return toast.info(message, options);
  },
  
  warning: (message: string, options = {}) => {
    return toast.warning(message, options);
  },
  
  // For custom toast displays - fixed to properly handle React nodes
  custom: (content: React.ReactNode, options = {}) => {
    // Cast to any to work around type limitation
    return toast(content as any, options);
  }
};

// Default export for backwards compatibility
export default showToast;
