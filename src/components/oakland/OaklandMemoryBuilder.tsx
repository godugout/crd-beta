
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Share2, Save, ZoomIn, ZoomOut, Maximize2, Download, Type, Palette, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import { OAKLAND_TEMPLATES } from '@/lib/data/oaklandTemplateData';
import OaklandCardPreview from './OaklandCardPreview';
import TemplateGallery from './TemplateGallery';
import OaklandCard3DCanvas from './canvas/OaklandCard3DCanvas';

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
  const [selectedTemplate, setSelectedTemplate] = useState<OaklandTemplate | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [memoryData, setMemoryData] = useState<MemoryData>({
    title: 'My Oakland Memory',
    subtitle: 'A\'s Forever',
    description: 'Another unforgettable moment in Oakland',
    tags: []
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

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Helper function to map difficulty values
  const mapDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): 'easy' | 'medium' | 'hard' => {
    switch (difficulty) {
      case 'beginner':
        return 'easy';
      case 'intermediate':
        return 'medium';
      case 'advanced':
        return 'hard';
      default:
        return 'medium';
    }
  };

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
            3D Preview
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
        {/* Left Sidebar - Template Gallery */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-96'} bg-[#1a1a1a] border-r border-[#ffd700]/20 flex flex-col transition-all duration-300 shadow-xl`}>
          {!sidebarCollapsed ? (
            <TemplateGallery
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              className="h-full"
            />
          ) : (
            <div className="p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(false)}
                className="w-full text-[#ffd700] hover:bg-[#ffd700]/20"
              >
                →
              </Button>
            </div>
          )}
          
          {/* Collapse Toggle */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-[#ffd700]/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(true)}
                className="w-full text-[#ffd700] hover:bg-[#ffd700]/20"
              >
                ←
              </Button>
            </div>
          )}
        </div>

        {/* Main Canvas Area - Now using 3D Canvas */}
        <div className="flex-1 bg-[#f0f0f0] flex flex-col relative overflow-hidden">
          <OaklandCard3DCanvas
            selectedTemplate={selectedTemplate}
            memoryData={memoryData}
            isFullscreen={isFullscreen}
            onFullscreenToggle={handleFullscreenToggle}
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            className="flex-1"
          />

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
