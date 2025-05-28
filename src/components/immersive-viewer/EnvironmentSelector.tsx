
import React from 'react';

interface EnvironmentSelectorProps {
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

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  environmentType,
  onEnvironmentChange
}) => {
  return (
    <div className="space-y-3">
      {environments.map((env) => (
        <button
          key={env.value}
          onClick={() => onEnvironmentChange(env.value)}
          className={`w-full p-3 rounded-lg border transition-all text-left ${
            environmentType === env.value
              ? 'bg-white/20 border-white/40 text-white'
              : 'bg-black/20 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{env.icon}</span>
            <div className="flex-1">
              <div className="font-medium">{env.label}</div>
              <div className="text-xs opacity-70">{env.description}</div>
            </div>
            {environmentType === env.value && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default EnvironmentSelector;
