
import { useToast as useToastShared } from "@/hooks/use-toast"
import { ToastVariant } from "@/types/toast"

export const useToast = () => {
  const { toast } = useToastShared()
  
  const showToast = (
    title: string, 
    description: string, 
    variant: "success" | "error" | "warning" | "info" | "destructive" = "info", 
    duration?: number
  ) => {
    toast({
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      variant,
      duration
    })
  }
  
  return {
    success: (title: string, description: string, duration?: number) => 
      showToast(title, description, "success", duration),
    error: (title: string, description: string, duration?: number) => 
      showToast(title, description, "error", duration),
    warning: (title: string, description: string, duration?: number) => 
      showToast(title, description, "warning", duration),
    info: (title: string, description: string, duration?: number) => 
      showToast(title, description, "info", duration),
    custom: showToast
  }
}

export default useToast;
