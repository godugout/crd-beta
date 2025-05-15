
import showToast from '@/lib/adapters/toastAdapter';

/**
 * Hook to use the standardized toast function
 * This allows components that were using a different toast API to easily migrate
 */
export default function useShowToast() {
  return showToast;
}
