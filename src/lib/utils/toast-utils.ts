
import { toast, type ToasterToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

/**
 * Helper function to create a toast with auto-generated ID
 */
export function createToast(
  params: Omit<ToasterToast, "id">
): void {
  toast({
    id: uuidv4(),
    ...params
  });
}

/**
 * Helper functions for common toast types
 */
export const toastUtils = {
  success: (title: string, description?: string) => {
    createToast({ 
      title, 
      description, 
      variant: "default" 
    });
  },
  
  error: (title: string, description?: string) => {
    createToast({ 
      title, 
      description, 
      variant: "destructive" 
    });
  },
  
  info: (title: string, description?: string) => {
    createToast({ 
      title, 
      description, 
    });
  },
  
  loading: (title: string, description?: string) => {
    createToast({ 
      title, 
      description,
      duration: Infinity,
    });
  }
};
