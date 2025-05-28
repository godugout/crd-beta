
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Palette } from 'lucide-react';

interface EnvironmentSelectorProps {
  environmentType: string;
  onEnvironmentChange: (environment: string) => void;
}

const environments = [
  { value: 'studio', label: 'Professional Studio', description: 'Clean, bright lighting' },
  { value: 'gallery', label: 'Art Gallery', description: 'Museum-quality spotlights' },
  { value: 'stadium', label: 'Sports Stadium', description: 'Dramatic arena lighting' },
  { value: 'cosmic', label: 'Cosmic Space', description: 'Deep space with stars' },
  { value: 'underwater', label: 'Underwater Scene', description: 'Ocean depths with caustics' },
  { value: 'night', label: 'Night Sky', description: 'Starlit evening atmosphere' },
  { value: 'forest', label: 'Forest Clearing', description: 'Natural dappled sunlight' },
  { value: 'cardshop', label: 'Retro Arcade', description: 'Neon lights and colors' },
];

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  environmentType,
  onEnvironmentChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Palette className="h-4 w-4 text-white/70" />
      <Select value={environmentType} onValueChange={onEnvironmentChange}>
        <SelectTrigger className="w-[200px] bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/60 focus:ring-white/30">
          <SelectValue placeholder="Select environment" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 text-white z-[100]">
          {environments.map((env) => (
            <SelectItem 
              key={env.value} 
              value={env.value}
              className="focus:bg-white/10 focus:text-white hover:bg-white/10 cursor-pointer"
            >
              <div>
                <div className="font-medium">{env.label}</div>
                <div className="text-xs text-white/60">{env.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EnvironmentSelector;
