
import { ComponentProps } from "react"
import { ToastActionElement, ToastProps } from "@/components/ui/toast"

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info" | "error";

export type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: ToastVariant
  duration?: number
  open: boolean
}

export type Toast = Omit<ToasterToast, "id"> & {
  id?: string
  open?: boolean
}

export type ToastOptions = Toast

export type ToastIconNames = "Check" | "X" | "AlertTriangle" | "Info" | null;

export interface ToastActionProps extends ComponentProps<"button"> {
  altText?: string
}

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
