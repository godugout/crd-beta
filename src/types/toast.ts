
import { type ToastProps } from "@radix-ui/react-toast"

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'error';

export interface ToasterToast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
  variant?: ToastVariant
  duration?: number
}

export interface ToasterToastWithStatus extends ToasterToast {
  open?: boolean
  ariaLive?: 'assertive' | 'off' | 'polite'
  onOpenChange?: (open: boolean) => void
}
