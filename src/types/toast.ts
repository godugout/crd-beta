
import { ReactNode } from "react";

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info" | "error";

export interface Toast {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastAction;
  variant?: ToastVariant;
  duration?: number;
  open: boolean;
}

export interface ToastAction {
  altText: string;
  onClick: () => void;
  children: React.ReactNode;
}

export type ToasterToast = Toast & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ReactNode;
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

export const createToast = (config: {
  title: string;
  description?: string;
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
