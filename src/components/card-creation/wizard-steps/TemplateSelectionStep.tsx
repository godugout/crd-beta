
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TemplateSelectionStepProps {
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
}

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    category: 'sports',
    imageUrl: 'https://placehold.co/300x400/e9e9e9/333333?text=Classic'
  },
  {
    id: 'modern',
    name: 'Modern',
    category: 'sports',
    imageUrl: 'https://placehold.co/300x400/2d2d2d/ffffff?text=Modern'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    category: 'sports',
    imageUrl: 'https://placehold.co/300x400/d4c09e/333333?text=Vintage'
  },
  {
    id: 'premium',
    name: 'Premium',
    category: 'premium',
    imageUrl: 'https://placehold.co/300x400/222639/gold?text=Premium'
  },
  {
    id: 'digital',
    name: 'Digital',
    category: 'modern',
    imageUrl: 'https://placehold.co/300x400/0a1929/4cc9f0?text=Digital'
  },
  {
    id: 'retro',
    name: 'Retro',
    category: 'vintage',
    imageUrl: 'https://placehold.co/300x400/f5e6c0/d14638?text=Retro'
  },
];

const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  selectedTemplate,
  onSelectTemplate
}) => {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          type="search" 
          placeholder="Search templates..." 
          className="pl-10"
        />
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="modern">Modern</TabsTrigger>
          <TabsTrigger value="vintage">Vintage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <RadioGroup 
            value={selectedTemplate} 
            onValueChange={onSelectTemplate}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {templates.map(template => (
              <div key={template.id} className="space-y-2">
                <RadioGroupItem 
                  value={template.id} 
                  id={template.id}
                  className="peer sr-only"
                />
                <Label 
                  htmlFor={template.id} 
                  className="flex flex-col items-center gap-2 rounded-md border-2 border-muted bg-transparent p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <img 
                    src={template.imageUrl}
                    alt={template.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <span>{template.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
        
        <TabsContent value="sports">
          <RadioGroup value={selectedTemplate} onValueChange={onSelectTemplate}>
            {templates
              .filter(t => t.category === 'sports')
              .map(template => (
                <div key={template.id} className="space-y-2">
                  <RadioGroupItem value={template.id} id={`sports-${template.id}`} className="peer sr-only" />
                  <Label 
                    htmlFor={`sports-${template.id}`}
                    className="flex flex-col items-center gap-2 rounded-md border-2 border-muted bg-transparent p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <img 
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <span>{template.name}</span>
                  </Label>
                </div>
              ))}
          </RadioGroup>
        </TabsContent>
        
        <TabsContent value="modern">
          <RadioGroup value={selectedTemplate} onValueChange={onSelectTemplate}>
            {templates
              .filter(t => t.category === 'modern')
              .map(template => (
                <div key={template.id} className="space-y-2">
                  <RadioGroupItem value={template.id} id={`modern-${template.id}`} className="peer sr-only" />
                  <Label 
                    htmlFor={`modern-${template.id}`}
                    className="flex flex-col items-center gap-2 rounded-md border-2 border-muted bg-transparent p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <img 
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <span>{template.name}</span>
                  </Label>
                </div>
              ))}
          </RadioGroup>
        </TabsContent>
        
        <TabsContent value="vintage">
          <RadioGroup value={selectedTemplate} onValueChange={onSelectTemplate}>
            {templates
              .filter(t => t.category === 'vintage')
              .map(template => (
                <div key={template.id} className="space-y-2">
                  <RadioGroupItem value={template.id} id={`vintage-${template.id}`} className="peer sr-only" />
                  <Label 
                    htmlFor={`vintage-${template.id}`}
                    className="flex flex-col items-center gap-2 rounded-md border-2 border-muted bg-transparent p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <img 
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <span>{template.name}</span>
                  </Label>
                </div>
              ))}
          </RadioGroup>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateSelectionStep;
