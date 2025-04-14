
let count = 0

export function generateToastId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export function getAriaLiveForVariant(variant?: string): 'assertive' | 'off' | 'polite' {
  switch (variant) {
    case 'destructive':
    case 'warning':
      return 'assertive'
    case 'success':
    case 'info':
    case 'default':
    default:
      return 'polite'
  }
}
