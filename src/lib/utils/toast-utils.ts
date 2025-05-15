
import showToast, { ToastOptions } from '@/lib/adapters/toastAdapter';

/**
 * Utility functions for displaying toast notifications
 * This provides a simpler API for common toast types
 */
export const toastUtils = {
  /**
   * Display a success toast
   */
  success: (title: string, description?: string) => {
    return showToast({
      title,
      description,
      variant: 'success'
    });
  },

  /**
   * Display an error toast
   */
  error: (title: string, description?: string) => {
    return showToast({
      title,
      description,
      variant: 'destructive'
    });
  },

  /**
   * Display an info toast
   */
  info: (title: string, description?: string) => {
    return showToast({
      title,
      description,
      variant: 'info'
    });
  },

  /**
   * Display a warning toast
   */
  warning: (title: string, description?: string) => {
    return showToast({
      title,
      description,
      variant: 'warning'
    });
  }
};

export default toastUtils;
