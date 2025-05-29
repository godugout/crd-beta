
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
  onOpenCustomizePanel = () => {}
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto z-20">
        {/* Left side - Back button and card info */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/60"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2">
            <h1 className="text-white font-semibold">{card.title}</h1>
            {card.description && (
              <p className="text-white/70 text-sm">{card.description}</p>
            )}
          </div>
        </div>

        {/* Right side - Environment selector and settings */}
        <div className="flex items-center gap-2">
          {/* Scenes Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenScenesPanel}
            className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/60"
          >
            <Palette className="h-5 w-5" />
          </Button>

          {/* Settings Button */}
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

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto z-20">
        <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-6 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onFlip}
              className="text-white hover:bg-white/10 h-10 w-10"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <div className="h-6 w-px bg-white/20" />

            <Button
              variant="ghost"
              size="icon"
              onClick={onLike}
              className="text-white hover:bg-white/10 h-10 w-10"
            >
              <Heart className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onBookmark}
              className="text-white hover:bg-white/10 h-10 w-10"
            >
              <Bookmark className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              className="text-white hover:bg-white/10 h-10 w-10"
            >
              <Share2 className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onDownload}
              className="text-white hover:bg-white/10 h-10 w-10"
            >
              <Download className="h-5 w-5" />
            </Button>

            <div className="h-6 w-px bg-white/20" />

            <Button
              variant="ghost"
              onClick={onRemix}
              className="text-white hover:bg-white/10 px-4 py-2"
            >
              Remix
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveViewerInterface;
