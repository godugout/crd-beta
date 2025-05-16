
import React from "react";
import { 
  Check, 
  X, 
  AlertTriangle,
  Info 
} from "lucide-react";

export const ToastIcons: Record<string, React.FC<{ className?: string }>> = {
  Check: ({ className }) => <Check className={className} />,
  X: ({ className }) => <X className={className} />,
  AlertTriangle: ({ className }) => <AlertTriangle className={className} />,
  Info: ({ className }) => <Info className={className} />
};
