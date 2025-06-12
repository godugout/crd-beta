
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Star, Clock, TrendingUp, Sparkles, Heart, Eye, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OaklandTemplate, TemplateFilter } from '@/lib/types/oaklandTemplates';
import { OAKLAND_TEMPLATES, OAKLAND_TEMPLATE_CATEGORIES, TEMPLATE_SECTIONS } from '@/lib/data/oaklandTemplateData';

interface TemplateGalleryProps {
  selectedTemplate: OaklandTemplate | null;
  onSelectTemplate: (template: OaklandTemplate) => void;
  className?: string;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedTemplate,
  onSelectTemplate,
  className
}) => {
  const [filter, setFilter] = useState<TemplateFilter>({ category: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'sections'>('sections');
  const [isLoading, setIsLoading] = useState(false);

  const filteredTemplates = useMemo(() => {
    let templates = OAKLAND_TEMPLATES;

    // Category filter
    if (filter.category && filter.category !== 'all') {
      templates = templates.filter(t => t.category === filter.category);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query)) ||
        t.metadata.theme.some(theme => theme.toLowerCase().includes(query))
      );
    }

    // Special filters
    if (filter.showFavorites) {
      templates = templates.filter(t => t.isFavorite);
    }
    if (filter.showRecent) {
      templates = templates.filter(t => t.lastUsed);
    }
    if (filter.showTrending) {
      templates = templates.filter(t => t.isTrending);
    }

    return templates;
  }, [filter, searchQuery]);

  const handleCategoryChange = (categoryId: string) => {
    setFilter(prev => ({ ...prev, category: categoryId }));
  };

  const toggleFavorite = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In real app, this would update the template's favorite status
    console.log('Toggle favorite:', templateId);
  };

  const TemplateCard: React.FC<{ template: OaklandTemplate; size?: 'small' | 'medium' | 'large' }> = ({ 
    template, 
    size = 'medium' 
  }) => {
    const isSelected = selectedTemplate?.id === template.id;
    const isHovered = hoveredTemplate === template.id;

    return (
      <div
        className={cn(
          "group relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300",
          "bg-gradient-to-br from-gray-800 to-gray-700 hover:scale-[1.02]",
          isSelected
            ? "border-[#EFB21E] ring-4 ring-[#EFB21E]/30 shadow-2xl shadow-[#EFB21E]/20"
            : "border-[#EFB21E]/30 hover:border-[#EFB21E]/60 hover:shadow-xl",
          size === 'small' ? "aspect-[2.5/3]" : 
          size === 'large' ? "aspect-[2.5/3.2]" : "aspect-[2.5/3.5]"
        )}
        onClick={() => onSelectTemplate(template)}
        onMouseEnter={() => setHoveredTemplate(template.id)}
        onMouseLeave={() => setHoveredTemplate(null)}
      >
        {/* Template Thumbnail */}
        <div className="relative w-full h-full">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <img
              src={template.thumbnailUrl}
              alt={template.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml;base64,${btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">
                    <rect width="200" height="280" fill="#003831"/>
                    <rect x="10" y="10" width="180" height="260" fill="none" stroke="#EFB21E" stroke-width="2"/>
                    <text x="100" y="150" text-anchor="middle" fill="#EFB21E" font-size="16">${template.name}</text>
                  </svg>
                `)}`;
              }}
            />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Template Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {template.isNew && (
              <Badge className="bg-emerald-600 text-white text-xs px-2 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                New
              </Badge>
            )}
            {template.isTrending && (
              <Badge className="bg-orange-600 text-white text-xs px-2 py-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>

          {/* Completion Percentage */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-[#EFB21E]/90 text-[#003831] text-xs font-bold">
              {template.completionPercentage}%
            </Badge>
          </div>

          {/* Template Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-bold leading-tight">
                {template.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => toggleFavorite(template.id, e)}
                className="p-1 h-auto hover:bg-white/20"
              >
                <Heart 
                  className={cn(
                    "h-4 w-4", 
                    template.isFavorite ? "fill-red-500 text-red-500" : "text-white"
                  )} 
                />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Badge 
                variant="secondary" 
                className="text-xs bg-[#EFB21E]/20 text-[#EFB21E] border-[#EFB21E]/30 backdrop-blur-sm"
              >
                {template.category}
              </Badge>
              
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Clock className="h-3 w-3" />
                <span>{template.metadata.estimatedTime}m</span>
              </div>
            </div>
          </div>

          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-3 right-3 bg-[#EFB21E] text-[#003831] rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
              <Star className="h-4 w-4 fill-current" />
            </div>
          )}

          {/* Quick Actions (on hover) */}
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-[#EFB21E] hover:bg-yellow-400 text-[#003831] font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                >
                  Use Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Preview functionality
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {/* Header */}
      <div className="p-6 border-b border-[#EFB21E]/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#EFB21E]">Template Gallery</h2>
            <p className="text-[#EFB21E]/70 text-sm">Choose your Oakland A's memory style</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'sections' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('sections')}
              className="text-xs"
            >
              Sections
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="text-xs"
            >
              Grid
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#EFB21E]/60 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800/60 border-[#EFB21E]/30 text-[#EFB21E] placeholder:text-[#EFB21E]/50 focus:border-[#EFB21E]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {OAKLAND_TEMPLATE_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={filter.category === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                "flex-shrink-0 text-xs font-medium transition-all duration-200",
                filter.category === category.id 
                  ? "bg-gradient-to-r from-[#EFB21E] to-yellow-300 text-[#003831] shadow-lg" 
                  : "hover:bg-[#EFB21E]/10 hover:border-[#EFB21E]/50 border-[#EFB21E]/30 text-[#EFB21E]"
              )}
            >
              <span className="mr-1.5">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'sections' ? (
          <div className="space-y-8">
            {TEMPLATE_SECTIONS.map((section) => {
              const sectionTemplates = section.templates.filter(template =>
                filteredTemplates.some(ft => ft.id === template.id)
              );

              if (sectionTemplates.length === 0) return null;

              return (
                <div key={section.id}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#EFB21E]">{section.title}</h3>
                      <p className="text-[#EFB21E]/70 text-sm">{section.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#EFB21E]">
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {sectionTemplates.slice(0, 4).map((template) => (
                      <TemplateCard key={template.id} template={template} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}

        {/* Empty State */}
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
    </div>
  );
};

export default TemplateGallery;
