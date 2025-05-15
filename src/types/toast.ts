
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
