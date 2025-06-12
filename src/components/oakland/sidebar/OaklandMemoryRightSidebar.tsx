
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Eye,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Grid3X3,
  Type,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import { OAKLAND_TEMPLATES } from '@/lib/data/oaklandTemplateData';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface OaklandMemoryRightSidebarProps {
  selectedTemplate: OaklandTemplate | null;
  onSelectTemplate: (template: OaklandTemplate) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  viewMode: '3d' | '2d';
  onViewModeToggle: () => void;
  autoRotate: boolean;
  onAutoRotateToggle: () => void;
  cardFinish: 'matte' | 'glossy' | 'foil';
  onCardFinishChange: (finish: 'matte' | 'glossy' | 'foil') => void;
  memoryData: {
    title: string;
    subtitle: string;
    description: string;
    player?: string;
    date?: string;
    tags: string[];
  };
  onMemoryDataChange: (data: any) => void;
  onExport: () => void;
}

const OaklandMemoryRightSidebar: React.FC<OaklandMemoryRightSidebarProps> = ({
  selectedTemplate,
  onSelectTemplate,
  collapsed,
  onToggleCollapse,
  zoomLevel,
  onZoomChange,
  viewMode,
  onViewModeToggle,
  autoRotate,
  onAutoRotateToggle,
  cardFinish,
  onCardFinishChange,
  memoryData,
  onMemoryDataChange,
  onExport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [templateSectionOpen, setTemplateSectionOpen] = useState(true);
  const [viewSectionOpen, setViewSectionOpen] = useState(true);
  const [cardSectionOpen, setCardSectionOpen] = useState(true);
  const [contentSectionOpen, setContentSectionOpen] = useState(false);

  const filteredTemplates = OAKLAND_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleZoomIn = () => onZoomChange(Math.min(zoomLevel + 25, 200));
  const handleZoomOut = () => onZoomChange(Math.max(zoomLevel - 25, 50));
  const handleReset = () => {
    onZoomChange(100);
    if (autoRotate) onAutoRotateToggle();
  };

  return (
    <div className={cn(
      "bg-gray-900 border-l border-gray-700 transition-all duration-300 flex flex-col shadow-lg",
      collapsed ? "w-16" : "w-96"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-gray-400" />
            <span className="font-semibold text-white">Controls</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2 hover:bg-[#EFB21E]/10 text-gray-400 hover:text-[#EFB21E]"
        >
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* View Controls Section */}
          <Collapsible open={viewSectionOpen} onOpenChange={setViewSectionOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Controls
                </div>
                <ChevronRight className={cn("h-4 w-4 transition-transform", viewSectionOpen && "rotate-90")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* Zoom Controls */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Zoom Level</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 50}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Badge variant="secondary" className="px-3 min-w-[60px] text-center bg-gray-800 text-gray-200">
                    {zoomLevel}%
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 200}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">View Mode</Label>
                <Button
                  onClick={onViewModeToggle}
                  className={cn(
                    "w-full justify-start",
                    viewMode === '3d' 
                      ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-[#EFB21E]/90"
                      : "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
                  )}
                  variant={viewMode === '3d' ? "default" : "outline"}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {viewMode.toUpperCase()} View
                </Button>
              </div>

              {/* Auto Rotate (3D only) */}
              {viewMode === '3d' && (
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Animation</Label>
                  <Button
                    onClick={onAutoRotateToggle}
                    className={cn(
                      "w-full justify-start",
                      autoRotate 
                        ? "bg-[#EFB21E] text-[#0f4c3a] hover:bg-[#EFB21E]/90"
                        : "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
                    )}
                    variant={autoRotate ? "default" : "outline"}
                  >
                    {autoRotate ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    Auto Rotate
                  </Button>
                </div>
              )}

              {/* Reset Button */}
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset View
              </Button>
            </CollapsibleContent>
          </Collapsible>

          {/* Card Settings Section */}
          <Collapsible open={cardSectionOpen} onOpenChange={setCardSectionOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Card Finish
                </div>
                <ChevronRight className={cn("h-4 w-4 transition-transform", cardSectionOpen && "rotate-90")} />
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

          {/* Templates Section */}
          <Collapsible open={templateSectionOpen} onOpenChange={setTemplateSectionOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Templates
                </div>
                <ChevronRight className={cn("h-4 w-4 transition-transform", templateSectionOpen && "rotate-90")} />
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

          {/* Content Section */}
          <Collapsible open={contentSectionOpen} onOpenChange={setContentSectionOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-gray-200 hover:bg-gray-800">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Content
                </div>
                <ChevronRight className={cn("h-4 w-4 transition-transform", contentSectionOpen && "rotate-90")} />
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

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-700">
            <Button
              onClick={onExport}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OaklandMemoryRightSidebar;
