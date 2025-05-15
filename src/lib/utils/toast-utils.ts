
import { toast } from '@/components/ui/use-toast';
import { generateToastId } from '@/lib/toast-utils';

export const toastUtils = {
  success: (title: string, description: string) => {
    toast({
      id: generateToastId(),
      title,
      description,
      variant: "default",
    });
  },
  
  error: (title: string, description: string) => {
    toast({
      id: generateToastId(),
      title,
      description,
      variant: "destructive",
    });
  },
  
  info: (title: string, description: string) => {
    toast({
      id: generateToastId(),
      title,
      description,
      variant: "info",
    });
  },
  
  warning: (title: string, description: string) => {
    toast({
      id: generateToastId(),
      title,
      description,
      variant: "warning",
    });
  }
};
