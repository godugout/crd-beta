
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Search, Grid3X3, Sparkles, Star, Clock, Trophy, Megaphone, Heart } from 'lucide-react';
import { OAKLAND_CARD_TEMPLATES, OAKLAND_CARD_CATEGORIES, OaklandCardTemplate } from '@/lib/data/oaklandCardTemplates';
import { cn } from '@/lib/utils';

interface ModernTemplateSidebarProps {
  selectedTemplate: OaklandCardTemplate | null;
  onSelectTemplate: (template: OaklandCardTemplate) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'all': return Star;
    case 'nostalgia': return Clock;
    case 'celebration': return Trophy;
    case 'protest': return Megaphone;
    case 'community': return Heart;
    default: return Star;
  }
};

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
      "bg-gradient-to-b from-gray-900 to-gray-800 border-r border-[#EFB21E]/20 transition-all duration-300 flex flex-col shadow-2xl backdrop-blur-sm",
      collapsed ? "w-16" : "w-96"
    )}>
      {/* Enhanced Header */}
      <div className="p-6 border-b border-[#EFB21E]/20 flex items-center justify-between bg-gradient-to-r from-[#003831]/80 to-[#2F5233]/60 backdrop-blur-sm">
        {!collapsed && (
          <>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#EFB21E] to-yellow-300 rounded-xl shadow-lg">
                <Grid3X3 className="h-5 w-5 text-[#003831]" />
              </div>
              <div>
                <h2 className="font-bold text-[#EFB21E] text-lg">Templates</h2>
                <p className="text-xs text-[#EFB21E]/70 font-medium">Choose your style</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs bg-[#EFB21E]/20 text-[#EFB21E] border-[#EFB21E]/30">
              {filteredTemplates.length}
            </Badge>
          </>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2 hover:bg-[#EFB21E]/20 text-[#EFB21E] transition-colors duration-200"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!collapsed && (
        <>
          {/* Enhanced Search */}
          <div className="p-6 border-b border-[#EFB21E]/10 bg-gradient-to-r from-gray-800/50 to-gray-700/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#EFB21E]/60 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/60 border-[#EFB21E]/30 text-[#EFB21E] placeholder:text-[#EFB21E]/50 focus:border-[#EFB21E] focus:ring-[#EFB21E]/20 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Enhanced Category Pills */}
          <div className="px-6 py-4 border-b border-[#EFB21E]/10">
            <div className="flex flex-wrap gap-2">
              {OAKLAND_CARD_CATEGORIES.map((category) => {
                const Icon = getCategoryIcon(category.id);
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "text-xs font-medium transition-all duration-200",
                      selectedCategory === category.id 
                        ? "bg-gradient-to-r from-[#EFB21E] to-yellow-300 text-[#003831] shadow-lg border-transparent hover:shadow-xl" 
                        : "hover:bg-[#EFB21E]/10 hover:border-[#EFB21E]/50 border-[#EFB21E]/30 text-[#EFB21E] bg-gray-800/50"
                    )}
                  >
                    <Icon className="h-3 w-3 mr-1.5" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Enhanced Template Grid */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "group relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-gray-800 to-gray-700",
                    selectedTemplate?.id === template.id
                      ? "border-[#EFB21E] ring-4 ring-[#EFB21E]/30 shadow-2xl shadow-[#EFB21E]/20"
                      : "border-[#EFB21E]/30 hover:border-[#EFB21E]/60 hover:shadow-xl"
                  )}
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="aspect-[2.5/3.5] relative overflow-hidden">
                    {/* Template Preview Image */}
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback to generated preview if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    
                    {/* Fallback Generated Preview */}
                    <div className="hidden absolute inset-0 bg-gradient-to-br from-[#003831] to-[#2F5233] flex items-center justify-center">
                      <div className="text-center text-[#EFB21E]">
                        <div className="text-2xl mb-2">⚾</div>
                        <div className="text-xs font-bold">{template.name}</div>
                      </div>
                    </div>
                    
                    {/* Enhanced Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Template Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white text-sm font-bold leading-tight mb-1">
                        {template.name}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-[#EFB21E]/20 text-[#EFB21E] border-[#EFB21E]/30 backdrop-blur-sm"
                      >
                        {template.category}
                      </Badge>
                    </div>

                    {/* Selection Indicator */}
                    {selectedTemplate?.id === template.id && (
                      <div className="absolute top-3 right-3 bg-[#EFB21E] text-[#003831] rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    )}

                    {/* Category-specific Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={cn(
                        "text-xs px-2 py-1",
                        template.category === 'protest' ? "bg-red-600/80 text-white" :
                        template.category === 'celebration' ? "bg-yellow-500/80 text-black" :
                        template.category === 'nostalgia' ? "bg-amber-700/80 text-white" :
                        "bg-emerald-600/80 text-white"
                      )}>
                        {template.metadata.popularity}%
                      </Badge>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#EFB21E]/20 to-yellow-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-16">
                <div className="text-[#EFB21E]/40 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4" />
                </div>
                <p className="text-[#EFB21E] font-medium">No templates found</p>
                <p className="text-[#EFB21E]/60 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ModernTemplateSidebar;
