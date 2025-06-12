import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import SidebarHeader from './sections/SidebarHeader';
import ViewControlsSection from './sections/ViewControlsSection';
import CardSettingsSection from './sections/CardSettingsSection';
import TemplateSection from './sections/TemplateSection';
import ContentSection from './sections/ContentSection';
import QuickActionsSection from './sections/QuickActionsSection';
import LuckyDesignSection from './sections/LuckyDesignSection';
import { useRandomDesign } from '@/hooks/useRandomDesign';
import { GeneratedDesign } from '@/lib/services/randomDesignGenerator';

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
  const [templateSectionOpen, setTemplateSectionOpen] = useState(true);
  const [viewSectionOpen, setViewSectionOpen] = useState(true);
  const [cardSectionOpen, setCardSectionOpen] = useState(true);
  const [contentSectionOpen, setContentSectionOpen] = useState(false);
  const [luckySectionOpen, setLuckySectionOpen] = useState(true);

  const { applyRandomDesign, isApplying } = useRandomDesign({
    onTemplateChange: onSelectTemplate,
    onMemoryDataChange: onMemoryDataChange,
    onEffectsChange: (effects) => {
      // Handle effects change if needed
      console.log('Applied effects:', effects);
    }
  });

  const handleApplyRandomDesign = async (design: GeneratedDesign) => {
    try {
      await applyRandomDesign(design);
    } catch (error) {
      console.error('Failed to apply random design:', error);
    }
  };

  return (
    <div className={cn(
      "bg-gray-900 border-l border-gray-700 transition-all duration-300 flex flex-col shadow-lg",
      collapsed ? "w-16" : "w-96"
    )}>
      <SidebarHeader 
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />

      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Lucky Design Section - Featured at top */}
          <div>
            <LuckyDesignSection
              onApplyDesign={handleApplyRandomDesign}
              isGenerating={isApplying}
            />
          </div>

          <ViewControlsSection
            isOpen={viewSectionOpen}
            onOpenChange={setViewSectionOpen}
            zoomLevel={zoomLevel}
            onZoomChange={onZoomChange}
            viewMode={viewMode}
            onViewModeToggle={onViewModeToggle}
            autoRotate={autoRotate}
            onAutoRotateToggle={onAutoRotateToggle}
          />

          <CardSettingsSection
            isOpen={cardSectionOpen}
            onOpenChange={setCardSectionOpen}
            cardFinish={cardFinish}
            onCardFinishChange={onCardFinishChange}
          />

          <TemplateSection
            isOpen={templateSectionOpen}
            onOpenChange={setTemplateSectionOpen}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={onSelectTemplate}
          />

          <ContentSection
            isOpen={contentSectionOpen}
            onOpenChange={setContentSectionOpen}
            memoryData={memoryData}
            onMemoryDataChange={onMemoryDataChange}
          />

          <QuickActionsSection onExport={onExport} />
        </div>
      )}
    </div>
  );
};

export default OaklandMemoryRightSidebar;
