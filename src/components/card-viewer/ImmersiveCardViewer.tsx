import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CardData } from '@/types/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RotateCw, Maximize2, Minimize2, Download, Share2 } from 'lucide-react';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useHotkeys } from 'react-hotkeys-hook';
import { useScreenshot } from 'use-react-screenshot';
import { showToast } from '@/lib/adapters/toastAdapter';
import CardCanvas from './CardCanvas';
import ShareDialog from '@/components/ShareDialog';

interface ImmersiveCardViewerProps {
  card: CardData;
  className?: string;
  debug?: boolean;
  effectSettings?: {
    refractorIntensity?: number;
    refractorColors?: string[];
    animationEnabled?: boolean;
    refractorSpeed?: number;
    refractorAngle?: number;
    holographicIntensity?: number;
    holographicPattern?: 'linear' | 'circular' | 'angular' | 'geometric';
    holographicColorMode?: 'rainbow' | 'blue-purple' | 'gold-green' | 'custom';
    holographicCustomColors?: string[];
    holographicSparklesEnabled?: boolean;
    holographicBorderWidth?: number;
  };
}

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  className = '',
  debug = false,
  effectSettings = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const screenshotRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const windowSize = useWindowSize();
  const [rotation, setRotation] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Screenshot functionality
  const [image, takeScreenshot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });

  // Toggle effects
  const toggleEffect = (effect: string) => {
    setActiveEffects(prev =>
      prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
    );
  };

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  // Mouse leave handler
  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Fullscreen toggle
  const toggleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    }
    setIsFullScreen(!isFullScreen);
  };

  // Card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    showToast({
      title: "Card rotated",
      description: "The card has been rotated to the back side",
      variant: "default",
      duration: 2000
    });
  };

  // Hotkeys
  useHotkeys('f', handleFlip, { enableOnTags: 'INPUT,SELECT,TEXTAREA' });
  useHotkeys('shift+f', toggleFullScreen, { enableOnTags: 'INPUT,SELECT,TEXTAREA' });

  // Screenshot and download
  const downloadScreenshot = async () => {
    setIsDownloading(true);
    try {
      const screenShot = await takeScreenshot(screenshotRef.current);
      if (screenShot) {
        const downloadLink = document.createElement("a");
        downloadLink.href = screenShot;
        downloadLink.download = `${card.title}-card.jpeg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        showToast({
          title: "Screenshot Downloaded",
          description: "The screenshot has been downloaded successfully.",
          duration: 3000,
        });
      } else {
        showToast({
          title: "Screenshot Failed",
          description: "Failed to take the screenshot.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error downloading screenshot:", error);
      showToast({
        title: "Download Error",
        description: "An error occurred while downloading the screenshot.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Share dialog
  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  // Detect touch
  useEffect(() => {
    const handleTouch = () => {
      setIsTouch(true);
    };

    window.addEventListener('touchstart', handleTouch, { once: true });

    return () => {
      window.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
    >
      {/* Card Viewer */}
      <div
        ref={screenshotRef}
        className="relative w-full h-full"
        style={{
          maxWidth: 'min(80vh, 600px)',
          maxHeight: 'calc(min(80vh, 600px) * 1.4)',
          margin: '0 auto',
          perspective: '1000px',
        }}
      >
        <CardCanvas
          card={card}
          isFlipped={isFlipped}
          activeEffects={activeEffects}
          containerRef={containerRef}
          cardRef={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          effectSettings={effectSettings}
          debug={debug}
        />
      </div>

      {/* Controls */}
      <div className="absolute top-2 left-2 flex space-x-2 z-10">
        <Button variant="outline" size="icon" onClick={handleFlip} aria-label="Flip Card">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={toggleFullScreen} aria-label="Toggle Fullscreen">
          {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <Button variant="outline" size="icon" onClick={downloadScreenshot} disabled={isDownloading} aria-label="Download Card">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share Card">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Effect Toggles */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-center space-x-2 z-10">
        <Button
          variant={activeEffects.includes('Refractor') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleEffect('Refractor')}
        >
          Refractor
        </Button>
        <Button
          variant={activeEffects.includes('Holographic') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleEffect('Holographic')}
        >
          Holographic
        </Button>
        <Button
          variant={activeEffects.includes('Gold Foil') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleEffect('Gold Foil')}
        >
          Gold Foil
        </Button>
      </div>

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        title={card.title}
        url={window.location.href}
        imageUrl={card.imageUrl}
      />
    </div>
  );
};

export default ImmersiveCardViewer;
