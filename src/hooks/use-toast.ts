
import * as React from "react";
import { Toast, createToast } from "@/types/toast";

export type ToasterToast = Toast & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

const TOAST_LIMIT = 10;
const TOAST_REMOVE_DELAY = 1000000;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toasts = new Map<string, ToasterToast>();

const listeners: Array<(toasts: ToasterToast[]) => void> = [];

function emitChange() {
  listeners.forEach((listener) => {
    listener(Array.from(toasts.values()));
  });
}

function addToast(toast: Toast) {
  const id = toast.id ?? genId();
  toasts.set(id, { ...toast, id });
  emitChange();
  return id;
}

function updateToast(id: string, toast: ToasterToast) {
  if (!toasts.has(id)) return;
  const newToast = { ...toasts.get(id), ...toast };
  toasts.set(id, newToast);
  emitChange();
}

function dismissToast(id: string) {
  toasts.delete(id);
  emitChange();
}

export function useToast() {
  const [toastState, setToastState] = React.useState<ToasterToast[]>(
    Array.from(toasts.values())
  );

  React.useEffect(() => {
    listeners.push(setToastState);
    return () => {
      const index = listeners.indexOf(setToastState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    toast: (props: Toast) => {
      return addToast({ ...props, open: true });
    },
    update: (id: string, props: Toast) => {
      return updateToast(id, props as ToasterToast);
    },
    dismiss: (id: string) => {
      return dismissToast(id);
    },
    toasts: toastState,
  };
}

// Export our toast utility methods
export { updateToast, dismissToast, createToast };

// For compatibility with older import patterns
export const toast = {
  create: createToast,
  dismiss: dismissToast,
  update: updateToast
};
