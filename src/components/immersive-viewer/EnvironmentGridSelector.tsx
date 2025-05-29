
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EnvironmentGridSelectorProps {
  environmentType: string;
  onEnvironmentChange: (environment: string) => void;
}

const environments = [
  { value: 'studio', label: 'Photo Studio', description: 'Professional photography setup', icon: '🎬' },
  { value: 'gallery', label: 'Art Gallery', description: 'Museum exhibition space', icon: '🏛️' },
  { value: 'stadium', label: 'Sports Stadium', description: 'Athletic arena with floodlights', icon: '🏟️' },
  { value: 'twilight', label: 'Twilight Road', description: 'Evening countryside highway', icon: '🌅' },
  { value: 'quarry', label: 'Stone Quarry', description: 'Industrial mining landscape', icon: '⛰️' },
  { value: 'coastline', label: 'Ocean Coastline', description: 'Seaside cliff with sunset', icon: '🌊' },
  { value: 'hillside', label: 'Forest Hillside', description: 'Wooded mountain slope', icon: '🌲' },
  { value: 'milkyway', label: 'Milky Way', description: 'Starry night sky panorama', icon: '🌌' },
  { value: 'esplanade', label: 'Royal Esplanade', description: 'Elegant palace courtyard', icon: '✨' },
  { value: 'neonclub', label: 'Neon Studio', description: 'Vibrant neon-lit interior', icon: '🌆' },
  { value: 'industrial', label: 'Industrial Workshop', description: 'Factory foundry environment', icon: '🏭' },
];

const EnvironmentGridSelector: React.FC<EnvironmentGridSelectorProps> = ({
  environmentType,
  onEnvironmentChange
}) => {
  return (
    <div className="h-full p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-white mb-2">Scene Environment</h3>
        <p className="text-sm text-gray-300">Choose the perfect environment to showcase your card</p>
      </div>
      
      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="grid grid-cols-2 gap-3 pr-2">
          {environments.map((env) => (
            <div
              key={env.value}
              onClick={() => onEnvironmentChange(env.value)}
              className={`
                relative p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${environmentType === env.value 
                  ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/20' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                }
              `}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <span className="text-2xl">{env.icon}</span>
                <div>
                  <div className="font-medium text-white text-sm">{env.label}</div>
                  <div className="text-xs text-gray-300 leading-tight">{env.description}</div>
                </div>
              </div>
              
              {environmentType === env.value && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EnvironmentGridSelector;
