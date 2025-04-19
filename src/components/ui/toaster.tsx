
import * as React from "react"
import { useToast, Toast } from "@/hooks/use-toast"
import {
  Toast as ToastComponent,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { toastIconConfig } from "@/config/toast"
import { ToastIcons } from "./toast/icons"
import type { ToastVariant } from "@/types/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant = "default", ...props }) {
        const IconName = toastIconConfig[variant as ToastVariant]
        const Icon = IconName ? ToastIcons[IconName] : null

        return (
          <ToastComponent key={id} variant={variant as ToastVariant} {...props}>
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
          </ToastComponent>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
