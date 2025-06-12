
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
            <Sparkles className="h-4 w-4" />
            Card Finish
          </div>
          <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-4">
        {(['matte', 'glossy', 'foil'] as const).map((finish) => (
          <Button
            key={finish}
            onClick={() => onCardFinishChange(finish)}
            className={cn(
              "w-full justify-start capitalize",
              cardFinish === finish 
                ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-[#EFB21E]/90"
                : "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
            )}
            variant={cardFinish === finish ? "default" : "outline"}
          >
            {finish}
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CardSettingsSection;
