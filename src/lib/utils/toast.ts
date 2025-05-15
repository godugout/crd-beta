
import { toast as sonnerToast, type ToastT } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'destructive' | 'info';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  id?: string;
  onDismiss?: () => void;
  onAutoClose?: () => void;
}

export interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export function toast(props: ToastProps, options?: ToastOptions): string {
  const { title, description, variant = 'default' } = props;
  const id = options?.id || uuidv4();
  
  const toastOptions = {
    ...options,
    id
  };

  switch (variant) {
    case 'success':
      sonnerToast.success(title, { ...toastOptions, description });
      break;
    case 'error':
    case 'destructive':
      sonnerToast.error(title, { ...toastOptions, description });
      break;
    case 'warning':
      sonnerToast.warning(title, { ...toastOptions, description });
      break;
    case 'info':
      sonnerToast.info(title, { ...toastOptions, description });
      break;
    default:
      sonnerToast(title, { ...toastOptions, description });
  }

  return id;
}

// Re-export other types and functions from sonner
export type { ToastT as ToasterToast };
export { toast as default };
