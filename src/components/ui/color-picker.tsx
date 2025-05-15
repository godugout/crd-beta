
import React from "react";
import { cn } from "@/lib/utils";

export interface ColorPickerProps {
  id?: string;
  color: string;
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  // Add support for colors array for backward compatibility
  colors?: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  id,
  color,
  value = color, // Use color as default value if value is not provided
  onChange,
  label,
  className,
  colors, // Ignore colors prop as it's not used in the new implementation
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <div
          className="h-6 w-6 rounded-full border border-gray-200 dark:border-gray-800"
          style={{ backgroundColor: value }}
        />
        <input
          id={id}
          type="color"
          value={value}
          onChange={handleChange}
          className="h-9 w-9 appearance-none rounded-md bg-transparent"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {value}
        </span>
      </div>
    </div>
  );
};

export default ColorPicker;
