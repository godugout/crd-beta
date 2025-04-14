
import { type ToastProps } from "@radix-ui/react-toast"

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

export interface ToasterToast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
  variant?: ToastVariant
}

export interface ToasterToastWithStatus extends ToasterToast {
  duration?: number
  ariaLive?: 'assertive' | 'off' | 'polite'
}
