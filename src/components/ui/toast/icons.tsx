
import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

export type ToastIconName = "AlertCircle" | "AlertTriangle" | "CheckCircle" | "Info";

export const ToastIcons: Record<ToastIconName, React.FC<{ className?: string }>> = {
  AlertCircle: ({ className }) => <AlertCircle className={className} />,
  AlertTriangle: ({ className }) => <AlertTriangle className={className} />,
  CheckCircle: ({ className }) => <CheckCircle className={className} />,
  Info: ({ className }) => <Info className={className} />
};
