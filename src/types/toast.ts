
import { type ToastActionElement, type ToastProps } from "@/components/ui/toast"

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: ToastVariant
}

export type ToasterToastWithStatus = ToasterToast & {
  duration?: number
  ariaLive?: 'assertive' | 'off' | 'polite'
}
