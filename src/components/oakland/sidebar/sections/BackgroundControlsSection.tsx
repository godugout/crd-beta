
import React from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import BackgroundSelector, { BackgroundSettings } from '../../canvas/BackgroundSelector';

interface BackgroundControlsSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  backgroundSettings: BackgroundSettings;
  onBackgroundChange: (settings: BackgroundSettings) => void;
}

const BackgroundControlsSection: React.FC<BackgroundControlsSectionProps> = ({
  isOpen,
  onOpenChange,
  backgroundSettings,
  onBackgroundChange
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Background & Environment
          </div>
          <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <BackgroundSelector
          settings={backgroundSettings}
          onSettingsChange={onBackgroundChange}
        />
        
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-xs text-gray-400 leading-relaxed">
            <div className="font-medium text-gray-300 mb-2">Background Tips:</div>
            <div>• HDR presets provide realistic lighting</div>
            <div>• Gradients create custom atmospheres</div>
            <div>• Adjust blur for depth of field effect</div>
            <div>• Rotate environment for best card lighting</div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BackgroundControlsSection;
