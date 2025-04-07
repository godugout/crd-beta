
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  /**
   * Text to display while loading
   */
  text?: string;
  
  /**
   * Size of the loader
   */
  size?: "sm" | "md" | "lg";
  
  /**
   * Whether to show a centered full-page loading state
   */
  fullPage?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;
}

/**
 * A reusable loading state component with different size options
 */
const LoadingState = ({
  text = "Loading...",
  size = "md",
  fullPage = false,
  className = "",
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = fullPage
    ? "fixed inset-0 flex items-center justify-center bg-white/80 z-50"
    : "flex items-center justify-center p-4";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={`animate-spin text-cardshow-blue ${sizeClasses[size]}`} />
        {text && (
          <p className={`text-cardshow-slate font-medium ${size === "lg" ? "text-lg" : "text-sm"}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export { LoadingState };
