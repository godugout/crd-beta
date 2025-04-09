
import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '@/context/CardContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export interface MemoryPacksSectionProps {
  isLoading: boolean;
  packs: Collection[];
  handleViewPack: (packId: string) => void;
  teamColor?: string; // New prop for team-specific styling
}

const MemoryPacksSection: React.FC<MemoryPacksSectionProps> = ({
  isLoading,
  packs,
  handleViewPack,
  teamColor
}) => {
  if (isLoading) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">Memory Packs</h2>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      </section>
    );
  }
  
  if (packs.length === 0) {
    return null; // Don't show this section if no memory packs
  }
  
  // If a team color is provided, use it for gradient backgrounds
  const gradientStart = teamColor || '#3b82f6'; // Default blue if no team color
  const gradientEnd = adjustColorBrightness(teamColor || '#3b82f6', 40); // Lighter version
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Memory Packs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packs.map(pack => (
          <Link 
            key={pack.id} 
            to={`/packs/${pack.id}`}
            className="rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-blue-200"
            style={{
              background: teamColor 
                ? `linear-gradient(to bottom right, ${adjustColorBrightness(teamColor, 90)}, ${adjustColorBrightness(teamColor, 98)})`
                : 'linear-gradient(to bottom right, #f0f9ff, #e6fffa)'
            }}
            onClick={() => handleViewPack(pack.id)}
          >
            <div className="h-48 overflow-hidden">
              {pack.coverImageUrl ? (
                <img 
                  src={pack.coverImageUrl} 
                  alt={pack.name}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ 
                    background: teamColor 
                      ? `linear-gradient(135deg, ${teamColor}, ${adjustColorBrightness(teamColor, 30)})` 
                      : 'linear-gradient(135deg, #3b82f6, #2dd4bf)'
                  }}
                >
                  <span className="text-xl font-medium" style={{ color: getContrastColor(teamColor || '#3b82f6') }}>
                    Memory Pack
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 
                className="font-bold text-lg" 
                style={{ color: teamColor || '#1e40af' }}
              >
                {pack.name}
              </h3>
              {pack.description && (
                <p 
                  className="text-sm mt-1"
                  style={{ color: teamColor ? adjustColorBrightness(teamColor, -30) : '#3b82f6' }}
                >
                  {pack.description}
                </p>
              )}
              <div className="mt-3 inline-block px-3 py-1 rounded-full text-white text-sm"
                style={{ 
                  backgroundColor: teamColor || '#3b82f6',
                  color: getContrastColor(teamColor || '#3b82f6')
                }}
              >
                Explore Pack
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, percent: number): string {
  // Validate hex
  if (!hex || hex === '#') return '#ffffff';
  
  hex = hex.replace(/^\s*#|\s*$/g, '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust brightness
  const adjustR = Math.min(255, Math.max(0, r + (percent / 100) * 255));
  const adjustG = Math.min(255, Math.max(0, g + (percent / 100) * 255));
  const adjustB = Math.min(255, Math.max(0, b + (percent / 100) * 255));
  
  // Convert back to hex
  return '#' + 
    Math.round(adjustR).toString(16).padStart(2, '0') +
    Math.round(adjustG).toString(16).padStart(2, '0') +
    Math.round(adjustB).toString(16).padStart(2, '0');
}

// Helper function to determine contrast color (white or black) for a given background color
const getContrastColor = (hexColor: string): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  
  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export default MemoryPacksSection;
