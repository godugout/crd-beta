
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardSettingsSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cardFinish: 'matte' | 'glossy' | 'foil';
  onCardFinishChange: (finish: 'matte' | 'glossy' | 'foil') => void;
}

const CardSettingsSection: React.FC<CardSettingsSectionProps> = ({
  isOpen,
  onOpenChange,
  cardFinish,
  onCardFinishChange
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Card Finish
          </div>
          <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="space-y-3">
          <Label className="text-gray-300 text-sm">Card Finish Type</Label>
          <Select value={cardFinish} onValueChange={onCardFinishChange}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="matte" className="text-gray-200 focus:bg-gray-700">
                <div className="space-y-1">
                  <div className="font-medium">Matte</div>
                  <div className="text-xs text-gray-400">Classic flat finish</div>
                </div>
              </SelectItem>
              <SelectItem value="glossy" className="text-gray-200 focus:bg-gray-700">
                <div className="space-y-1">
                  <div className="font-medium">Glossy</div>
                  <div className="text-xs text-gray-400">Shiny reflective surface</div>
                </div>
              </SelectItem>
              <SelectItem value="foil" className="text-gray-200 focus:bg-gray-700">
                <div className="space-y-1">
                  <div className="font-medium">Foil</div>
                  <div className="text-xs text-gray-400">Premium holographic effect</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['matte', 'glossy', 'foil'].map((finish) => (
            <button
              key={finish}
              onClick={() => onCardFinishChange(finish as 'matte' | 'glossy' | 'foil')}
              className={cn(
                "p-3 rounded border-2 transition-all text-sm font-medium capitalize",
                cardFinish === finish
                  ? "border-[#EFB21E] bg-[#EFB21E]/10 text-[#EFB21E]"
                  : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
              )}
            >
              {finish}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-500 leading-relaxed">
          Choose the surface finish for your Oakland A's memory card. Each finish affects how light reflects off the card surface.
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CardSettingsSection;
