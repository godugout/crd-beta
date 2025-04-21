
import React from 'react';
import { OaklandTemplateType, oaklandTemplates } from './OaklandCardTemplates';
import OaklandTemplateSelector from './OaklandTemplateSelector';
import OaklandTemplatePreview from './OaklandTemplatePreview';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OaklandMemoryData } from '@/lib/types';
import { format } from 'date-fns';

interface OaklandEditorIntegrationProps {
  selectedTemplate: OaklandTemplateType;
  onTemplateChange: (template: OaklandTemplateType) => void;
  memoryData: Partial<OaklandMemoryData>;
  onMemoryDataChange: (data: Partial<OaklandMemoryData>) => void;
}

const OaklandEditorIntegration: React.FC<OaklandEditorIntegrationProps> = ({
  selectedTemplate,
  onTemplateChange,
  memoryData,
  onMemoryDataChange
}) => {
  // For the preview, use existing data or defaults
  const previewData: OaklandMemoryData = {
    title: memoryData.title || 'My Oakland Memory',
    description: memoryData.description || 'What happened at this memorable A\'s moment?',
    date: memoryData.date || format(new Date(), 'yyyy-MM-dd'),
    memoryType: memoryData.memoryType || 'game',
    opponent: memoryData.opponent || 'Giants',
    score: memoryData.score || 'A\'s 5 - 3',
    location: memoryData.location || 'Oakland Coliseum',
    section: memoryData.section || 'Section 112',
    attendees: memoryData.attendees || ['Friend', 'Family'],
    tags: memoryData.tags || ['oakland', 'athletics', 'memory'],
    template: selectedTemplate || 'classic', // Ensure template is set
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Oakland A's Memory Templates</h2>
        
        <Tabs defaultValue="select">
          <TabsList className="mb-4">
            <TabsTrigger value="select">Select Template</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="info">Template Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="select">
            <OaklandTemplateSelector 
              selectedTemplate={selectedTemplate}
              onChange={onTemplateChange}
            />
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="flex flex-col items-center">
              <OaklandTemplatePreview 
                type={selectedTemplate} 
                memory={previewData}
                className="w-64"
              />
              
              <p className="text-sm text-gray-500 mt-4">
                This is how your memory will look with the {oaklandTemplates[selectedTemplate].name} template.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{oaklandTemplates[selectedTemplate].name}</h3>
                <p className="text-sm text-gray-600">{oaklandTemplates[selectedTemplate].description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Era</h4>
                <p className="text-sm text-gray-600">{oaklandTemplates[selectedTemplate].years}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Best for</h4>
                <p className="text-sm text-gray-600">
                  {selectedTemplate === 'classic' && "Standard game memories and general Oakland A's moments."}
                  {selectedTemplate === 'dynasty' && "Historic moments, memorable achievements, and tributes to the championship years."}
                  {selectedTemplate === 'moneyball' && "Analytics-focused content, player statistics, and strategic moments."}
                  {selectedTemplate === 'coliseum' && "Stadium-specific memories and last season moments at the Coliseum."}
                  {selectedTemplate === 'tailgate' && "Fan experiences, parking lot events, and community gatherings."}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default OaklandEditorIntegration;
