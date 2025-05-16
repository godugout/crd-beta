
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ElementLibraryBrowser from './ElementLibraryBrowser';
import ElementPlacementCanvas from './ElementPlacementCanvas';
import ElementUploadForm from './ElementUploadForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CardElement, ElementUploadMetadata } from '@/lib/types/cardElements';
import { elementUploadToCardElement } from '@/lib/utils/typeAdapters';
import { toast } from 'sonner';

const ElementsSystemDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [selectedElements, setSelectedElements] = useState<CardElement[]>([]);
  const [elements, setElements] = useState<CardElement[]>([]);
  
  // Handle element selection from the library
  const handleElementSelect = (element: CardElement) => {
    // Check if element is already selected
    if (selectedElements.some(e => e.id === element.id)) {
      setSelectedElements(selectedElements.filter(e => e.id !== element.id));
      toast.info(`Removed ${element.name} from selection`);
    } else {
      setSelectedElements([...selectedElements, element]);
      toast.success(`Added ${element.name} to selection`);
    }
  };
  
  // Handle element upload form submission
  const handleElementUpload = (data: ElementUploadMetadata) => {
    const newElement = elementUploadToCardElement(data);
    setElements([newElement, ...elements]);
    
    // Switch to library tab and show success message
    setActiveTab('library');
    toast.success(`Element ${data.name} uploaded successfully`);
  };
  
  // Clear selected elements
  const clearSelection = () => {
    setSelectedElements([]);
    toast.info('Selection cleared');
  };
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Element System Demo</CardTitle>
          <CardDescription>
            Browse, upload, and place elements on the canvas. This demo showcases the element management system.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="library">Element Library</TabsTrigger>
              <TabsTrigger value="upload">Upload Element</TabsTrigger>
              <TabsTrigger value="placement">Placement Canvas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="library" className="py-4">
              <ElementLibraryBrowser onElementSelect={handleElementSelect} />
            </TabsContent>
            
            <TabsContent value="upload" className="py-4">
              <ElementUploadForm onSubmit={handleElementUpload} />
            </TabsContent>
            
            <TabsContent value="placement" className="py-4">
              <ElementPlacementCanvas 
                selectedElements={selectedElements}
                onElementsChange={setSelectedElements}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            {selectedElements.length} element{selectedElements.length !== 1 ? 's' : ''} selected
          </div>
          
          <div className="flex gap-2">
            {selectedElements.length > 0 && (
              <Button variant="outline" onClick={clearSelection}>
                Clear Selection
              </Button>
            )}
            
            <Button 
              onClick={() => setActiveTab(activeTab === 'placement' ? 'library' : 'placement')}
            >
              {activeTab === 'placement' ? 'Back to Library' : 'Go to Placement Canvas'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ElementsSystemDemo;
