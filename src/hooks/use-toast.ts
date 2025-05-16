
import { 
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"
import { Toast as ToastType } from "@/types/toast"

export type ToasterToast = ToastType & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const TOAST_LIMIT = 10
const TOAST_REMOVE_DELAY = 1000000

type ToasterToastWithId = ToasterToast & {
  id: string
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toasts = new Map<string, ToasterToast>()

const listeners: Array<(toasts: ToasterToastWithId[]) => void> = []

function emitChange() {
  listeners.forEach((listener) => {
    listener(Array.from(toasts.values()))
  })
}

function addToast(toast: ToasterToast) {
  const id = toast.id ?? genId()
  toasts.set(id, { ...toast, id })
  emitChange()
  return id
}

function updateToast(id: string, toast: ToasterToast) {
  if (!toasts.has(id)) return
  const newToast = { ...toasts.get(id), ...toast }
  toasts.set(id, newToast)
  emitChange()
}

function dismissToast(id: string) {
  toasts.delete(id)
  emitChange()
}

function useToast() {
  const [toastState, setToastState] = React.useState<ToasterToastWithId[]>(
    Array.from(toasts.values())
  )

  React.useEffect(() => {
    listeners.push(setToastState)
    return () => {
      const index = listeners.indexOf(setToastState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    toast: (props: ToastType) => {
      return addToast({ ...props, open: true })
    },
    update: (id: string, props: ToastType) => {
      return updateToast(id, props)
    },
    dismiss: (id: string) => {
      return dismissToast(id)
    },
    toasts: toastState,
  }
}

export { useToast, updateToast, dismissToast }
