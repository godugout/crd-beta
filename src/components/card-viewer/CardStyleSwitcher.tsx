
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown, Gem, Clock, Star, X } from 'lucide-react';

interface CardStyleSwitcherProps {
  onSelectStyle: (style: string) => void;
  activeStyle: string | null;
}

const CardStyleSwitcher: React.FC<CardStyleSwitcherProps> = ({ 
  onSelectStyle,
  activeStyle
}) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const cardStyles = [
    { id: 'holographic', name: 'Holographic', icon: <Sparkles size={16} />, description: 'Creates a rainbow holographic effect on the card surface' },
    { id: 'refractor', name: 'Refractor', icon: <Gem size={16} />, description: 'Adds a prismatic refractor pattern with light diffraction' },
    { id: 'shimmer', name: 'Shimmer', icon: <Star size={16} />, description: 'Light shimmer effect that reacts to movement' },
    { id: 'goldFoil', name: 'Gold Foil', icon: <Crown size={16} />, description: 'Adds a premium gold foil effect to card elements' },
    { id: 'vintage', name: 'Vintage', icon: <Clock size={16} />, description: 'Classic vintage filter with aged paper and wear effects' },
  ];

  // Handle style selection
  const selectStyle = (styleId: string) => {
    onSelectStyle(styleId);
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed left-0 top-0 bottom-0 w-80 z-30 bg-gray-900/95 backdrop-blur-sm shadow-xl text-white overflow-y-auto">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Visual Effects</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-gray-800"
          >
            <X size={18} />
          </Button>
        </div>
        
        <p className="text-sm text-gray-400 mb-6">
          Customize visual effects to create unique card presentations. Combine multiple effects for impressive results.
        </p>
        
        <div className="space-y-4">
          {cardStyles.map((style) => (
            <div 
              key={style.id}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                activeStyle === style.id 
                  ? 'bg-blue-900/40 border border-blue-500/50' 
                  : 'bg-gray-800/40 hover:bg-gray-800'
              }`}
              onClick={() => selectStyle(style.id)}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeStyle === style.id ? 'bg-blue-500' : 'bg-gray-700'
                }`}>
                  {style.icon}
                </div>
                <span className="font-medium">{style.name}</span>
              </div>
              <p className="text-sm text-gray-400 ml-11">{style.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Effects render differently based on card type and lighting conditions.
          </p>
          <p className="text-xs text-gray-500">
            More effects can be unlocked in the premium version.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardStyleSwitcher;
