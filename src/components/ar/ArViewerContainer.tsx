
import React from 'react';
import { Card } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArPreviewPanel from '@/components/ar/ArPreviewPanel';
import ArSettingsPanel from '@/components/ar/ArSettingsPanel';

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
  cameraError,
  scale,
  setScale,
  rotation,
  setRotation,
  onLaunchAr
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
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
            setScale={setScale}
            rotation={rotation}
            setRotation={setRotation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArViewerContainer;
