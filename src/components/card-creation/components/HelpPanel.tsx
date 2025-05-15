
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpPanelProps {
  stepKey: string;
  onClose: () => void;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ stepKey, onClose }) => {
  // Help content for each step
  const helpContent: Record<string, { title: string; content: string }> = {
    template: {
      title: 'Choosing a Template',
      content: 'Select a template to start with. This will define the basic layout and style of your card.'
    },
    upload: {
      title: 'Uploading an Image',
      content: 'Upload a high-quality image for your card. The best results come from images with clear subjects and good lighting.'
    },
    design: {
      title: 'Designing Your Card',
      content: 'Customize the design of your card including borders, colors, and overall style.'
    },
    effects: {
      title: 'Adding Special Effects',
      content: 'Add special visual effects to make your card stand out, like holographic finishes or reflective surfaces.'
    },
    text: {
      title: 'Adding Text and Details',
      content: 'Add titles, descriptions, and other text details to your card.'
    },
    finalize: {
      title: 'Finalizing Your Card',
      content: 'Review your card and make any final adjustments before saving it to your collection.'
    }
  };

  const { title, content } = helpContent[stepKey] || {
    title: 'Help',
    content: 'Choose an option from the steps above to proceed with creating your card.'
  };

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-2 right-2"
      >
        <X className="h-4 w-4" />
      </Button>
      <h3 className="text-lg font-medium text-blue-800 mb-2">{title}</h3>
      <p className="text-blue-700">{content}</p>
    </div>
  );
};

export default HelpPanel;
