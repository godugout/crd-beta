
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import './FabricSwatchEffects.css';

export interface FabricSwatchProps {
  fabricType: string;
  year?: string;
  team?: string;
  manufacturer?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size?: 'small' | 'medium' | 'large';
  rotation?: number;
  className?: string;
}

const FabricSwatch: React.FC<FabricSwatchProps> = ({
  fabricType,
  year = '2023',
  team = 'default',
  manufacturer = 'standard',
  position = 'bottom-right',
  size = 'medium',
  rotation = 0,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Map size to actual dimensions
  const sizeMap = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };
  
  // Map position to CSS classes
  const positionMap = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };
  
  // Determine fabric texture class based on type, team, and manufacturer
  const getFabricClass = () => {
    // Base fabric class
    let fabricClass = `fabric-${fabricType.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Add team-specific class if available
    if (team !== 'default') {
      fabricClass += ` team-${team.toLowerCase().replace(/\s+/g, '-')}`;
    }
    
    // Add manufacturer-specific class if available
    if (manufacturer !== 'standard') {
      fabricClass += ` manufacturer-${manufacturer.toLowerCase().replace(/\s+/g, '-')}`;
    }
    
    // Add era-specific class
    const era = parseInt(year) < 1980 ? 'vintage' : 
               parseInt(year) < 2000 ? 'classic' : 'modern';
    fabricClass += ` era-${era}`;
    
    return fabricClass;
  };
  
  return (
    <div 
      className={cn(
        'absolute z-10 rounded-md shadow-lg transition-transform duration-300 overflow-hidden',
        positionMap[position],
        sizeMap[size],
        isHovered && 'scale-110',
        className
      )}
      style={{ 
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          'w-full h-full relative fabric-swatch',
          getFabricClass()
        )}
      >
        {/* Fabric texture */}
        <div className="absolute inset-0 fabric-texture"></div>
        
        {/* Fabric threads/stitching overlay */}
        <div className="absolute inset-0 fabric-stitching"></div>
        
        {/* Wear and tear effect */}
        <div className="absolute inset-0 fabric-wear"></div>
        
        {/* Manufacturer logo watermark if applicable */}
        {manufacturer !== 'standard' && (
          <div className="absolute bottom-1 right-1 text-[6px] opacity-50 fabric-logo">
            {manufacturer.substring(0, 1)}
          </div>
        )}
        
        {/* Teams emblem subtle watermark if applicable */}
        {team !== 'default' && (
          <div className="absolute top-1 left-1 w-3 h-3 opacity-30 fabric-team-logo"></div>
        )}
        
        {/* Edge effect to look like a real swatch */}
        <div className="absolute inset-0 fabric-edge"></div>
      </div>
    </div>
  );
};

export default FabricSwatch;
