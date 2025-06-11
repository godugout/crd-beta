
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Search, Grid3X3 } from 'lucide-react';
import { OAKLAND_CARD_TEMPLATES, OAKLAND_CARD_CATEGORIES, OaklandCardTemplate } from '@/lib/data/oaklandCardTemplates';
import { cn } from '@/lib/utils';

interface ModernTemplateSidebarProps {
  selectedTemplate: OaklandCardTemplate | null;
  onSelectTemplate: (template: OaklandCardTemplate) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const ModernTemplateSidebar: React.FC<ModernTemplateSidebarProps> = ({
  selectedTemplate,
  onSelectTemplate,
  collapsed,
  onToggleCollapse
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = OAKLAND_CARD_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
      collapsed ? "w-12" : "w-80"
    )}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <>
            <div className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5 text-[#003831]" />
              <h2 className="font-semibold text-gray-900">Templates</h2>
            </div>
            <Badge variant="secondary" className="text-xs">
              {filteredTemplates.length}
            </Badge>
          </>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!collapsed && (
        <>
          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {OAKLAND_CARD_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "text-xs",
                    selectedCategory === category.id 
                      ? "bg-[#003831] text-[#EFB21E] hover:bg-[#002620]" 
                      : "hover:bg-gray-100"
                  )}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "group relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200",
                    selectedTemplate?.id === template.id
                      ? "border-[#EFB21E] ring-2 ring-[#EFB21E]/20 shadow-lg"
                      : "border-gray-200 hover:border-[#003831] hover:shadow-md"
                  )}
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="aspect-[2.5/3.5] relative overflow-hidden">
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Template Info */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white text-xs font-medium leading-tight">
                        {template.name}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className="mt-1 text-xs bg-white/20 text-white border-white/30"
                      >
                        {template.category}
                      </Badge>
                    </div>

                    {/* Selection Indicator */}
                    {selectedTemplate?.id === template.id && (
                      <div className="absolute top-2 right-2 bg-[#EFB21E] text-[#003831] rounded-full w-6 h-6 flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-sm">
                  No templates found
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ModernTemplateSidebar;
