
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import SidebarHeader from './sections/SidebarHeader';
import TemplateSection from './sections/TemplateSection';
import ContentSection from './sections/ContentSection';
import LuckyDesignSection from './sections/LuckyDesignSection';
import EffectsToggleControls from './sections/EffectsToggleControls';
import CardSettingsSection from './sections/CardSettingsSection';
import ViewControlsSection from './sections/ViewControlsSection';
import QuickActionsSection from './sections/QuickActionsSection';
import { useRandomDesign } from '@/hooks/useRandomDesign';
import { GeneratedDesign } from '@/lib/services/randomDesignGenerator';

interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface StepByStepSidebarProps {
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
  showEffects?: boolean;
  onShowEffectsChange?: (show: boolean) => void;
  showBorder?: boolean;
  onShowBorderChange?: (show: boolean) => void;
  borderStyle?: 'classic' | 'vintage' | 'modern';
  onBorderStyleChange?: (style: 'classic' | 'vintage' | 'modern') => void;
}

const StepByStepSidebar: React.FC<StepByStepSidebarProps> = ({
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
  onExport,
  showEffects = true,
  onShowEffectsChange = () => {},
  showBorder = true,
  onShowBorderChange = () => {},
  borderStyle = 'classic',
  onBorderStyleChange = () => {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const { applyRandomDesign, isApplying } = useRandomDesign({
    onTemplateChange: onSelectTemplate,
    onMemoryDataChange: onMemoryDataChange,
    onEffectsChange: (effects) => {
      console.log('Applied effects:', effects);
    }
  });

  // Define the steps
  const steps: Step[] = [
    {
      id: 'template',
      title: 'Choose Template',
      description: 'Select an Oakland A\'s template design',
      completed: !!selectedTemplate
    },
    {
      id: 'content',
      title: 'Add Content',
      description: 'Add your memory details and text',
      completed: !!memoryData.title && memoryData.title.trim() !== 'My Oakland Memory'
    },
    {
      id: 'design',
      title: 'Customize Design',
      description: 'Apply effects and decorative elements',
      completed: showEffects || !showBorder
    },
    {
      id: 'settings',
      title: 'Card Settings',
      description: 'Choose finish and border style',
      completed: cardFinish !== 'glossy' || borderStyle !== 'classic'
    },
    {
      id: 'export',
      title: 'View & Export',
      description: 'Preview and save your memory card',
      completed: false
    }
  ];

  // Auto-advance to next incomplete step when current step is completed
  useEffect(() => {
    const currentStepData = steps[currentStep];
    if (currentStepData?.completed) {
      const nextIncompleteStep = steps.findIndex((step, index) => 
        index > currentStep && !step.completed
      );
      if (nextIncompleteStep !== -1) {
        setCurrentStep(nextIncompleteStep);
      }
    }
  }, [selectedTemplate, memoryData.title, showEffects, showBorder, cardFinish, borderStyle]);

  const handleApplyRandomDesign = async (design: GeneratedDesign) => {
    try {
      await applyRandomDesign(design);
    } catch (error) {
      console.error('Failed to apply random design:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
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
        <>
          {/* Step Progress Indicator */}
          <div className="p-4 border-b border-gray-700">
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded cursor-pointer transition-all",
                    currentStep === index ? "bg-[#EFB21E]/20 border border-[#EFB21E]/30" : "hover:bg-gray-800",
                    step.completed ? "text-green-400" : "text-gray-300"
                  )}
                  onClick={() => goToStep(index)}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    step.completed ? "bg-green-500 text-white" : 
                    currentStep === index ? "bg-[#EFB21E] text-[#0f4c3a]" : "bg-gray-600 text-gray-300"
                  )}>
                    {step.completed ? <Check className="w-3 h-3" /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{step.title}</div>
                    <div className="text-xs text-gray-500 truncate">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {currentStep === 0 && (
              <TemplateSection
                isOpen={true}
                onOpenChange={() => {}}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={onSelectTemplate}
              />
            )}

            {currentStep === 1 && (
              <ContentSection
                isOpen={true}
                onOpenChange={() => {}}
                memoryData={memoryData}
                onMemoryDataChange={onMemoryDataChange}
              />
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <LuckyDesignSection
                  onApplyDesign={handleApplyRandomDesign}
                  isGenerating={isApplying}
                />
                <EffectsToggleControls
                  isOpen={true}
                  onOpenChange={() => {}}
                  showEffects={showEffects}
                  onShowEffectsChange={onShowEffectsChange}
                  borderStyle={borderStyle}
                  onBorderStyleChange={onBorderStyleChange}
                  showBorder={showBorder}
                  onShowBorderChange={onShowBorderChange}
                />
              </div>
            )}

            {currentStep === 3 && (
              <CardSettingsSection
                isOpen={true}
                onOpenChange={() => {}}
                cardFinish={cardFinish}
                onCardFinishChange={onCardFinishChange}
              />
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <ViewControlsSection
                  isOpen={true}
                  onOpenChange={() => {}}
                  zoomLevel={zoomLevel}
                  onZoomChange={onZoomChange}
                  viewMode={viewMode}
                  onViewModeToggle={onViewModeToggle}
                  autoRotate={autoRotate}
                  onAutoRotateToggle={onAutoRotateToggle}
                />
                <QuickActionsSection 
                  onExport={onExport}
                  memoryData={memoryData}
                  selectedTemplate={selectedTemplate}
                />
              </div>
            )}
          </div>

          {/* Step Navigation */}
          <div className="p-4 border-t border-gray-700 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <Button
              size="sm"
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className="bg-[#EFB21E] hover:bg-yellow-400 text-[#0f4c3a] font-bold"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StepByStepSidebar;
