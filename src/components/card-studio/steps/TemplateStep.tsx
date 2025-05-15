
import React from 'react';
import { CardTemplate } from '@/components/card-templates/TemplateTypes';
import TemplateSelector from '../TemplateSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TemplateStepProps {
  onSelect: (template: CardTemplate) => void;
}

const TemplateStep: React.FC<TemplateStepProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TemplateSelector onSelect={onSelect} />
        </TabsContent>
        
        <TabsContent value="sports">
          <TemplateSelector onSelect={onSelect} />
        </TabsContent>
        
        <TabsContent value="premium">
          <TemplateSelector onSelect={onSelect} />
        </TabsContent>
        
        <TabsContent value="general">
          <TemplateSelector onSelect={onSelect} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateStep;
