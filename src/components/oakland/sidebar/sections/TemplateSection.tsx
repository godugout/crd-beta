
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Grid3X3, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import { OAKLAND_TEMPLATES } from '@/lib/data/oaklandTemplateData';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TemplateSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: OaklandTemplate | null;
  onSelectTemplate: (template: OaklandTemplate) => void;
}

const TemplateSection: React.FC<TemplateSectionProps> = ({
  isOpen,
  onOpenChange,
  selectedTemplate,
  onSelectTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = OAKLAND_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Templates
          </div>
          <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        {/* Template Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-gray-200 placeholder:text-gray-500"
          />
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                selectedTemplate?.id === template.id
                  ? "border-[#EFB21E] ring-2 ring-[#EFB21E]/30"
                  : "border-gray-600 hover:border-gray-500"
              )}
              onClick={() => onSelectTemplate(template)}
            >
              <div className="aspect-[2.5/3.5] bg-gray-800 flex items-center justify-center">
                <img
                  src={template.thumbnailUrl}
                  alt={template.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-gray-500 text-center p-2">
                  <div className="text-xl mb-1">⚾</div>
                  <div className="text-xs">{template.name}</div>
                </div>
              </div>
              <div className="p-2 bg-gray-800">
                <p className="text-xs text-gray-300 font-medium truncate">{template.name}</p>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TemplateSection;
