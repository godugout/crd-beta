
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye, Share2, Download, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OaklandCardTemplate, OAKLAND_CARD_TEMPLATES } from '@/lib/data/oaklandCardTemplates';
import { useCardLighting } from '@/hooks/useCardLighting';
import ModernTemplateSidebar from './ModernTemplateSidebar';
import ModernCardPreview from './ModernCardPreview';
import ModernEditingPanel from './ModernEditingPanel';
import FloatingActionBar from './FloatingActionBar';

interface CardData {
  title: string;
  subtitle: string;
  description: string;
  player?: string;
  team: string;
  year?: string;
  tags: string[];
}

const ModernCardCreator: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<OaklandCardTemplate | null>(null);
  const [cardData, setCardData] = useState<CardData>({
    title: 'Oakland A\'s',
    subtitle: 'Baseball Card',
    description: 'An authentic Oakland Athletics trading card',
    team: 'Oakland Athletics',
    tags: []
  });
  const [view3D, setView3D] = useState(false);
  const [activeEditPanel, setActiveEditPanel] = useState<'text' | 'colors' | 'effects' | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const {
    lightingSettings,
    lightingPreset,
    applyPreset,
    updateLightingSetting
  } = useCardLighting('studio');

  const handleSaveCard = () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }
    toast.success('Oakland A\'s memory card saved! ⚾');
  };

  const handleExport = (format: 'png' | 'pdf' | 'print') => {
    toast.success(`Exporting as ${format.toUpperCase()}...`);
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm sticky top-0 z-30">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#003831] to-[#2F5233] bg-clip-text text-transparent">
                Oakland A's Memory Creator
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Design your authentic Oakland Athletics memory card
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setView3D(!view3D)}
              variant="outline"
              size="sm"
              className="hidden md:flex border-gray-300 hover:border-[#003831] hover:bg-[#003831]/5 transition-all duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              {view3D ? '2D' : '3D'} Preview
            </Button>
            <Button 
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="border-gray-300 hover:border-[#EFB21E] hover:bg-[#EFB21E]/10 transition-all duration-200"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              onClick={handleSaveCard}
              className="bg-gradient-to-r from-[#003831] to-[#2F5233] hover:from-[#002620] hover:to-[#1e3a26] text-[#EFB21E] font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Memory
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Enhanced Template Sidebar */}
        <ModernTemplateSidebar
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50/50 to-white">
          {/* Enhanced Preview Area */}
          <div className="flex-1 p-8">
            <ModernCardPreview
              template={selectedTemplate}
              cardData={cardData}
              view3D={view3D}
              lightingSettings={lightingSettings}
              lightingPreset={lightingPreset}
              onDataChange={setCardData}
            />
          </div>

          {/* Modern Editing Panel */}
          {activeEditPanel && (
            <ModernEditingPanel
              type={activeEditPanel}
              cardData={cardData}
              template={selectedTemplate}
              onDataChange={setCardData}
              onClose={() => setActiveEditPanel(null)}
            />
          )}
        </div>
      </div>

      {/* Enhanced Floating Action Bar */}
      <FloatingActionBar
        selectedTemplate={selectedTemplate}
        onEditText={() => setActiveEditPanel('text')}
        onEditColors={() => setActiveEditPanel('colors')}
        onEditEffects={() => setActiveEditPanel('effects')}
        onExport={handleExport}
        activePanel={activeEditPanel}
      />
    </div>
  );
};

export default ModernCardCreator;
