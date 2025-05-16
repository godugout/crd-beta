
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash, RotateCw, Download, MoveUp, MoveDown, Save } from 'lucide-react';
import { CardElement } from '@/lib/types/cardElements';
import { elementLibrary } from '@/lib/elements/ElementLibrary';
import { placementEngine } from '@/lib/elements/PlacementEngine';
import ElementLibraryBrowser from './ElementLibraryBrowser';
import ElementUploadForm from './ElementUploadForm';
import ElementPlacementCanvas from './ElementPlacementCanvas';
import { toastUtils } from '@/lib/utils/toast-utils';

const ElementsSystemDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [canvasElements, setCanvasElements] = useState<CardElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CardElement | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Add an element to the canvas
  const handleAddElement = (element: CardElement) => {
    // Create a copy of the element with a new ID and position for the canvas
    const canvasElement: CardElement = {
      ...element,
      id: `canvas-${element.id}`,
      position: {
        ...element.position,
        x: 200, // Position in center of canvas
        y: 280, // Position in center of canvas
        z: canvasElements.length // Place on top
      }
    };
    
    setCanvasElements([...canvasElements, canvasElement]);
    setSelectedElement(canvasElement);
    
    toastUtils.success('Element Added', `Added ${element.name} to canvas`);
  };

  // Handle element selection on the canvas
  const handleSelectElement = (element: CardElement | null) => {
    setSelectedElement(element);
  };

  // Handle moving an element
  const handleElementMove = (element: CardElement, newPosition: { x: number; y: number }) => {
    setCanvasElements(elements => {
      return elements.map(el => {
        if (el.id === element.id) {
          return {
            ...el,
            position: {
              ...el.position,
              x: newPosition.x,
              y: newPosition.y
            }
          };
        }
        return el;
      });
    });
  };

  // Handle resizing an element
  const handleElementResize = (element: CardElement, newSize: { width: number; height: number }) => {
    setCanvasElements(elements => {
      return elements.map(el => {
        if (el.id === element.id) {
          return {
            ...el,
            size: {
              ...el.size,
              width: newSize.width,
              height: newSize.height,
              aspectRatio: newSize.width / newSize.height
            }
          };
        }
        return el;
      });
    });
  };

  // Handle rotating an element
  const handleElementRotate = (element: CardElement, newRotation: number) => {
    setCanvasElements(elements => {
      return elements.map(el => {
        if (el.id === element.id) {
          return {
            ...el,
            position: {
              ...el.position,
              rotation: newRotation
            }
          };
        }
        return el;
      });
    });
  };

  // Handle deleting an element
  const handleDeleteElement = () => {
    if (!selectedElement) return;
    
    setCanvasElements(elements => 
      elements.filter(el => el.id !== selectedElement.id)
    );
    setSelectedElement(null);
    
    toastUtils.success('Element Removed', 'Removed element from canvas');
  };

  // Handle moving an element up in the layer stack
  const handleMoveUp = () => {
    if (!selectedElement) return;
    
    setCanvasElements(elements => {
      const index = elements.findIndex(el => el.id === selectedElement.id);
      if (index === elements.length - 1) return elements; // Already at top
      
      const newElements = [...elements];
      // Swap z-index values
      const temp = newElements[index].position.z;
      newElements[index].position.z = newElements[index + 1].position.z;
      newElements[index + 1].position.z = temp;
      
      // Sort by z-index
      return newElements.sort((a, b) => a.position.z - b.position.z);
    });
  };

  // Handle moving an element down in the layer stack
  const handleMoveDown = () => {
    if (!selectedElement) return;
    
    setCanvasElements(elements => {
      const index = elements.findIndex(el => el.id === selectedElement.id);
      if (index === 0) return elements; // Already at bottom
      
      const newElements = [...elements];
      // Swap z-index values
      const temp = newElements[index].position.z;
      newElements[index].position.z = newElements[index - 1].position.z;
      newElements[index - 1].position.z = temp;
      
      // Sort by z-index
      return newElements.sort((a, b) => a.position.z - b.position.z);
    });
  };

  // Export/save the current design
  const handleSaveDesign = () => {
    const designData = {
      elements: canvasElements,
      timestamp: new Date().toISOString(),
    };
    
    // In a real app, you would save this to a database
    // or provide a download option
    console.log('Saving design:', designData);
    
    // Simulate download
    const dataStr = JSON.stringify(designData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'card-design.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toastUtils.success('Design Saved', 'Your design has been saved');
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Card Elements System</h1>
          <p className="text-muted-foreground">
            Add custom elements to your cards with our extensive library
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSnapToGrid(!snapToGrid)}
          >
            {snapToGrid ? 'Disable Snap' : 'Enable Snap'}
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleSaveDesign}
          >
            <Save className="h-4 w-4 mr-1" /> Save Design
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel: Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="py-3">
              <CardTitle>Card Canvas</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-6 bg-gray-50">
              <ElementPlacementCanvas
                elements={canvasElements}
                onElementSelect={handleSelectElement}
                onElementMove={handleElementMove}
                onElementResize={handleElementResize}
                onElementRotate={handleElementRotate}
                selectedElementId={selectedElement?.id || null}
                showGrid={showGrid}
                snapToGrid={snapToGrid}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-3 flex justify-between">
              <div className="text-sm text-muted-foreground">
                {canvasElements.length} elements • {selectedElement ? 'Element selected' : 'No selection'}
              </div>
              <div className="flex space-x-2">
                {selectedElement && (
                  <>
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={handleMoveUp}
                      title="Move Up"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={handleMoveDown}
                      title="Move Down"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive" 
                      size="sm"
                      onClick={handleDeleteElement}
                      title="Delete Element"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right panel: Library/Upload */}
        <div>
          <Card>
            <CardHeader className="px-6 py-3 border-b">
              <Tabs 
                defaultValue="browse" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="browse">Browse Elements</TabsTrigger>
                  <TabsTrigger value="upload">Upload New</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="px-6 py-4 max-h-[600px] overflow-y-auto">
              <TabsContent value="browse" className="m-0">
                <ElementLibraryBrowser 
                  onElementSelect={handleAddElement}
                  selectedElementId={selectedElement?.id || ''}
                />
              </TabsContent>
              <TabsContent value="upload" className="m-0">
                <ElementUploadForm 
                  onElementCreated={() => {
                    toastUtils.success('Element Created', 'New element added to the library');
                    setActiveTab("browse");
                  }}
                />
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ElementsSystemDemo;
