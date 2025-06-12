
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Eye,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ViewControlsSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  viewMode: '3d' | '2d';
  onViewModeToggle: () => void;
  autoRotate: boolean;
  onAutoRotateToggle: () => void;
}

const ViewControlsSection: React.FC<ViewControlsSectionProps> = ({
  isOpen,
  onOpenChange,
  zoomLevel,
  onZoomChange,
  viewMode,
  onViewModeToggle,
  autoRotate,
  onAutoRotateToggle
}) => {
  const handleZoomIn = () => onZoomChange(Math.min(zoomLevel + 25, 200));
  const handleZoomOut = () => onZoomChange(Math.max(zoomLevel - 25, 50));
  const handleReset = () => {
    onZoomChange(100);
    if (autoRotate) onAutoRotateToggle();
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Controls
          </div>
          <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        {/* Zoom Controls */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Zoom Level</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Badge variant="secondary" className="px-3 min-w-[60px] text-center bg-gray-800 text-gray-200">
              {zoomLevel}%
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">View Mode</Label>
          <Button
            onClick={onViewModeToggle}
            className={cn(
              "w-full justify-start",
              viewMode === '3d' 
                ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-[#EFB21E]/90"
                : "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
            )}
            variant={viewMode === '3d' ? "default" : "outline"}
          >
            <Eye className="h-4 w-4 mr-2" />
            {viewMode.toUpperCase()} View
          </Button>
        </div>

        {/* Auto Rotate (3D only) */}
        {viewMode === '3d' && (
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">Animation</Label>
            <Button
              onClick={onAutoRotateToggle}
              className={cn(
                "w-full justify-start",
                autoRotate 
                  ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-[#EFB21E]/90"
                  : "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
              )}
              variant={autoRotate ? "default" : "outline"}
            >
              {autoRotate ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              Auto Rotate
            </Button>
          </div>
        )}

        {/* Reset Button */}
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset View
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ViewControlsSection;
