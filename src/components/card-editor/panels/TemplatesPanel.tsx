
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TemplatesPanelProps {
  selectedTemplate?: string;
  onTemplateSelect: (template: string) => void;
}

const TemplatesPanel: React.FC<TemplatesPanelProps> = ({
  selectedTemplate,
  onTemplateSelect
}) => {
  const templates = [
    { id: 'classic', name: 'Classic', thumbnail: '/templates/classic.png' },
    { id: 'modern', name: 'Modern', thumbnail: '/templates/modern.png' },
    { id: 'vintage', name: 'Vintage', thumbnail: '/templates/vintage.png' },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`p-2 cursor-pointer transition-all ${
                selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <div className="aspect-[2.5/3.5] relative rounded-sm overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-center mt-1">{template.name}</p>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default TemplatesPanel;
