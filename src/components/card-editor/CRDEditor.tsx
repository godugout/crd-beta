import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, RotateCcw, Download, X } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

import CardPreview from '@/components/card-creation/CardPreview';
import ImageUploader from '@/components/dam/ImageUploader';
import CardEffectsPanel from '@/components/card-creation/CardEffectsPanel';
import { useCardEffectsStack } from '@/components/card-creation/hooks/useCardEffectsStack';
import { useLayers } from '@/components/card-creation/hooks/useLayers';
import { CardDesignState, CardLayer } from '@/components/card-creation/types/cardTypes';

const CRDEditor: React.FC = () => {
  const previewCanvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('design');
  
  // Card state
  const [cardData, setCardData] = useState<CardDesignState>({
    title: '',
    description: '',
    tags: [],
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    imageUrl: null,
    player: '',
    team: '',
    year: '',
  });
  
  // Layers and effects state management
  const {
    layers,
    activeLayerId,
    setActiveLayer,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    setLayers
  } = useLayers();
  
  const { 
    activeEffects,
    addEffect, 
    removeEffect, 
    updateEffectSettings,
    effectStack = [],
    getEffectClasses = () => ""
  } = useCardEffectsStack();

  // Handle image upload
  const handleImageUpload = (url: string) => {
    setCardData({
      ...cardData,
      imageUrl: url
    });
    toast.success('Image uploaded successfully');
  };

  // Handle form changes
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({
      ...cardData,
      [field]: e.target.value
    });
  };

  // Handle select changes
  const handleSelectChange = (field: string) => (value: string) => {
    setCardData({
      ...cardData,
      [field]: value
    });
  };

  // Handle form submission
  const handleSave = () => {
    toast.success('Card saved successfully!');
    console.log('Saving card:', { cardData, layers, effectStack });
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all changes?')) {
      setCardData({
        title: '',
        description: '',
        tags: [],
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        imageUrl: null,
        player: '',
        team: '',
        year: '',
      });
      setLayers([]);
      toast.info('All changes have been reset');
    }
  };

  // Export card
  const handleExport = () => {
    if (!cardData.imageUrl) {
      toast.error('Please upload an image before exporting');
      return;
    }
    
    // Implementation for exporting card as image
    if (previewCanvasRef.current) {
      html2canvas(previewCanvasRef.current).then(canvas => {
        const link = document.createElement('a');
        link.download = `${cardData.title || 'card'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('Card exported successfully!');
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar with customization options */}
      <aside className="w-full md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CRD Editor</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Customize your collectible digital card
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="borderColor">Border Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="borderColor"
                    type="color"
                    value={cardData.borderColor}
                    onChange={handleInputChange('borderColor')}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={cardData.borderColor}
                    onChange={handleInputChange('borderColor')}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={cardData.backgroundColor}
                    onChange={handleInputChange('backgroundColor')}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={cardData.backgroundColor}
                    onChange={handleInputChange('backgroundColor')}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="borderRadius">Border Radius</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    id="borderRadius"
                    min={0}
                    max={24}
                    step={1}
                    value={[parseInt(cardData.borderRadius) || 0]}
                    onValueChange={(value) => {
                      setCardData({
                        ...cardData,
                        borderRadius: `${value[0]}px`
                      });
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm w-10 text-center">
                    {parseInt(cardData.borderRadius) || 0}px
                  </span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="cardStyle">Card Style</Label>
                <Select 
                  value="classic" 
                  onValueChange={handleSelectChange('cardStyle')}
                >
                  <SelectTrigger id="cardStyle" className="mt-1">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                    <SelectItem value="chrome">Chrome</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Card Title</Label>
                <Input
                  id="title"
                  placeholder="Enter card title"
                  value={cardData.title}
                  onChange={handleInputChange('title')}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Enter card description"
                  value={cardData.description}
                  onChange={(e) => setCardData({...cardData, description: e.target.value})}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="player">Player</Label>
                  <Input
                    id="player"
                    placeholder="Player name"
                    value={cardData.player}
                    onChange={handleInputChange('player')}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="team">Team</Label>
                  <Input
                    id="team"
                    placeholder="Team name"
                    value={cardData.team}
                    onChange={handleInputChange('team')}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    placeholder="Year"
                    value={cardData.year}
                    onChange={handleInputChange('year')}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="textColor"
                    type="color"
                    value="#FFFFFF"
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value="#FFFFFF"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select value="inter">
                  <SelectTrigger id="fontFamily" className="mt-1">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="montserrat">Montserrat</SelectItem>
                    <SelectItem value="playfair">Playfair Display</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Card Image</Label>
                <p className="text-sm text-gray-500 mb-4">
                  Upload the main image for your card (aspect ratio: 2.5:3.5)
                </p>
                
                <ImageUploader
                  onUploadComplete={(url) => handleImageUpload(url)}
                  maxSizeMB={5}
                  className="mt-2"
                  showPreview={true}
                />
              </div>
              
              <div className="pt-4">
                <Label className="text-base font-medium">Card Back (Optional)</Label>
                <p className="text-sm text-gray-500 mb-4">
                  Upload an image for the back of your card
                </p>
                
                <ImageUploader
                  onUploadComplete={(url) => setCardData({...cardData, backImageUrl: url})}
                  maxSizeMB={5}
                  className="mt-2"
                  showPreview={true}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="effects" className="space-y-6">
            <CardEffectsPanel
              effectStack={effectStack}
              onAddEffect={addEffect}
              onRemoveEffect={removeEffect}
              onUpdateSettings={updateEffectSettings}
            />
          </TabsContent>
        </Tabs>
      </aside>
      
      {/* Main preview area */}
      <main className="flex-grow flex flex-col p-6 overflow-auto">
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md">
            <div ref={previewCanvasRef} className="mx-auto">
              <CardPreview 
                cardData={cardData} 
                effectClasses={getEffectClasses()}
                className="shadow-xl"
              />
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
          
          <Button 
            variant="default" 
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            Save
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CRDEditor;
