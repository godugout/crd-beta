
import React from 'react';
import { useCardCreator } from '@/hooks/useCardCreator';
import { CardCreatorHeader } from '@/components/card-creator/CardCreatorHeader';
import { Card3DPreview } from '@/components/card-creator/Card3DPreview';
import { CustomizationSidebar } from '@/components/card-creator/CustomizationSidebar';

const StreamlinedCardCreator: React.FC = () => {
  const {
    // State
    selectedTemplate,
    selectedEnvironment,
    selectedStyle,
    autoRotate,
    showSidebar,
    isLoading,
    currentCard,
    quickTemplates,
    environments,
    styleVariations,
    
    // Actions
    updateState,
    handleTemplateChange,
    handleRandomizeStyle,
    handleSaveCard,
  } = useCardCreator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Main 3D Preview Area */}
      <div className="flex-1 flex flex-col">
        <CardCreatorHeader
          showSidebar={showSidebar}
          autoRotate={autoRotate}
          isLoading={isLoading}
          onToggleSidebar={() => updateState({ showSidebar: !showSidebar })}
          onToggleAutoRotate={() => updateState({ autoRotate: !autoRotate })}
          onRandomize={handleRandomizeStyle}
          onSave={handleSaveCard}
        />

        <Card3DPreview
          currentCard={currentCard}
          selectedEnvironment={selectedEnvironment}
          selectedTemplate={selectedTemplate}
          selectedStyle={selectedStyle}
          autoRotate={autoRotate}
        />
      </div>

      {/* Customization Sidebar */}
      <CustomizationSidebar
        show={showSidebar}
        quickTemplates={quickTemplates}
        environments={environments}
        styleVariations={styleVariations}
        selectedTemplate={selectedTemplate}
        selectedEnvironment={selectedEnvironment}
        selectedStyle={selectedStyle}
        isLoading={isLoading}
        onTemplateChange={handleTemplateChange}
        onEnvironmentSelect={(env) => updateState({ selectedEnvironment: env })}
        onStyleSelect={(style) => updateState({ selectedStyle: style })}
        onRandomize={handleRandomizeStyle}
        onSave={handleSaveCard}
      />
    </div>
  );
};

export default StreamlinedCardCreator;
