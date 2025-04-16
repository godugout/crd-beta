
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  RotateCcw, 
  Sparkles, 
  RefreshCw, 
  ChevronLeft,
  Maximize2, 
  Minimize2,
  Camera,
  Share2,
  Palette,
  Layers
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CardToolbarProps {
  activePanel: string | null;
  onAction: (action: string) => void;
  fullscreen?: boolean;
}

const CardToolbar: React.FC<CardToolbarProps> = ({ 
  activePanel, 
  onAction,
  fullscreen = false
}) => {
  const tools = [
    {
      id: 'back',
      label: 'Back',
      icon: <ChevronLeft size={18} />,
      showOnlyInFullscreen: true
    },
    {
      id: 'flip',
      label: 'Flip Card',
      icon: <RefreshCw size={18} />
    },
    {
      id: 'reset',
      label: 'Reset View',
      icon: <RotateCcw size={18} />
    },
    {
      id: 'effects',
      label: 'Card Effects',
      icon: <Sparkles size={18} />,
      active: activePanel === 'effects'
    },
    {
      id: 'fullscreen',
      label: fullscreen ? 'Exit Fullscreen' : 'Fullscreen',
      icon: fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />,
      className: 'ml-auto'
    }
  ];

  return (
    <div className="p-2 bg-black/30 backdrop-blur-sm z-10 flex items-center">
      {tools.map(tool => {
        // Skip tools that should only show in fullscreen if not in fullscreen mode
        if (tool.showOnlyInFullscreen && !fullscreen) return null;
        
        return (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={tool.active ? "default" : "ghost"}
                size="sm"
                className={`text-white ${tool.className || ''}`}
                onClick={() => onAction(tool.id)}
              >
                {tool.icon}
                {!fullscreen && tool.id !== 'fullscreen' && (
                  <span className="ml-2 hidden sm:inline">{tool.label}</span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {tool.label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default CardToolbar;
