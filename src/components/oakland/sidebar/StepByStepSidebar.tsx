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
import AdvancedControlsSection from './sections/AdvancedControlsSection';
import BackgroundControlsSection from './sections/BackgroundControlsSection';
import { BackgroundSettings } from '../canvas/BackgroundSelector';
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
  backgroundSettings?: BackgroundSettings;
  onBackgroundChange?: (settings: BackgroundSettings) => void;
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
  onBorderStyleChange = () => {},
  backgroundSettings = {
    type: 'preset',
    preset: 'studio',
    intensity: 1.0,
    blur: 0.0,
    rotation: 0
  },
  onBackgroundChange = () => {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [openSections, setOpenSections] = useState({
    template: true,
    content: true,
    cardSettings: false,
    viewControls: false,
    advancedControls: false,
    quickActions: false,
    luckyDesign: false,
    backgroundControls: false
  });

  // Card control state for advanced controls
  const [cardControlState, setCardControlState] = useState({
    scale: 0.8,
    isFlipped: false,
    isFlipping: false
  });

  const { applyRandomDesign, isApplying } = useRandomDesign({
    onTemplateChange: onSelectTemplate,
    onMemoryDataChange: onMemoryDataChange,
    onEffectsChange: (effects) => {
      console.log('Applied effects:', effects);
    }
  });

  // Define the steps with background customization
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
      id: 'background',
      title: 'Set Background',
      description: 'Customize the environment and lighting',
      completed: backgroundSettings.type !== 'preset' || backgroundSettings.preset !== 'studio'
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

  // Enhanced card control handlers
  const handleFlipCard = () => {
    console.log('Flip card triggered from sidebar');
    setCardControlState(prev => ({ ...prev, isFlipping: true }));
    
    // Simulate flip animation
    setTimeout(() => {
      setCardControlState(prev => ({ 
        ...prev, 
        isFlipped: !prev.isFlipped, 
        isFlipping: false 
      }));
    }, 600);
  };

  const handleResetCard = () => {
    console.log('Reset card triggered from sidebar');
    setCardControlState({
      scale: 0.8,
      isFlipped: false,
      isFlipping: false
    });
  };

  const handleScaleChange = (scale: number) => {
    setCardControlState(prev => ({ ...prev, scale }));
  };

  const handleFaceCamera = () => {
    console.log('Face camera triggered from sidebar');
    setCardControlState(prev => ({ ...prev, isFlipped: false }));
  };

  const handleShowBack = () => {
    console.log('Show back triggered from sidebar');
    setCardControlState(prev => ({ ...prev, isFlipped: true }));
  };

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

  const toggleSection = (section: string, open: boolean) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: open
    }));
  };

  return (
    <div className={cn(
      "h-full bg-[#0f4c3a] border-l border-[#ffd700]/20 shadow-2xl transition-all duration-300 relative z-20",
      collapsed ? "w-12" : "w-80"
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              <BackgroundControlsSection
                isOpen={true}
                onOpenChange={() => {}}
                backgroundSettings={backgroundSettings}
                onBackgroundChange={onBackgroundChange}
              />
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <LuckyDesignSection
                  onApplyDesign={() => {}}
                  isGenerating={false}
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

            {currentStep === 4 && (
              <CardSettingsSection
                isOpen={true}
                onOpenChange={() => {}}
                cardFinish={cardFinish}
                onCardFinishChange={onCardFinishChange}
              />
            )}

            {currentStep === 5 && (
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

            {/* Enhanced Advanced Controls Section - Always Available */}
            <AdvancedControlsSection
              isOpen={openSections.advancedControls}
              onOpenChange={(open) => toggleSection('advancedControls', open)}
              onFlipCard={() => console.log('Flip from sidebar')}
              onResetCard={() => console.log('Reset from sidebar')}
              onToggleAutoRotate={onAutoRotateToggle}
              onScaleChange={() => {}}
              onFaceCamera={() => console.log('Face camera')}
              onShowBack={() => console.log('Show back')}
              scale={0.8}
              autoRotate={autoRotate}
              isFlipped={false}
              isFlipping={false}
            />
          </div>

          {/* Step Navigation */}
          <div className="p-4 border-t border-gray-700 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <Button
              size="sm"
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
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
