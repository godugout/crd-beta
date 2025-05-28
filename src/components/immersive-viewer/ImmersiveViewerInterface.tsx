import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  RotateCcw, 
  Share2, 
  Download, 
  Heart, 
  Bookmark,
  ArrowLeft,
  Maximize2,
  Sun,
  Moon,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ImmersiveViewerInterfaceProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  onBack: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onLike?: () => void;
  onBookmark?: () => void;
  isCustomizationOpen: boolean;
  onToggleCustomization: () => void;
  className?: string;
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
  isCustomizationOpen,
  onToggleCustomization,
  className
}) => {
  const [isUIVisible, setIsUIVisible] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {/* Top Navigation Bar */}
      <AnimatePresence>
        {isUIVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-50 pointer-events-auto"
          >
            <div className="glass-panel mx-4 mt-4 px-6 py-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="hover:bg-white/10 text-white"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  
                  <div className="text-white">
                    <h1 className="text-lg font-semibold">{card.title || 'Untitled Card'}</h1>
                    <p className="text-sm text-white/70">Immersive View</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsUIVisible(!isUIVisible)}
                    className="hover:bg-white/10 text-white"
                  >
                    {isUIVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onShare}
                    className="hover:bg-white/10 text-white"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDownload}
                    className="hover:bg-white/10 text-white"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <AnimatePresence>
        {isUIVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 z-50 pointer-events-auto"
          >
            <div className="flex flex-col items-center space-y-4 mx-4 mb-6">
              {/* Main Actions */}
              <div className="glass-panel px-8 py-4 rounded-2xl">
                <div className="flex items-center space-x-6">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleLike}
                    className={cn(
                      "hover:bg-white/10 text-white transition-colors",
                      isLiked && "text-red-400"
                    )}
                  >
                    <Heart className={cn("h-6 w-6 mr-2", isLiked && "fill-current")} />
                    {isLiked ? 'Liked' : 'Like'}
                  </Button>
                  
                  <CrdButton
                    variant="gradient"
                    size="lg"
                    onClick={onFlip}
                    className="px-8"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    {isFlipped ? 'Show Front' : 'Show Back'}
                  </CrdButton>
                  
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleBookmark}
                    className={cn(
                      "hover:bg-white/10 text-white transition-colors",
                      isBookmarked && "text-yellow-400"
                    )}
                  >
                    <Bookmark className={cn("h-6 w-6 mr-2", isBookmarked && "fill-current")} />
                    {isBookmarked ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
              
              {/* Secondary Actions */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="soft"
                  size="sm"
                  onClick={onToggleCustomization}
                  className={cn(
                    "transition-all",
                    isCustomizationOpen && "bg-white/20"
                  )}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Lighting
                </Button>
                
                <Button
                  variant="soft"
                  size="sm"
                  className="hover:bg-white/15"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Effects
                </Button>
                
                <Button
                  variant="soft"
                  size="sm"
                  className="hover:bg-white/15"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Panel Toggle */}
      <div 
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-40 pointer-events-auto transition-all duration-300",
          isCustomizationOpen ? "right-[380px]" : "right-4"
        )}
      >
        <Button
          variant="soft"
          size="icon"
          onClick={onToggleCustomization}
          className="rounded-full shadow-xl hover:scale-105 transition-transform"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* UI Toggle Button */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-40 pointer-events-auto">
        <Button
          variant="soft"
          size="icon"
          onClick={() => setIsUIVisible(!isUIVisible)}
          className="rounded-full shadow-xl hover:scale-105 transition-transform"
        >
          {isUIVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </Button>
      </div>

      {/* Card Info Overlay */}
      <AnimatePresence>
        {isUIVisible && !isCustomizationOpen && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="absolute top-24 left-4 z-30 pointer-events-auto"
          >
            <div className="glass-panel p-4 rounded-xl max-w-xs">
              <div className="text-white">
                <h3 className="font-semibold text-sm mb-1">{card.title}</h3>
                {card.metadata?.player && (
                  <p className="text-xs text-white/70 mb-1">{card.metadata.player}</p>
                )}
                {card.metadata?.year && (
                  <p className="text-xs text-white/50">{card.metadata.year}</p>
                )}
                {card.metadata?.rarity && (
                  <div className="mt-2">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      card.metadata.rarity === 'legendary' && "bg-yellow-500/20 text-yellow-300",
                      card.metadata.rarity === 'rare' && "bg-purple-500/20 text-purple-300",
                      card.metadata.rarity === 'uncommon' && "bg-blue-500/20 text-blue-300",
                      card.metadata.rarity === 'common' && "bg-gray-500/20 text-gray-300"
                    )}>
                      {card.metadata.rarity}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImmersiveViewerInterface;
