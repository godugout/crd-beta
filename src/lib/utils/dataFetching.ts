
import { toast } from 'sonner';

interface ApiResponse<T> {
  data?: T;
  error?: Error | null;
  success?: boolean;
}

/**
 * Helper function to standardize API calls with proper error handling
 */
export async function fetchData<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  errorMessage: string = 'An error occurred'
): Promise<{ data: T | null; error: any | null }> {
  try {
    const response = await apiCall();
    
    if (response.error) {
      console.error(`${errorMessage}:`, response.error);
      return { data: null, error: response.error };
    }
    
    return { data: response.data || null, error: null };
  } catch (err) {
    console.error(`${errorMessage}:`, err);
    return { data: null, error: err };
  }
}

/**
 * Helper function to standardize API calls with toast notifications
 */
export async function fetchDataWithToast<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: {
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    showLoading?: boolean;
    showSuccess?: boolean;
    showError?: boolean;
  } = {}
): Promise<{ data: T | null; error: any | null }> {
  const {
    loadingMessage = 'Loading...',
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred',
    showLoading = true,
    showSuccess = true,
    showError = true
  } = options;
  
  let toastId;
  
  if (showLoading) {
    toastId = toast.loading(loadingMessage);
  }
  
  try {
    const response = await apiCall();
    
    if (response.error) {
      if (showError) {
        toast.error(errorMessage, {
          id: toastId
        });
      } else if (toastId) {
        toast.dismiss(toastId);
      }
      
      console.error(`${errorMessage}:`, response.error);
      return { data: null, error: response.error };
    }
    
    if (showSuccess) {
      toast.success(successMessage, {
        id: toastId
      });
    } else if (toastId) {
      toast.dismiss(toastId);
    }
    
    return { data: response.data || null, error: null };
  } catch (err) {
    if (showError) {
      toast.error(errorMessage, {
        id: toastId
      });
    } else if (toastId) {
      toast.dismiss(toastId);
    }
    
    console.error(`${errorMessage}:`, err);
    return { data: null, error: err };
  }
}
