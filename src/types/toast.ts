
import { ReactNode } from "react";

export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastAction;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
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
