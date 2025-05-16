
import { ReactNode } from "react";
import { ToastAction } from "@/components/ui/toast";

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

export interface ToasterToast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

export type ToasterToastWithId = ToasterToast;

export type ToastActionElement = React.ReactElement<{
  altText: string;
  onClick: () => void;
}>;

export interface ToastConfig {
  title: string;
  description?: string;
  action?: ToastAction;
  variant?: ToastVariant;
  id?: string;
  duration?: number;
}

export const createToast = (config: ToastConfig) => {
  return {
    id: config.id || Date.now().toString(),
    title: config.title,
    description: config.description,
    action: config.action,
    variant: config.variant || "default",
    duration: config.duration || 3000,
  };
};
