
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react"

export const ToastIcons = {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info
} as const

export type ToastIconName = keyof typeof ToastIcons
