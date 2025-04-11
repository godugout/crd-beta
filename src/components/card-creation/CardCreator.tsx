import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import CardScanUpload from './CardScanUpload';
import { useCardEffectsStack } from './hooks/useCardEffectsStack';
import CardEditorSidebar from './CardEditorSidebar';
import CardPreviewCanvas from './CardPreviewCanvas';
import CardLayersPanel from './CardLayersPanel';
import { useLayers } from './hooks/useLayers';

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
  const [activeTab, setActiveTab] = React.useState('upload');
  const [currentStep, setCurrentStep] = React.useState(1);
  const [cardImage, setCardImage] = React.useState<string | null>(null);
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

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-center">Create a <span className="text-litmus-green">CRD</span></h1>
        
        <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-litmus-green font-medium' : ''}`}>
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-litmus-green text-white mr-1">1</span>
            Upload
          </div>
          <div className="w-8 h-[2px] bg-gray-200">
            <div className="h-full bg-litmus-green" style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
          </div>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-litmus-green font-medium' : ''}`}>
            <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-1 ${currentStep >= 2 ? 'bg-litmus-green text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
            Design
          </div>
          <div className="w-8 h-[2px] bg-gray-200">
            <div className="h-full bg-litmus-green" style={{ width: currentStep >= 3 ? '100%' : '0%' }}></div>
          </div>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-litmus-green font-medium' : ''}`}>
            <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-1 ${currentStep >= 3 ? 'bg-litmus-green text-white' : 'bg-gray-200 text-gray-500'}`}>3</span>
            Effects
          </div>
          <div className="w-8 h-[2px] bg-gray-200">
            <div className="h-full bg-litmus-green" style={{ width: currentStep >= 4 ? '100%' : '0%' }}></div>
          </div>
          <div className={`flex items-center ${currentStep >= 4 ? 'text-litmus-green font-medium' : ''}`}>
            <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-1 ${currentStep >= 4 ? 'bg-litmus-green text-white' : 'bg-gray-200 text-gray-500'}`}>4</span>
            Text
          </div>
          <div className="w-8 h-[2px] bg-gray-200">
            <div className="h-full bg-litmus-green" style={{ width: currentStep >= 5 ? '100%' : '0%' }}></div>
          </div>
          <div className={`flex items-center ${currentStep >= 5 ? 'text-litmus-green font-medium' : ''}`}>
            <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-1 ${currentStep >= 5 ? 'bg-litmus-green text-white' : 'bg-gray-200 text-gray-500'}`}>5</span>
            Preview
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="upload" disabled={currentStep < 1}>Upload</TabsTrigger>
              <TabsTrigger value="design" disabled={currentStep < 2}>Design</TabsTrigger>
              <TabsTrigger value="effects" disabled={currentStep < 3}>Effects</TabsTrigger>
              <TabsTrigger value="text" disabled={currentStep < 4}>Text</TabsTrigger>
              <TabsTrigger value="preview" disabled={currentStep < 5}>Preview</TabsTrigger>
            </TabsList>
            
            <div className="bg-white rounded-lg border p-6">
              <TabsContent value="upload" className="m-0">
                <CardScanUpload onImageCaptured={handleImageCaptured} />
              </TabsContent>
              
              <TabsContent value="design" className="m-0">
                <h2 className="text-xl font-semibold mb-4">Design Your Card</h2>
                {cardImage ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CardEditorSidebar
                        cardData={cardData}
                        onChange={setCardData}
                        onImageUpload={handleImageCaptured}
                      />
                      
                      <CardLayersPanel
                        layers={layers}
                        activeLayerId={activeLayerId}
                        onLayerSelect={setActiveLayer}
                        onLayerUpdate={updateLayer}
                        onAddLayer={handleAddLayer}
                        onDeleteLayer={deleteLayer}
                        onMoveLayerUp={moveLayerUp}
                        onMoveLayerDown={moveLayerDown}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button 
                        className="px-4 py-2 bg-litmus-green text-white rounded-md hover:bg-litmus-green-dark transition-colors"
                        onClick={() => {
                          setCurrentStep(3);
                          setActiveTab('effects');
                        }}
                      >
                        Continue to Effects
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p>Upload a card image first to start designing</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="effects" className="m-0">
                <h2 className="text-xl font-semibold mb-4">Apply Effects</h2>
                <p>Effects editor will be implemented here.</p>
              </TabsContent>
              
              <TabsContent value="text" className="m-0">
                <h2 className="text-xl font-semibold mb-4">Add Text & Details</h2>
                <p>Text editor will be implemented here.</p>
              </TabsContent>
              
              <TabsContent value="preview" className="m-0">
                <h2 className="text-xl font-semibold mb-4">Preview Your Card</h2>
                <p>Preview and export options will be implemented here.</p>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <div>
          <div className="bg-gray-900 text-white rounded-lg overflow-hidden h-full flex flex-col">
            <div className="bg-gray-800 p-4 flex justify-between items-center">
              <h3 className="font-medium">Preview</h3>
              <span className="text-xs text-gray-400">Live view</span>
            </div>
            <div className="flex-grow flex items-center justify-center p-6 relative">
              {cardData.imageUrl ? (
                <CardPreviewCanvas
                  ref={previewCanvasRef}
                  cardData={cardData}
                  layers={layers}
                  activeLayerId={activeLayerId}
                  onLayerSelect={setActiveLayer}
                  onLayerUpdate={updateLayer}
                  effectClasses={getEffectClasses()}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <p>Upload an image to preview</p>
                </div>
              )}
            </div>
            <div className="bg-gray-800 p-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">{cardData.title || "No title yet"}</h4>
                <p className="text-xs text-gray-400">{cardData.description || "Add a description to your CRD"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreator;
