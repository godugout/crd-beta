
import React from 'react';
import { Card } from '@/lib/types';
import { ArrowLeft, Share, Download, Heart, Bookmark, Settings, RotateCcw, Remix } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImmersiveViewerInterfaceProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  onBack: () => void;
  onShare: () => void;
  onDownload: () => void;
  onLike: () => void;
  onBookmark: () => void;
  onRemix: () => void;
  isCustomizationOpen: boolean;
  onToggleCustomization: () => void;
}

const ImmersiveViewerInterface: React.FC<ImmersiveViewerInterfaceProps> = ({
  card,
  isFlipped,
  onFlip,
  onBack,
  onShare,
  onDownload,
  onLike,
  onBookmark,
  onRemix,
  isCustomizationOpen,
  onToggleCustomization
}) => {
  return (
    <>
      {/* Top Navigation Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemix}
            className="bg-purple-600/80 backdrop-blur-sm text-white hover:bg-purple-700/80"
          >
            <Remix className="h-4 w-4 mr-2" />
            Remix
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCustomization}
            className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onFlip}
            className="text-white hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {isFlipped ? 'Show Front' : 'Show Back'}
          </Button>
        </div>
      </div>

      {/* Card Info */}
      <div className="absolute top-16 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white max-w-xs z-10">
        <h2 className="font-bold text-lg">{card.title}</h2>
        {card.player && <p className="text-sm opacity-80">{card.player}</p>}
        {card.team && <p className="text-xs opacity-60">{card.team}</p>}
      </div>
    </>
  );
};

export default ImmersiveViewerInterface;
