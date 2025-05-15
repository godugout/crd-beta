
import { ReactNode } from "react";

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

export interface ToasterToast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToasterToastWithId extends ToasterToast {
  id: string;
}

export type ToastActionElement = React.ReactElement<{
  altText: string;
  onClick: () => void;
}>;
