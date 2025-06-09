
import React from 'react';
import { Button } from '@/components/ui/button';

interface StyleControlsProps {
  styles: string[];
  selectedStyle: string;
  onStyleSelect: (style: string) => void;
}

export const StyleControls: React.FC<StyleControlsProps> = ({
  styles,
  selectedStyle,
  onStyleSelect
}) => {
  return (
    <div>
      <h3 className="text-white font-semibold mb-3">Styles</h3>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style) => (
          <Button
            key={style}
            variant={selectedStyle === style ? "default" : "outline"}
            size="sm"
            onClick={() => onStyleSelect(style)}
            className={`${
              selectedStyle === style
                ? 'bg-blue-600 text-white'
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
          >
            {style}
          </Button>
        ))}
      </div>
    </div>
  );
};
