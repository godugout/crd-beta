
import { ReactNode } from "react"

export type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "destructive"

export type ToastActionElement = React.ReactElement

export interface ToasterToast {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  variant?: ToastVariant
  duration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface ToasterToastWithId extends ToasterToast {
  id: string
}

export interface ToasterToastWithStatus extends ToasterToast {
  status?: "loading" | "success" | "error"
}

export type Toast = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
  actionLabel?: string
  action?: () => void
  open?: boolean
}

// Helper function to create toast
export const createToast = (
  title: string,
  description?: string,
  variant: ToastVariant = "default",
  duration?: number
): ToasterToast => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    title,
    description,
    variant,
    duration
  };
};
