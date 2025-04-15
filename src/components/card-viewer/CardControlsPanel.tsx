
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Camera, KeyboardIcon, Grid3X3, RefreshCw, FlipHorizontal } from 'lucide-react';

interface CardControlsPanelProps {
  isFlipped: boolean;
  onFlip: () => void;
  effects: string[];
  onToggleEffect: (effect: string) => void;
  onShowKeyboardShortcuts: () => void;
  backgroundStyle: 'grid' | 'shop' | 'minimal';
  onCycleBackground: () => void;
  onTakeScreenshot: () => void;
}

const CardControlsPanel: React.FC<CardControlsPanelProps> = ({
  isFlipped,
  onFlip,
  effects,
  onToggleEffect,
  onShowKeyboardShortcuts,
  backgroundStyle,
  onCycleBackground,
  onTakeScreenshot
}) => {
  return (
    <div className="bg-black/50 backdrop-blur-sm text-white rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20" 
            onClick={onFlip}
          >
            <FlipHorizontal className="h-4 w-4 mr-2" />
            {isFlipped ? 'Show Front' : 'Show Back'}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20" 
            onClick={onCycleBackground}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Background
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20" 
            onClick={onTakeScreenshot}
          >
            <Camera className="h-4 w-4 mr-2" />
            Snapshot
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20" 
            onClick={onShowKeyboardShortcuts}
          >
            <KeyboardIcon className="h-4 w-4 mr-2" />
            Shortcuts
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {['holographic', 'refractor', 'shimmer', 'gold', 'vintage', 'chrome'].map(effect => (
          <Button
            key={effect}
            variant={effects.includes(effect) ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleEffect(effect)}
            className={effects.includes(effect) 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-black/40 border-white/20 text-white hover:bg-white/20"}
          >
            {effect.charAt(0).toUpperCase() + effect.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CardControlsPanel;
