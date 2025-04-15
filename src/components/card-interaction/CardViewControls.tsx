
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  Lock,
  LockOpen,
  RefreshCw,
  Share,
  Camera,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface CardViewControlsProps {
  onReset: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotateClockwise?: () => void;
  onToggleRotationLock?: () => void;
  onToggleAutoRotate?: () => void;
  onScreenshot?: () => void;
  onShare?: () => void;
  className?: string;
  defaultZoom?: number;
  maxZoom?: number;
  minZoom?: number;
  isRotationLocked?: boolean;
  isAutoRotating?: boolean;
  vertical?: boolean;
}

export const CardViewControls: React.FC<CardViewControlsProps> = ({
  onReset,
  onZoomIn,
  onZoomOut,
  onRotateClockwise,
  onToggleRotationLock,
  onToggleAutoRotate,
  onScreenshot,
  onShare,
  className,
  defaultZoom = 1,
  maxZoom = 2,
  minZoom = 0.5,
  isRotationLocked = false,
  isAutoRotating = false,
  vertical = false,
}) => {
  const [zoom, setZoom] = useState(defaultZoom);
  
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + 0.1, maxZoom);
    setZoom(newZoom);
    onZoomIn?.();
  }, [zoom, maxZoom, onZoomIn]);
  
  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - 0.1, minZoom);
    setZoom(newZoom);
    onZoomOut?.();
  }, [zoom, minZoom, onZoomOut]);

  const containerClass = vertical
    ? "flex flex-col space-y-2"
    : "flex flex-row space-x-2";

  return (
    <TooltipProvider>
      <div className={cn("card-view-controls", containerClass, className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm"
              onClick={onReset}
            >
              <Home className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset View</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm"
              onClick={handleZoomIn}
              disabled={zoom >= maxZoom}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm"
              onClick={handleZoomOut}
              disabled={zoom <= minZoom}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>
        
        {onRotateClockwise && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 backdrop-blur-sm"
                onClick={onRotateClockwise}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rotate</TooltipContent>
          </Tooltip>
        )}
        
        {onToggleRotationLock && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn("bg-white/80 backdrop-blur-sm", isRotationLocked && "bg-blue-100")}
                onClick={onToggleRotationLock}
              >
                {isRotationLocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <LockOpen className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRotationLocked ? "Unlock Rotation" : "Lock Rotation"}
            </TooltipContent>
          </Tooltip>
        )}
        
        {onToggleAutoRotate && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn("bg-white/80 backdrop-blur-sm", isAutoRotating && "bg-blue-100")}
                onClick={onToggleAutoRotate}
              >
                <RefreshCw className={cn("h-4 w-4", isAutoRotating && "animate-spin")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isAutoRotating ? "Stop Auto-Rotate" : "Start Auto-Rotate"}
            </TooltipContent>
          </Tooltip>
        )}
        
        {onScreenshot && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 backdrop-blur-sm"
                onClick={onScreenshot}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Take Screenshot</TooltipContent>
          </Tooltip>
        )}
        
        {onShare && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 backdrop-blur-sm"
                onClick={onShare}
              >
                <Share className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default CardViewControls;
