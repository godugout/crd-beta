
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EffectOption {
  name: string;
  description: string;
}

interface EffectSelectorProps {
  options: EffectOption[];
  selectedEffect: string | null;
  onSelectEffect: (value: string) => void;
  onAddEffect: () => void;
}

const EffectSelector: React.FC<EffectSelectorProps> = ({
  options,
  selectedEffect,
  onSelectEffect,
  onAddEffect
}) => {
  return (
    <div className="space-y-2">
      <div>
        <Select
          value={selectedEffect || ''}
          onValueChange={onSelectEffect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an effect" />
          </SelectTrigger>
          <SelectContent>
            {options.map(effect => (
              <SelectItem key={effect.name} value={effect.name}>
                {effect.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button
        onClick={onAddEffect}
        disabled={!selectedEffect}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Effect
      </Button>
    </div>
  );
};

export default EffectSelector;
