
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  RotateCw,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Lock,
  Unlock,
  Camera,
  Share2,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

export interface CardViewControlsProps {
  className?: string;
  onReset: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onToggleRotationLock: () => void;
  onToggleAutoRotate: () => void;
  onScreenshot: () => void;
  onShare: () => void;
  isRotationLocked: boolean;
  isAutoRotating: boolean;
  isZoomAvailable?: boolean;
  zoomLevel?: number;
  maxZoom?: number;
  minZoom?: number;
  vertical?: boolean;
}

export const CardViewControls: React.FC<CardViewControlsProps> = ({
  className,
  onReset,
  onZoomIn,
  onZoomOut,
  onToggleRotationLock,
  onToggleAutoRotate,
  onScreenshot,
  onShare,
  isRotationLocked,
  isAutoRotating,
  isZoomAvailable = true,
  zoomLevel = 1,
  maxZoom = 2.5,
  minZoom = 0.5,
  vertical = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleScreenshot = () => {
    onScreenshot();
    toast.success('Screenshot captured!', {
      description: 'Image saved to your gallery'
    });
  };
  
  const handleShare = () => {
    onShare();
    toast.success('Card ready to share', {
      description: 'Share menu opened'
    });
  };
  
  const isZoomInDisabled = zoomLevel >= maxZoom;
  const isZoomOutDisabled = zoomLevel <= minZoom;
  
  return (
    <TooltipProvider delayDuration={300}>
      <div 
        className={cn(
          "card-view-controls transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          vertical 
            ? "flex flex-col items-center justify-center space-y-2 p-2" 
            : "flex items-center justify-center space-x-2 p-2",
          "backdrop-blur-md bg-background/80 rounded-lg border shadow-sm",
          className
        )}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setTimeout(() => setIsVisible(false), 2000)}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onReset}
              className="h-8 w-8"
              aria-label="Reset card position"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset position</TooltipContent>
        </Tooltip>
        
        {isZoomAvailable && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onZoomIn}
                  disabled={isZoomInDisabled}
                  className="h-8 w-8"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onZoomOut}
                  disabled={isZoomOutDisabled}
                  className="h-8 w-8"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>
          </>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleRotationLock}
              className={cn(
                "h-8 w-8",
                isRotationLocked && "bg-muted"
              )}
              aria-label={isRotationLocked ? "Unlock rotation" : "Lock rotation"}
            >
              {isRotationLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isRotationLocked ? "Unlock rotation" : "Lock rotation"}</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleAutoRotate}
              className={cn(
                "h-8 w-8",
                isAutoRotating && "bg-muted"
              )}
              aria-label={isAutoRotating ? "Stop auto-rotate" : "Start auto-rotate"}
            >
              {isAutoRotating ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isAutoRotating ? "Stop auto-rotate" : "Start auto-rotate"}</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleScreenshot}
              className="h-8 w-8"
              aria-label="Take screenshot"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Screenshot</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-8 w-8"
              aria-label="Share card"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default CardViewControls;
