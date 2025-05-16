
import { toast as sonnerToast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ToastVariant } from '@/types/toast';

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

  // Map our custom variants to sonner variants
  // Only use default and destructive externally to match shadcn toast
  switch (variant) {
    case 'success':
    case 'info':
    case 'warning':
      sonnerToast(title, { ...toastOptions, description });
      break;
    case 'error':
    case 'destructive':
      sonnerToast.error(title, { ...toastOptions, description });
      break;
    default:
      sonnerToast(title, { ...toastOptions, description });
  }

  return id;
}

export default toast;
