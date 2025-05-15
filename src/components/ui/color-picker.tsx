
import React from "react";
import { cn } from "@/lib/utils";

export interface ColorPickerProps {
  id?: string;
  color: string;
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  // Add support for colors array
  colors?: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  id,
  color,
  value = color, // Use color as default value if value is not provided
  onChange,
  label,
  className,
  colors = [],
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handlePresetClick = (presetColor: string) => {
    onChange(presetColor);
  };

  // Ensure we have valid values
  const safeValue = value || color || "#000000";

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
          style={{ backgroundColor: safeValue }}
        />
        <input
          id={id}
          type="color"
          value={safeValue}
          onChange={handleChange}
          className="h-9 w-9 appearance-none rounded-md bg-transparent"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {safeValue}
        </span>
      </div>

      {colors && colors.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {colors.map((presetColor, index) => (
            <button
              key={index}
              type="button"
              className="h-5 w-5 rounded-full border border-gray-200 dark:border-gray-800"
              style={{ backgroundColor: presetColor }}
              onClick={() => handlePresetClick(presetColor)}
              aria-label={`Select color ${presetColor}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
