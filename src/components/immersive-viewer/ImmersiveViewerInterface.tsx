
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Heart, 
  Bookmark, 
  RotateCcw, 
  Settings,
  Palette
} from 'lucide-react';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import CollapsibleInfoPanel from './CollapsibleInfoPanel';

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
  environmentType?: string;
  onEnvironmentChange?: (environment: string) => void;
  onOpenScenesPanel?: () => void;
  onOpenCustomizePanel?: () => void;
  activeEffects?: string[];
  lightingSettings?: any;
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
  onToggleCustomization,
  environmentType = 'studio',
  onEnvironmentChange = () => {},
  onOpenScenesPanel = () => {},
  onOpenCustomizePanel = () => {},
  activeEffects = [],
  lightingSettings
}) => {
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Bar - Simplified */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto z-20">
        {/* Left side - Back button only */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/60"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Right side - Settings controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenScenesPanel}
            className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/60"
          >
            <Palette className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenCustomizePanel}
            className={`bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/60 ${
              isCustomizationOpen ? 'bg-white/20' : ''
            }`}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Action Bar - Shorter and cleaner */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-auto z-20">
        <div className="flex flex-col items-center">
          {/* Collapsible Info Panel */}
          <CollapsibleInfoPanel
            isExpanded={isInfoExpanded}
            onToggle={() => setIsInfoExpanded(!isInfoExpanded)}
            environmentType={environmentType}
            activeEffects={activeEffects}
            lightingSettings={lightingSettings}
          />

          {/* Main Action Bar - More compact */}
          <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-t-2xl px-4 py-2">
            <div className="flex items-center gap-3">
              {/* Flip Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onFlip}
                className="text-white hover:bg-white/10 h-8 w-8"
                title={isFlipped ? 'Show Front' : 'Show Back'}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <div className="h-4 w-px bg-white/20" />

              {/* Social Actions */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onLike}
                className="text-white hover:bg-white/10 h-8 w-8"
                title="Like"
              >
                <Heart className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onBookmark}
                className="text-white hover:bg-white/10 h-8 w-8"
                title="Bookmark"
              >
                <Bookmark className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onShare}
                className="text-white hover:bg-white/10 h-8 w-8"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onDownload}
                className="text-white hover:bg-white/10 h-8 w-8"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>

              <div className="h-4 w-px bg-white/20" />

              {/* Remix Button */}
              <Button
                variant="ghost"
                onClick={onRemix}
                className="text-white hover:bg-white/10 px-3 py-1 text-sm"
              >
                Remix
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveViewerInterface;
