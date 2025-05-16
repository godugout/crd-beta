
import { cva } from "class-variance-authority";
import type { ToastVariant } from "@/types/toast";

/**
 * Toast icon configuration for different toast variants
 */
export const toastIconConfig: Record<string, string | null> = {
  default: null,
  success: "Check",
  error: "X",
  warning: "AlertTriangle",
  info: "Info",
  destructive: "X",
};

/**
 * Default colors for the color picker
 */
export const DEFAULT_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#F87171', // Red
  '#FB923C', // Orange
  '#FBBF24', // Amber
  '#34D399', // Green
  '#22D3EE', // Cyan
  '#60A5FA', // Blue
  '#818CF8', // Indigo
  '#A78BFA', // Violet
  '#E879F9', // Pink
];

/**
 * Toast styles using cva for variants
 */
export const toastStyles = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border-slate-200 bg-white text-slate-900",
        destructive:
          "destructive group border-red-600 bg-red-600 text-slate-50",
        success:
          "success group border-green-600 bg-green-600 text-slate-50",
        warning:
          "warning group border-yellow-600 bg-yellow-500 text-slate-50",
        info:
          "info group border-blue-600 bg-blue-600 text-slate-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
