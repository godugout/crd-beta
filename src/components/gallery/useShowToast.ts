
import { useToast } from '@/hooks/use-toast';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

/**
 * Hook to use the standardized toast function
 * This allows components that were using a different toast API to easily migrate
 */
export default function useShowToast() {
  const { toast } = useToast();
  
  return (options: ToastOptions) => {
    toast({
      id: Math.random().toString(36).substring(2, 9),
      title: options.title,
      description: options.description,
      variant: options.variant || "default"
    });
  };
}
