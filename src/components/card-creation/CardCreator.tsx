
import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, ChevronRight, Upload } from 'lucide-react';
import CardScanUpload from './CardScanUpload';
import { useCardEffectsStack } from './hooks/useCardEffectsStack';
import CardEditorSidebar from './CardEditorSidebar';
import CardPreviewCanvas from './CardPreviewCanvas';
import CardLayersPanel from './CardLayersPanel';
import { useLayers } from './hooks/useLayers';

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

  const progressPercentage = (currentStep / 5) * 100;

  const StepIndicator = ({ step, label, current }: { step: number, label: string, current: number }) => (
    <div className={`flex flex-col items-center ${current >= step ? 'text-litmus-green' : 'text-gray-400'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
        current > step ? 'bg-litmus-green text-white' : 
        current === step ? 'border-2 border-litmus-green text-litmus-green' : 
        'border-2 border-gray-200 text-gray-400'
      }`}>
        {current > step ? <Check size={18} /> : step}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create a <span className="text-litmus-green">CRD</span></h1>
          <div className="w-full max-w-xs mx-auto h-1 bg-litmus-green mt-2"></div>
        </div>
        
        <div className="flex justify-between items-center max-w-3xl mx-auto py-4">
          <StepIndicator step={1} label="Upload" current={currentStep} />
          <div className="flex-1 h-0.5 bg-gray-200 mx-2">
            <div className="h-full bg-litmus-green" style={{ width: `${currentStep > 1 ? 100 : 0}%` }}></div>
          </div>
          <StepIndicator step={2} label="Design" current={currentStep} />
          <div className="flex-1 h-0.5 bg-gray-200 mx-2">
            <div className="h-full bg-litmus-green" style={{ width: `${currentStep > 2 ? 100 : 0}%` }}></div>
          </div>
          <StepIndicator step={3} label="Effects" current={currentStep} />
          <div className="flex-1 h-0.5 bg-gray-200 mx-2">
            <div className="h-full bg-litmus-green" style={{ width: `${currentStep > 3 ? 100 : 0}%` }}></div>
          </div>
          <StepIndicator step={4} label="Text" current={currentStep} />
          <div className="flex-1 h-0.5 bg-gray-200 mx-2">
            <div className="h-full bg-litmus-green" style={{ width: `${currentStep > 4 ? 100 : 0}%` }}></div>
          </div>
          <StepIndicator step={5} label="Preview" current={currentStep} />
        </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Upload CRD Image</h2>
                    <CardScanUpload onImageCaptured={handleImageCaptured} />
                    <p className="text-sm text-gray-500 mt-4">
                      For best results, use a high-quality image with a 2.5:3.5 aspect ratio
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">CRD Details</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-sm font-medium">TITLE</Label>
                        <Input 
                          id="title" 
                          placeholder="Enter title for your CRD" 
                          value={cardData.title}
                          onChange={(e) => setCardData({...cardData, title: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium">DESCRIPTION</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Describe your CRD"
                          value={cardData.description}
                          onChange={(e) => setCardData({...cardData, description: e.target.value})}
                          className="mt-1 resize-none" 
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    type="button"
                    disabled={!cardData.imageUrl}
                    className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
                    onClick={() => {
                      setCurrentStep(2);
                      setActiveTab('design');
                    }}
                  >
                    Continue <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
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
                      <Button 
                        className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
                        onClick={() => {
                          setCurrentStep(3);
                          setActiveTab('effects');
                        }}
                      >
                        Continue <ChevronRight size={16} className="ml-1" />
                      </Button>
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
                
                <div className="flex justify-end mt-6">
                  <Button 
                    className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
                    onClick={() => {
                      setCurrentStep(4);
                      setActiveTab('text');
                    }}
                  >
                    Continue <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="text" className="m-0">
                <h2 className="text-xl font-semibold mb-4">Add Text & Details</h2>
                <p>Text editor will be implemented here.</p>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
                    onClick={() => {
                      setCurrentStep(5);
                      setActiveTab('preview');
                    }}
                  >
                    Continue <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="m-0">
                <h2 className="text-xl font-semibold mb-4">Preview Your Card</h2>
                <p>Preview and export options will be implemented here.</p>
                
                <div className="flex justify-end mt-6">
                  <Button className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6">
                    Save CRD
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <div>
          <div className="bg-gray-900 text-white rounded-lg overflow-hidden h-full flex flex-col shadow-lg">
            <div className="bg-gray-800 p-4 flex justify-between items-center">
              <h3 className="font-medium">Preview</h3>
              <span className="text-xs text-gray-400">Live view</span>
            </div>
            <div className="flex-grow flex items-center justify-center p-6 relative bg-gray-950">
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
                <div className="text-center text-gray-400 p-10 w-full">
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center">
                    <Upload className="h-12 w-12 mb-4 text-gray-600" />
                    <p className="mb-2">Upload an image to preview</p>
                    <p className="text-xs text-gray-500">Your CRD will appear here</p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-800 p-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">{cardData.title || "No title yet"}</h4>
                <p className="text-xs text-gray-400">{cardData.description || "Add a description to your CRD"}</p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
                <span className="text-xs text-gray-500">Auto saving</span>
                <div className="flex space-x-1">
                  {cardData.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreator;
