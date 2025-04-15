
import React from 'react';

export interface CardTemplate {
  id: string;
  name: string;
  previewUrl: string;
  sport?: string;
  style?: string;
  description?: string;
  effects?: string[];
}

interface TemplateLibraryProps {
  onSelectTemplate: (template: CardTemplate) => void;
  sportFilter?: string;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onSelectTemplate,
  sportFilter
}) => {
  // Sample templates - would be fetched from an API in a real app
  const templates: CardTemplate[] = [
    {
      id: 'template-chrome',
      name: 'Topps Chrome',
      previewUrl: '/assets/templates/topps-chrome.jpg',
      sport: 'baseball',
      style: 'premium',
      effects: ['Chrome']
    },
    {
      id: 'template-prizm',
      name: 'Panini Prizm',
      previewUrl: '/assets/templates/panini-prizm.jpg',
      sport: 'basketball',
      style: 'premium',
      effects: ['Refractor']
    },
    {
      id: 'template-black-diamond',
      name: 'Upper Deck Black Diamond',
      previewUrl: '/assets/templates/black-diamond.jpg',
      sport: 'hockey',
      style: 'premium',
      effects: ['Cracked Ice']
    }
  ];
  
  const filteredTemplates = sportFilter 
    ? templates.filter(template => template.sport === sportFilter)
    : templates;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Card Templates</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="aspect-[2.5/3.5] bg-gray-100">
              <img 
                src={template.previewUrl}
                alt={template.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x560?text=Template';
                }}
              />
            </div>
            <div className="p-3">
              <h3 className="font-medium">{template.name}</h3>
              {template.sport && (
                <p className="text-xs text-gray-500 capitalize">{template.sport}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary;
