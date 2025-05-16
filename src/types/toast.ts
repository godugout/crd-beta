
import { ReactNode } from 'react';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
  altText?: string;
}

export interface Toast {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastAction;
  variant?: ToastVariant;
  duration?: number;
  open: boolean;  // Required property to fix errors
}

export function createToast(options: Omit<Toast, 'open'>): Toast {
  return {
    ...options,
    open: true
  };
}

export type ToastOptions = Omit<Toast, 'open'>;
