
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Settings, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/lib/types';

interface ViewerControlsProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  onBack?: () => void;
  showControls: boolean;
  onToggleControls: () => void;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  card,
  isFlipped,
  onFlip,
  onBack,
  showControls,
  onToggleControls
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      {/* Left Controls */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        
        <div className="bg-black/40 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20">
          <h3 className="text-white font-medium text-sm">{card.title}</h3>
          <p className="text-white/60 text-xs">{card.player || 'Trading Card'}</p>
        </div>
      </div>

      {/* Center Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onFlip}
          className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {isFlipped ? 'Show Front' : 'Show Back'}
        </Button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-black/40 backdrop-blur-md border-white/20">
          3D Viewer
        </Badge>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleControls}
          className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-white/10"
        >
          {showControls ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </motion.div>
  );
};
