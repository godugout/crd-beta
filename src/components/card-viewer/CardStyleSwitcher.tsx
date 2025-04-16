
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown, Gem, Clock, Star } from 'lucide-react';
import { toast } from 'sonner';

interface CardStyleSwitcherProps {
  onSelectStyle: (style: string) => void;
  activeStyle: string | null;
}

const CardStyleSwitcher: React.FC<CardStyleSwitcherProps> = ({ 
  onSelectStyle,
  activeStyle
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const cardStyles = [
    { id: 'holographic', name: 'Holographic', icon: <Sparkles size={16} /> },
    { id: 'refractor', name: 'Refractor', icon: <Gem size={16} /> },
    { id: 'goldFoil', name: 'Gold Foil', icon: <Crown size={16} /> },
    { id: 'vintage', name: 'Vintage', icon: <Clock size={16} /> },
    { id: 'prismatic', name: 'Prismatic', icon: <Star size={16} /> },
  ];

  // Handle style selection
  const selectStyle = (styleId: string) => {
    onSelectStyle(styleId);
    toast.success(`Applied ${styleId} style`);
  };
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        {expanded ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {cardStyles.map((style) => (
              <Button
                key={style.id}
                size="sm"
                variant={activeStyle === style.id ? "default" : "secondary"}
                onClick={() => selectStyle(style.id)}
                className={`flex items-center space-x-1 ${activeStyle === style.id ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                {style.icon}
                <span className="ml-1">{style.name}</span>
              </Button>
            ))}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setExpanded(false)}
              className="ml-2 bg-gray-800 text-white"
            >
              Hide
            </Button>
          </div>
        ) : (
          <Button 
            size="sm"
            variant="ghost"
            onClick={() => setExpanded(true)}
            className="text-white flex items-center bg-black/50 hover:bg-black/70"
          >
            <Sparkles size={16} className="mr-2" />
            <span>Visual Styles</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardStyleSwitcher;
