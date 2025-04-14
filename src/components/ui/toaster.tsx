
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props} 
            className="bg-gray-800/50 backdrop-blur-md border-gray-700/30"
          >
            <div className="grid gap-1">
              {title && <ToastTitle className="text-white/80">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-white/60">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-4 right-4 z-[100] flex max-h-screen w-full max-w-[420px] flex-col-reverse p-4" />
    </ToastProvider>
  )
}
