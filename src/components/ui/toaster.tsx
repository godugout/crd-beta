
import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { ToastIcons } from "./toast/icons"
import type { ToasterToast } from "@/types/toast"
import { toastIconConfig } from "@/config/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant = "default", ...props }) {
        const IconName = toastIconConfig[variant]
        const Icon = IconName ? ToastIcons[IconName] : null

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-3">
              {Icon && (
                <div className="flex-shrink-0 self-start pt-1">
                  <Icon className="h-4 w-4" />
                </div>
              )}
              <div className="grid flex-1 gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
