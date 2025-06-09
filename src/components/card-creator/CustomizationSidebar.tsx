
import React from 'react';
import { TemplateGallery } from './TemplateGallery';
import { EnvironmentSelector } from './EnvironmentSelector';
import { StyleControls } from './StyleControls';
import { QuickActionsPanel } from './QuickActionsPanel';

interface CustomizationSidebarProps {
  show: boolean;
  quickTemplates: any[];
  environments: any[];
  styleVariations: string[];
  selectedTemplate: any;
  selectedEnvironment: any;
  selectedStyle: string;
  isLoading: boolean;
  onTemplateChange: (template: any) => void;
  onEnvironmentSelect: (env: any) => void;
  onStyleSelect: (style: string) => void;
  onRandomize: () => void;
  onSave: () => void;
}

export const CustomizationSidebar: React.FC<CustomizationSidebarProps> = ({
  show,
  quickTemplates,
  environments,
  styleVariations,
  selectedTemplate,
  selectedEnvironment,
  selectedStyle,
  isLoading,
  onTemplateChange,
  onEnvironmentSelect,
  onStyleSelect,
  onRandomize,
  onSave
}) => {
  if (!show) return null;

  return (
    <div className="w-80 bg-black/40 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto">
      <div className="space-y-6">
        <TemplateGallery
          templates={quickTemplates}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={onTemplateChange}
        />

        <EnvironmentSelector
          environments={environments}
          selectedEnvironment={selectedEnvironment}
          onEnvironmentSelect={onEnvironmentSelect}
        />

        <StyleControls
          styles={styleVariations}
          selectedStyle={selectedStyle}
          onStyleSelect={onStyleSelect}
        />

        <QuickActionsPanel
          isLoading={isLoading}
          onRandomize={onRandomize}
          onSave={onSave}
        />
      </div>
    </div>
  );
};
