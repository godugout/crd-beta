
import React from 'react';

interface TemplateSelectionStepProps {
  selectedTemplate?: string;
  onSelectTemplate?: (template: string) => void;
}

const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({ 
  selectedTemplate, 
  onSelectTemplate 
}) => {
  // Implementation will come later
  return <div>Template Selection Step</div>;
};

export default TemplateSelectionStep;
