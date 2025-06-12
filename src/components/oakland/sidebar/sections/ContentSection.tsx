
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ContentSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  memoryData: {
    title: string;
    subtitle: string;
    description: string;
    player?: string;
    date?: string;
    tags: string[];
  };
  onMemoryDataChange: (data: any) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  isOpen,
  onOpenChange,
  memoryData,
  onMemoryDataChange
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Content
          </div>
          <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="space-y-3">
          <div>
            <Label className="text-gray-300 text-sm">Title</Label>
            <Input
              value={memoryData.title}
              onChange={(e) => onMemoryDataChange({ ...memoryData, title: e.target.value })}
              className="bg-gray-800 border-gray-600 text-gray-200"
            />
          </div>
          <div>
            <Label className="text-gray-300 text-sm">Subtitle</Label>
            <Input
              value={memoryData.subtitle}
              onChange={(e) => onMemoryDataChange({ ...memoryData, subtitle: e.target.value })}
              className="bg-gray-800 border-gray-600 text-gray-200"
            />
          </div>
          <div>
            <Label className="text-gray-300 text-sm">Description</Label>
            <Textarea
              value={memoryData.description}
              onChange={(e) => onMemoryDataChange({ ...memoryData, description: e.target.value })}
              className="bg-gray-800 border-gray-600 text-gray-200 resize-none"
              rows={3}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ContentSection;
