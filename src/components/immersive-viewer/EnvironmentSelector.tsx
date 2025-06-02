
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
  { value: 'studio', label: 'Photo Studio', description: 'Professional photography setup with controlled lighting', icon: '🎬' },
  { value: 'gallery', label: 'Art Gallery', description: 'Museum exhibition space with gallery lighting', icon: '🏛️' },
  { value: 'stadium', label: 'Sports Stadium', description: 'Athletic arena with bright floodlights', icon: '🏟️' },
  { value: 'twilight', label: 'Twilight Road', description: 'Evening countryside highway at golden hour', icon: '🌅' },
  { value: 'quarry', label: 'Stone Quarry', description: 'Industrial mining landscape with dramatic lighting', icon: '⛰️' },
  { value: 'coastline', label: 'Ocean Coastline', description: 'Seaside cliff with warm sunset lighting', icon: '🌊' },
  { value: 'hillside', label: 'Forest Hillside', description: 'Wooded mountain slope with natural light', icon: '🌲' },
  { value: 'milkyway', label: 'Starry Night', description: 'Night sky with stars and cosmic lighting', icon: '🌌' },
  { value: 'esplanade', label: 'Royal Esplanade', description: 'Elegant palace courtyard with ambient lighting', icon: '✨' },
  { value: 'neonclub', label: 'Cyberpunk Club', description: 'Futuristic neon-lit interior space', icon: '🌆' },
  { value: 'industrial', label: 'Industrial Workshop', description: 'Factory foundry with dramatic industrial lighting', icon: '🏭' },
];

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  environmentType,
  onEnvironmentChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Palette className="h-4 w-4 text-white/70" />
      <Select value={environmentType} onValueChange={onEnvironmentChange}>
        <SelectTrigger className="w-[220px] bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/60 focus:ring-white/30">
          <SelectValue placeholder="Select environment" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 text-white z-[100]">
          {environments.map((env) => (
            <SelectItem 
              key={env.value} 
              value={env.value}
              className="focus:bg-white/10 focus:text-white hover:bg-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{env.icon}</span>
                <div>
                  <div className="font-medium">{env.label}</div>
                  <div className="text-xs text-white/60">{env.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EnvironmentSelector;
