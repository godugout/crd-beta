
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Sparkles, Frame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EffectsToggleControlsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  showEffects: boolean;
  onShowEffectsChange: (show: boolean) => void;
  borderStyle: 'classic' | 'vintage' | 'modern';
  onBorderStyleChange: (style: 'classic' | 'vintage' | 'modern') => void;
  showBorder: boolean;
  onShowBorderChange: (show: boolean) => void;
}

const EffectsToggleControls: React.FC<EffectsToggleControlsProps> = ({
  isOpen,
  onOpenChange,
  showEffects,
  onShowEffectsChange,
  borderStyle,
  onBorderStyleChange,
  showBorder,
  onShowBorderChange
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Effects & Border
          </div>
          <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        {/* Decorative Effects Toggle */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Decorative Effects</Label>
          <div className="flex items-center gap-3">
            <Switch
              checked={showEffects}
              onCheckedChange={onShowEffectsChange}
              className="data-[state=checked]:bg-[#EFB21E]"
            />
            <span className="text-gray-400 text-sm">
              {showEffects ? 'Show overlays & effects' : 'Hide overlays & effects'}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Toggle decorative elements like SVG overlays and special effects
          </p>
        </div>

        {/* Border Controls */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Baseball Card Border</Label>
          <div className="flex items-center gap-3 mb-2">
            <Switch
              checked={showBorder}
              onCheckedChange={onShowBorderChange}
              className="data-[state=checked]:bg-[#EFB21E]"
            />
            <span className="text-gray-400 text-sm">
              {showBorder ? 'Traditional border' : 'Simple edges'}
            </span>
          </div>
          
          {showBorder && (
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Border Style</Label>
              <Select value={borderStyle} onValueChange={onBorderStyleChange}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="classic" className="text-gray-200 focus:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <Frame className="h-4 w-4" />
                      Classic
                    </div>
                  </SelectItem>
                  <SelectItem value="vintage" className="text-gray-200 focus:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <Frame className="h-4 w-4" />
                      Vintage
                    </div>
                  </SelectItem>
                  <SelectItem value="modern" className="text-gray-200 focus:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <Frame className="h-4 w-4" />
                      Modern
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Quick Reset */}
        <Button
          onClick={() => {
            onShowEffectsChange(true);
            onShowBorderChange(true);
            onBorderStyleChange('classic');
          }}
          variant="outline"
          size="sm"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default EffectsToggleControls;
