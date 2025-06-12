
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Eye, RotateCcw, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        {/* Zoom Control */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm flex items-center gap-2">
            <ZoomIn className="h-3 w-3" />
            Zoom Level: {zoomLevel}%
          </Label>
          <Slider
            value={[zoomLevel]}
            onValueChange={(value) => onZoomChange(value[0])}
            min={50}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">View Mode</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={viewMode === '3d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => viewMode === '2d' && onViewModeToggle()}
              className={cn(
                viewMode === '3d' 
                  ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-yellow-400" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
              )}
            >
              3D View
            </Button>
            <Button
              variant={viewMode === '2d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => viewMode === '3d' && onViewModeToggle()}
              className={cn(
                viewMode === '2d' 
                  ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-yellow-400" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
              )}
            >
              2D View
            </Button>
          </div>
        </div>

        {/* Auto Rotate */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Auto Rotation</Label>
          <div className="flex items-center gap-3">
            <Switch
              checked={autoRotate}
              onCheckedChange={onAutoRotateToggle}
              className="data-[state=checked]:bg-[#EFB21E]"
            />
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <RotateCcw className="h-3 w-3" />
              {autoRotate ? 'Rotating' : 'Static'}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 leading-relaxed">
          Adjust how you view your Oakland A's memory card. Use 3D mode for interactive viewing or 2D for a flat preview.
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ViewControlsSection;
