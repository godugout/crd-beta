
import { ComponentProps } from "react"
import { ToastActionElement, ToastProps } from "@/components/ui/toast"

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

export type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: ToastVariant
  duration?: number
  open?: boolean
}

export type ToasterToastWithId = ToasterToast & {
  id: string
  open: boolean
}

export type ToastOptions = Omit<ToasterToast, "id">

export type ToastIconNames = "Check" | "X" | "AlertTriangle" | "Info" | null;

export interface ToastActionProps extends ComponentProps<"button"> {
  altText?: string
}

export function createToast(options: Omit<ToastOptions, "id">): ToastOptions {
  return {
    ...options,
    variant: options.variant || "default"
  }
}
