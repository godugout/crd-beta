
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Define the element type
export interface ElementItem {
  url: string;
  type: 'image' | 'shape' | 'icon';
  name: string;
}

interface ElementsPanelProps {
  onAddElement: (element: ElementItem) => void;
  sportType?: string;
}

const ElementsPanel: React.FC<ElementsPanelProps> = ({
  onAddElement,
  sportType = 'baseball'
}) => {
  // Sample elements for demonstration
  const sampleElements: ElementItem[] = [
    {
      url: '/assets/elements/baseball-logo.png',
      type: 'image',
      name: 'Baseball Logo'
    },
    {
      url: '/assets/elements/baseball-icon.svg',
      type: 'icon',
      name: 'Baseball Icon'
    },
    {
      url: '/assets/elements/trophy.svg',
      type: 'icon',
      name: 'Trophy'
    },
    {
      url: '#e2e2e2',
      type: 'shape',
      name: 'Rectangle'
    },
    {
      url: '#f8d568',
      type: 'shape',
      name: 'Circle'
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Search elements..."
          className="pl-8"
        />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Sport Elements</h3>
        
        <ScrollArea className="h-[calc(100vh-22rem)]">
          <div className="grid grid-cols-2 gap-2 pr-2">
            {sampleElements.map((element, index) => (
              <div
                key={`${element.name}-${index}`}
                className="border rounded-md p-2 cursor-pointer hover:border-primary transition-colors"
                onClick={() => onAddElement(element)}
              >
                {element.type === 'shape' ? (
                  <div 
                    className="aspect-square rounded-md"
                    style={{ backgroundColor: element.url }}
                  />
                ) : (
                  <div className="aspect-square rounded-md bg-gray-100 flex items-center justify-center">
                    <img 
                      src={element.url} 
                      alt={element.name}
                      className="max-w-full max-h-full p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                <p className="text-xs mt-1 text-center truncate">{element.name}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ElementsPanel;
