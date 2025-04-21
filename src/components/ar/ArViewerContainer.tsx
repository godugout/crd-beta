
import React from 'react';
import { Card } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArPreviewPanel from '@/components/ar/ArPreviewPanel';
import ArSettingsPanel from '@/components/ar/ArSettingsPanel';
import { CrdButton } from '@/components/ui/crd-button';
import { Smartphone } from 'lucide-react';

interface ArViewerContainerProps {
  activeCard: Card | null;
  availableCards: Card[];
  cameraError: string | null;
  scale: number;
  setScale: (scale: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
  onLaunchAr: () => void;
}

const ArViewerContainer: React.FC<ArViewerContainerProps> = ({
  activeCard,
  availableCards,
  cameraError = null,
  scale = 1,
  setScale,
  rotation = 0,
  setRotation,
  onLaunchAr
}) => {
  // Handle scale changes by calling the provided function
  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
  };
  
  // Handle rotation changes by calling the provided function
  const handleRotationChange = (newRotation: number) => {
    setRotation(newRotation);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 border-b bg-gradient-to-r from-crd-primary/10 to-blue-100/30">
        <h1 className="display-medium mb-2">AR Card Experience</h1>
        <p className="text-medium text-gray-600 mb-4">
          Bring your cards to life with augmented reality. View, rotate, and interact with your cards in 3D space.
        </p>
        <CrdButton
          variant="gradient"
          size="lg"
          className="w-full md:w-auto"
          onClick={onLaunchAr}
          disabled={!!cameraError || !activeCard}
        >
          <Smartphone className="h-5 w-5 mr-2" />
          <span className="display-small">Launch AR Experience</span>
        </CrdButton>
        {cameraError && (
          <p className="mt-2 text-small text-red-500">{cameraError}</p>
        )}
      </div>
      
      <Tabs defaultValue="preview" className="w-full">
        <div className="border-b">
          <div className="px-6">
            <TabsList className="mt-4">
              <TabsTrigger value="preview">Card Preview</TabsTrigger>
              <TabsTrigger value="settings">AR Settings</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="preview" className="p-6">
          <ArPreviewPanel 
            activeCard={activeCard}
            availableCards={availableCards}
            cameraError={cameraError}
            onLaunchAr={onLaunchAr}
          />
        </TabsContent>
        
        <TabsContent value="settings" className="p-6">
          <ArSettingsPanel
            scale={scale}
            setScale={handleScaleChange}
            rotation={rotation}
            setRotation={handleRotationChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArViewerContainer;
