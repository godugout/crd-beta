
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronRight, 
  RotateCcw, 
  FlipHorizontal, 
  Move, 
  RotateCw, 
  Keyboard, 
  MousePointer,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedControlsSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFlipCard: () => void;
  onResetCard: () => void;
  onToggleAutoRotate: () => void;
  onScaleChange: (scale: number) => void;
  onFaceCamera?: () => void;
  onShowBack?: () => void;
  scale: number;
  autoRotate: boolean;
  isFlipped: boolean;
  isFlipping?: boolean;
}

const AdvancedControlsSection: React.FC<AdvancedControlsSectionProps> = ({
  isOpen,
  onOpenChange,
  onFlipCard,
  onResetCard,
  onToggleAutoRotate,
  onScaleChange,
  onFaceCamera,
  onShowBack,
  scale,
  autoRotate,
  isFlipped,
  isFlipping = false
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
          <div className="flex items-center gap-2">
            <Move className="h-4 w-4" />
            3D Card Controls
          </div>
          <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        {/* Card Scale */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Card Scale: {Math.round(scale * 100)}%</Label>
          <Slider
            value={[scale]}
            onValueChange={(value) => onScaleChange(value[0])}
            min={0.3}
            max={2.0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Quick View Presets */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Quick Views</Label>
          <div className="grid grid-cols-2 gap-2">
            {onFaceCamera && (
              <Button
                variant="outline"
                size="sm"
                onClick={onFaceCamera}
                disabled={isFlipping}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                <Eye className="h-3 w-3 mr-1" />
                Front
              </Button>
            )}
            {onShowBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={onShowBack}
                disabled={isFlipping}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                <EyeOff className="h-3 w-3 mr-1" />
                Back
              </Button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onFlipCard}
            disabled={isFlipping}
            className={cn(
              "border-gray-600 text-gray-300 hover:bg-gray-800 transition-all",
              isFlipping && "animate-pulse"
            )}
          >
            <FlipHorizontal className="h-3 w-3 mr-1" />
            {isFlipping ? 'Flipping...' : 'Flip'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetCard}
            disabled={isFlipping}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>

        {/* Auto Rotate */}
        <div className="flex items-center justify-between">
          <Label className="text-gray-300 text-sm">Auto Rotate</Label>
          <Button
            variant={autoRotate ? "default" : "outline"}
            size="sm"
            onClick={onToggleAutoRotate}
            disabled={isFlipping}
            className={cn(
              autoRotate 
                ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-yellow-400" 
                : "border-gray-600 text-gray-300 hover:bg-gray-800",
              isFlipping && "opacity-50"
            )}
          >
            <RotateCw className="h-3 w-3 mr-1" />
            {autoRotate ? 'On' : 'Off'}
          </Button>
        </div>

        {/* Status Indicator */}
        {isFlipping && (
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <FlipHorizontal className="h-4 w-4 animate-spin" />
              Card is flipping...
            </div>
          </div>
        )}

        {/* Enhanced Controls Guide */}
        <div className="bg-gray-800 rounded-lg p-3 space-y-3">
          <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
            <MousePointer className="h-3 w-3" />
            Mouse Controls
          </div>
          <div className="grid grid-cols-1 gap-1 text-xs text-gray-400">
            <div>• Drag: Rotate card in 3D</div>
            <div>• Enhanced sensitivity & responsiveness</div>
            <div>• Visual cursor feedback</div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
            <Keyboard className="h-3 w-3" />
            Keyboard Shortcuts
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
            <div>F: Flip card</div>
            <div>R: Reset</div>
            <div>Space: Auto-rotate</div>
            <div>1: Face front</div>
            <div>2: Show back</div>
            <div>Smooth animations</div>
          </div>
        </div>

        <div className="text-xs text-gray-500 leading-relaxed">
          Fixed event conflicts and improved 3D controls for smooth card interaction!
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdvancedControlsSection;
