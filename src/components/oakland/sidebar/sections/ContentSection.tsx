
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight, Type, User, Calendar } from 'lucide-react';
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
  const handleChange = (field: string, value: string) => {
    onMemoryDataChange({
      ...memoryData,
      [field]: value
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Card Content
          </div>
          <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        {/* Title */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm flex items-center gap-2">
            <Type className="h-3 w-3" />
            Card Title
          </Label>
          <Input
            value={memoryData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="My Oakland Memory"
            className="bg-gray-800 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-[#EFB21E] focus:ring-[#EFB21E]/20"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Subtitle</Label>
          <Input
            value={memoryData.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="A's Forever"
            className="bg-gray-800 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-[#EFB21E] focus:ring-[#EFB21E]/20"
          />
        </div>

        {/* Player */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm flex items-center gap-2">
            <User className="h-3 w-3" />
            Player/Person
          </Label>
          <Input
            value={memoryData.player || ''}
            onChange={(e) => handleChange('player', e.target.value)}
            placeholder="Player name or person"
            className="bg-gray-800 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-[#EFB21E] focus:ring-[#EFB21E]/20"
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Date
          </Label>
          <Input
            type="date"
            value={memoryData.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
            className="bg-gray-800 border-gray-600 text-gray-200 focus:border-[#EFB21E] focus:ring-[#EFB21E]/20"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Description</Label>
          <Textarea
            value={memoryData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Tell the story of this Oakland memory..."
            rows={3}
            className="bg-gray-800 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-[#EFB21E] focus:ring-[#EFB21E]/20 resize-none"
          />
        </div>

        {/* Character count */}
        <div className="text-xs text-gray-500 text-right">
          {memoryData.description.length}/500 characters
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ContentSection;
