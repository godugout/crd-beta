
import { useToast } from '@/hooks/use-toast';
import { ToastOptions } from '@/lib/adapters/toastAdapter';
import { createToast } from '@/types/toast';

/**
 * Hook to use the standardized toast function
 * This allows components that were using a different toast API to easily migrate
 */
export default function useShowToast() {
  const { toast } = useToast();
  
  return (options: ToastOptions) => {
    toast(createToast({
      title: options.title,
      description: options.description,
      variant: options.variant
    }));
  };
}
