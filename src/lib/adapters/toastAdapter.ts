
import { toast } from '@/components/ui/use-toast';
import { generateToastId } from '@/lib/toast-utils';
import { ToasterToast } from '@/types/toast';

export function adaptToast(toastData: Partial<ToasterToast>): ToasterToast {
  return {
    id: toastData.id || generateToastId(),
    title: toastData.title,
    description: toastData.description,
    variant: toastData.variant || 'default',
    action: toastData.action,
    duration: toastData.duration || 5000,
    className: toastData.className,
  } as ToasterToast;
}

export function showToast(toastData: Partial<ToasterToast>): void {
  toast(adaptToast(toastData));
}
