
import { ReactNode } from "react";

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info" | "error";

export interface Toast {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastAction | ReactNode;
  variant?: ToastVariant;
  duration?: number;
  open: boolean;
}

export interface ToastOptions {
  id?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  action?: ToastAction | ReactNode;
  variant?: ToastVariant;
  duration?: number;
  open?: boolean;
}

export interface ToastAction {
  altText: string;
  onClick: () => void;
  children: ReactNode;
}

// Add a compatibility type that matches sonner.toast expectations
export interface SonnerToastOptions {
  id?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  action?: React.ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  duration?: number;
  dismissible?: boolean;
  icon?: React.ReactNode;
  important?: boolean;
  cancel?: React.ReactNode;
  onDismiss?: () => void;
  onAutoClose?: () => void;
}

export type ToasterToast = Toast & {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastAction | ReactNode;
  open: boolean;
}

export type ToasterToastWithId = Toast & {
  id: string;
}

export type ToastActionElement = React.ReactElement<{
  altText: string;
  onClick: () => void;
  className?: string;
}>;

export type ToastProps = Omit<ToasterToast, "id">;

// Update the createToast function to return a proper Toast type
export const createToast = (config: {
  title: string | ReactNode;
  description?: string | ReactNode;
  action?: ToastActionElement;
  variant?: ToastVariant;
  duration?: number;
}): Toast => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    title: config.title,
    description: config.description,
    action: config.action,
    variant: config.variant || "default",
    duration: config.duration || 3000,
    open: true
  };
};
