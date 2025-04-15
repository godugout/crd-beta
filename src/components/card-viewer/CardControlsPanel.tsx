
import React from 'react';
import { Button } from '@/components/ui/button';
import { FlipHorizontal, Camera, KeyboardIcon, RefreshCw, LayoutGrid } from 'lucide-react';

interface CardControlsPanelProps {
  isFlipped: boolean;
  onFlip: () => void;
  effects: string[];
  onToggleEffect: (effect: string) => void;
  onShowKeyboardShortcuts: () => void;
  backgroundStyle: 'grid' | 'shop' | 'minimal';
  onCycleBackground: () => void;
}

const CardControlsPanel: React.FC<CardControlsPanelProps> = ({
  isFlipped,
  onFlip,
  effects,
  onToggleEffect,
  onShowKeyboardShortcuts,
  backgroundStyle,
  onCycleBackground
}) => {
  const takeScreenshot = () => {
    // In a real implementation, this would capture the current card view
    // For now, we'll just show a notification
    console.log('Screenshot captured');
    
    // Using browser API to simulate a download
    const link = document.createElement('a');
    link.download = 'card-screenshot.png';
    // In a real implementation, this would be the actual image data
    link.href = '#';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm">Drag to rotate • Click to flip</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10" 
              onClick={onFlip}
            >
              <FlipHorizontal className="h-4 w-4 mr-1" />
              Flip
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={takeScreenshot}
            >
              <Camera className="h-4 w-4 mr-1" />
              Screenshot
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={onCycleBackground}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              {backgroundStyle === 'grid' ? 'Grid' : backgroundStyle === 'shop' ? 'Shop' : 'Minimal'}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={onShowKeyboardShortcuts}
            >
              <KeyboardIcon className="h-4 w-4 mr-1" />
              Controls
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'holographic', label: 'Holographic' },
            { id: 'refractor', label: 'Refractor' },
            { id: 'shimmer', label: 'Shimmer' },
            { id: 'gold', label: 'Gold Foil' },
            { id: 'chrome', label: 'Chrome' },
            { id: 'vintage', label: 'Vintage' }
          ].map((effect) => (
            <Button
              key={effect.id}
              variant={effects.includes(effect.id) ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleEffect(effect.id)}
              className={effects.includes(effect.id) 
                ? "bg-blue-600 text-white border-transparent" 
                : "bg-black/20 border-white/20 text-white hover:bg-black/40"}
            >
              {effect.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardControlsPanel;
