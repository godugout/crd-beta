
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Palette } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  preview: string;
  effects: string[];
}

interface TemplateGalleryProps {
  templates: Template[];
  selectedTemplate: Template;
  onTemplateSelect: (template: Template) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  return (
    <div>
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Palette className="h-4 w-4" />
        Templates
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedTemplate.id === template.id
                ? 'ring-2 ring-blue-500 bg-blue-900/20'
                : 'bg-gray-800/50 hover:bg-gray-700/50'
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            <CardContent className="p-3">
              <div className="aspect-[3/4] bg-gray-600 rounded mb-2 overflow-hidden">
                <img 
                  src={template.preview} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-white text-xs text-center">{template.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
