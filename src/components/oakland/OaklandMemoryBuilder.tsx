
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import OaklandCard3DCanvas from './canvas/OaklandCard3DCanvas';
import StepByStepSidebar from './sidebar/StepByStepSidebar';

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
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [autoRotate, setAutoRotate] = useState(false);
  const [cardFinish, setCardFinish] = useState<'matte' | 'glossy' | 'foil'>('glossy');
  
  // New effects and border state
  const [showEffects, setShowEffects] = useState(true);
  const [showBorder, setShowBorder] = useState(true);
  const [borderStyle, setBorderStyle] = useState<'classic' | 'vintage' | 'modern'>('classic');
  
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

  const handleExport = () => {
    toast.success('Exporting your Oakland memory...');
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col overflow-hidden">
      {/* Top Header */}
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
                Advanced card controls enabled
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
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
        {/* Main Canvas Area */}
        <div className="flex-1 bg-[#f0f0f0] flex flex-col relative overflow-hidden">
          <OaklandCard3DCanvas
            selectedTemplate={selectedTemplate}
            memoryData={memoryData}
            isFullscreen={isFullscreen}
            onFullscreenToggle={handleFullscreenToggle}
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            viewMode={viewMode}
            autoRotate={autoRotate}
            cardFinish={cardFinish}
            showEffects={showEffects}
            showBorder={showBorder}
            borderStyle={borderStyle}
            sidebarOpen={!sidebarCollapsed}
            className="flex-1"
          />
        </div>

        {/* Step-by-Step Sidebar */}
        <StepByStepSidebar
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          viewMode={viewMode}
          onViewModeToggle={() => setViewMode(prev => prev === '3d' ? '2d' : '3d')}
          autoRotate={autoRotate}
          onAutoRotateToggle={() => setAutoRotate(!autoRotate)}
          cardFinish={cardFinish}
          onCardFinishChange={setCardFinish}
          memoryData={memoryData}
          onMemoryDataChange={setMemoryData}
          onExport={handleExport}
          showEffects={showEffects}
          onShowEffectsChange={setShowEffects}
          showBorder={showBorder}
          onShowBorderChange={setShowBorder}
          borderStyle={borderStyle}
          onBorderStyleChange={setBorderStyle}
        />
      </div>
    </div>
  );
};

export default OaklandMemoryBuilder;
