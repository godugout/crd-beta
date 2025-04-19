
import { toast } from 'sonner';

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
  
  // For custom toast displays
  custom: (content: React.ReactNode, options = {}) => {
    return toast.custom(content, options);
  }
};
