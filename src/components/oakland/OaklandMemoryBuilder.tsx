
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Share2, Save, Search, Grid3X3, Type, Palette, Sparkles, Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OAKLAND_CARD_TEMPLATES, OAKLAND_CARD_CATEGORIES, OaklandCardTemplate } from '@/lib/data/oaklandCardTemplates';
import OaklandCardPreview from './OaklandCardPreview';

interface MemoryData {
  title: string;
  subtitle: string;
  description: string;
  player?: string;
  date?: string;
  tags: string[];
}

const OaklandMemoryBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<OaklandCardTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [memoryData, setMemoryData] = useState<MemoryData>({
    title: 'My Oakland Memory',
    subtitle: 'A\'s Forever',
    description: 'Another unforgettable moment in Oakland',
    tags: []
  });

  const filteredTemplates = OAKLAND_CARD_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveMemory = () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }
    toast.success('Oakland A\'s memory saved! ⚾');
  };

  const handleShare = () => {
    toast.success('Memory shared with the Oakland faithful!');
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col overflow-hidden">
      {/* Top Header - 60px height */}
      <header className="h-[60px] bg-[#0f4c3a] border-b border-[#ffd700]/20 flex items-center justify-between px-6 shadow-lg relative z-30">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-[#ffd700] hover:text-white hover:bg-[#ffd700]/20 transition-all duration-200 border border-[#ffd700]/30 hover:border-[#ffd700]"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ffd700] to-yellow-300 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-[#0f4c3a] font-bold text-lg">⚾</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#ffd700] leading-tight">
                Oakland A's Memory Creator
              </h1>
              <p className="text-xs text-[#ffd700]/70 font-medium">
                Preserve your Oakland moments forever
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            size="sm"
            className="hidden md:flex border-[#ffd700]/50 text-[#ffd700] hover:border-[#ffd700] hover:bg-[#ffd700]/10 transition-all duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            2D Preview
          </Button>
          <Button 
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="border-[#ffd700]/50 text-[#ffd700] hover:border-[#ffd700] hover:bg-[#ffd700]/10 transition-all duration-200"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            onClick={handleSaveMemory}
            className="bg-gradient-to-r from-[#ffd700] to-yellow-400 hover:from-yellow-400 hover:to-[#ffd700] text-[#0f4c3a] font-bold shadow-lg hover:shadow-xl transition-all duration-200"
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Memory
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - 320px width */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-[#1a1a1a] border-r border-[#ffd700]/20 flex flex-col transition-all duration-300 shadow-xl`}>
          {!sidebarCollapsed && (
            <>
              {/* Templates Header */}
              <div className="p-6 border-b border-[#ffd700]/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                    <Grid3X3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#ffd700] text-lg">Templates</h2>
                    <p className="text-xs text-[#ffd700]/70 font-medium">Choose your memory style</p>
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ffd700]/60 h-4 w-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#2a2a2a]/60 border-[#ffd700]/30 text-[#ffd700] placeholder:text-[#ffd700]/50 focus:border-[#ffd700] focus:ring-[#ffd700]/20"
                  />
                </div>
              </div>

              {/* Category Filter Tags */}
              <div className="px-6 py-4 border-b border-[#ffd700]/10">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {OAKLAND_CARD_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex-shrink-0 text-xs font-medium transition-all duration-200 ${
                          selectedCategory === category.id 
                            ? "bg-gradient-to-r from-[#ffd700] to-yellow-300 text-[#0f4c3a] shadow-lg border-transparent hover:shadow-xl" 
                            : "hover:bg-[#ffd700]/10 hover:border-[#ffd700]/50 border-[#ffd700]/30 text-[#ffd700] bg-[#2a2a2a]/50"
                        }`}
                      >
                        <Icon className="h-3 w-3 mr-1.5" />
                        {category.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Template Grid */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`group relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] ${
                        selectedTemplate?.id === template.id
                          ? "border-[#ffd700] ring-4 ring-[#ffd700]/30 shadow-2xl shadow-[#ffd700]/20"
                          : "border-[#ffd700]/30 hover:border-[#ffd700]/60 hover:shadow-xl"
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="aspect-[2.5/3.5] relative overflow-hidden bg-gradient-to-br from-[#0f4c3a] to-[#2F5233]">
                        <OaklandCardPreview
                          template={template}
                          title={template.name}
                          subtitle={template.category}
                          className="w-full h-full"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Template Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white text-sm font-bold leading-tight mb-1">
                            {template.name}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/30"
                          >
                            {template.category}
                          </Badge>
                        </div>

                        {/* Selection Indicator */}
                        {selectedTemplate?.id === template.id && (
                          <div className="absolute top-3 right-3 bg-[#ffd700] text-[#0f4c3a] rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-[#ffd700]/40 mb-4">
                      <Search className="h-12 w-12 mx-auto mb-4" />
                    </div>
                    <p className="text-[#ffd700] font-medium">No templates found</p>
                    <p className="text-[#ffd700]/60 text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Collapse Toggle */}
          <div className="p-4 border-t border-[#ffd700]/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full text-[#ffd700] hover:bg-[#ffd700]/20"
            >
              {sidebarCollapsed ? '→' : '←'}
            </Button>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-[#f0f0f0] flex flex-col relative overflow-hidden">
          {/* Canvas Container */}
          <div className="flex-1 flex items-center justify-center p-8 relative">
            {/* Zoom Controls - Top Right */}
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2 min-w-[60px] text-center">
                {zoomLevel}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Card Preview */}
            <div 
              className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300"
              style={{ 
                transform: `scale(${zoomLevel / 100})`,
                width: '400px',
                height: '560px'
              }}
            >
              {selectedTemplate ? (
                <OaklandCardPreview
                  template={selectedTemplate}
                  title={memoryData.title}
                  subtitle={memoryData.subtitle}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">⚾</div>
                    <p className="text-lg font-medium">Select a template</p>
                    <p className="text-sm">Choose from the Oakland A's collection</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-[#0f4c3a]/10 hover:border-[#0f4c3a] transition-colors"
              >
                <Type className="h-4 w-4" />
                Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-[#0f4c3a]/10 hover:border-[#0f4c3a] transition-colors"
              >
                <Palette className="h-4 w-4" />
                Colors
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-[#0f4c3a]/10 hover:border-[#0f4c3a] transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Effects
              </Button>
              <div className="w-px h-8 bg-gray-300" />
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-[#0f4c3a]/10 hover:border-[#0f4c3a] transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OaklandMemoryBuilder;
