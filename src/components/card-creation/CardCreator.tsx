
import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCardEffectsStack } from './hooks/useCardEffectsStack';
import { useLayers } from './hooks/useLayers';
import StepProgress from './components/StepProgress';
import UploadTab from './tabs/UploadTab';
import DesignTab from './tabs/DesignTab';
import EffectsTab from './tabs/EffectsTab';
import TextTab from './tabs/TextTab';
import PreviewTab from './tabs/PreviewTab';
import CardPreviewSidebar from './components/CardPreviewSidebar';

// Export types so other files can import them
export interface CardDesignState {
  title: string;
  description: string;
  tags: string[];
  borderColor: string;
  backgroundColor: string;
  borderRadius: string;
  imageUrl: string | null;
  player?: string;
  team?: string;
  year?: string;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Size {
  width: number | string;
  height: number | string;
}

export interface CardLayer {
  id: string;
  type: 'image' | 'text' | 'shape';
  content: string | object;
  position: Position;
  size: Size;
  rotation: number;
  opacity: number;
  visible: boolean;
  effectIds: string[];
}

const CardCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [currentStep, setCurrentStep] = useState(1);
  const [cardImage, setCardImage] = useState<string | null>(null);
  const { effectStack, addEffect, removeEffect, toggleEffect, getEffectClasses } = useCardEffectsStack();
  const previewCanvasRef = useRef<HTMLDivElement>(null);

  const [cardData, setCardData] = useState<CardDesignState>({
    title: '',
    description: '',
    tags: [],
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    imageUrl: null,
  });

  const {
    layers,
    activeLayerId,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    setActiveLayer
  } = useLayers();

  const handleImageCaptured = (imageUrl: string) => {
    setCardImage(imageUrl);
    setCardData(prev => ({ ...prev, imageUrl }));
    setCurrentStep(2);
    setActiveTab('design');
  };

  // Create a handler function for adding layers
  const handleAddLayer = (type: 'image' | 'text' | 'shape') => {
    const newLayer: Omit<CardLayer, 'id'> = {
      type,
      content: type === 'text' ? 'New Text' : (type === 'image' ? '' : {}),
      position: { x: 50, y: 50, z: layers.length + 1 },
      size: { width: type === 'text' ? 'auto' : 100, height: type === 'text' ? 'auto' : 100 },
      rotation: 0,
      opacity: 1,
      visible: true,
      effectIds: []
    };
    
    addLayer(newLayer);
  };

  // Navigation handlers
  const handleContinueToDesign = () => {
    setCurrentStep(2);
    setActiveTab('design');
  };

  const handleContinueToEffects = () => {
    setCurrentStep(3);
    setActiveTab('effects');
  };

  const handleContinueToText = () => {
    setCurrentStep(4);
    setActiveTab('text');
  };

  const handleContinueToPreview = () => {
    setCurrentStep(5);
    setActiveTab('preview');
  };

  const handleSaveCRD = () => {
    // Implement save functionality
    console.log('Saving CRD', { cardData, layers });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create a <span className="text-litmus-green">CRD</span></h1>
          <div className="w-full max-w-xs mx-auto h-1 bg-litmus-green mt-2"></div>
        </div>
        
        <StepProgress currentStep={currentStep} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="upload" 
                disabled={currentStep < 1}
                className={`rounded-md ${activeTab === 'upload' ? 'bg-white shadow-sm' : ''}`}
              >
                Upload
              </TabsTrigger>
              <TabsTrigger 
                value="design" 
                disabled={currentStep < 2}
                className={`rounded-md ${activeTab === 'design' ? 'bg-white shadow-sm' : ''}`}
              >
                Design
              </TabsTrigger>
              <TabsTrigger 
                value="effects" 
                disabled={currentStep < 3}
                className={`rounded-md ${activeTab === 'effects' ? 'bg-white shadow-sm' : ''}`}
              >
                Effects
              </TabsTrigger>
              <TabsTrigger 
                value="text" 
                disabled={currentStep < 4}
                className={`rounded-md ${activeTab === 'text' ? 'bg-white shadow-sm' : ''}`}
              >
                Text
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                disabled={currentStep < 5}
                className={`rounded-md ${activeTab === 'preview' ? 'bg-white shadow-sm' : ''}`}
              >
                Preview
              </TabsTrigger>
            </TabsList>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <TabsContent value="upload" className="m-0 space-y-6">
                <UploadTab 
                  cardData={cardData}
                  setCardData={setCardData}
                  onImageCaptured={handleImageCaptured}
                  onContinue={handleContinueToDesign}
                />
              </TabsContent>
              
              <TabsContent value="design" className="m-0">
                <DesignTab
                  cardData={cardData}
                  setCardData={setCardData}
                  layers={layers}
                  activeLayerId={activeLayerId}
                  onImageUpload={handleImageCaptured}
                  onLayerSelect={setActiveLayer}
                  onLayerUpdate={updateLayer}
                  onAddLayer={handleAddLayer}
                  onDeleteLayer={deleteLayer}
                  onMoveLayerUp={moveLayerUp}
                  onMoveLayerDown={moveLayerDown}
                  onContinue={handleContinueToEffects}
                />
              </TabsContent>
              
              <TabsContent value="effects" className="m-0">
                <EffectsTab onContinue={handleContinueToText} />
              </TabsContent>
              
              <TabsContent value="text" className="m-0">
                <TextTab onContinue={handleContinueToPreview} />
              </TabsContent>
              
              <TabsContent value="preview" className="m-0">
                <PreviewTab onSave={handleSaveCRD} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <div>
          <CardPreviewSidebar
            cardData={cardData}
            layers={layers}
            activeLayerId={activeLayerId}
            effectClasses={getEffectClasses()}
            onLayerSelect={setActiveLayer}
            onLayerUpdate={updateLayer}
            previewCanvasRef={previewCanvasRef}
          />
        </div>
      </div>
    </div>
  );
};

export default CardCreator;
