
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardLayer, CardEffect } from '@/lib/types';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card as UICard } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface CardEditorCoreProps {
  initialCard?: Partial<Card>;
  onSave: (card: Card) => Promise<void>;
  onPreview: (card: Card) => void;
  className?: string;
}

export const CardEditorCore: React.FC<CardEditorCoreProps> = ({
  initialCard,
  onSave,
  onPreview,
  className = ''
}) => {
  const [activeCard, setActiveCard] = useState<Partial<Card>>(
    initialCard || { 
      layers: [],
      effects: [],
      tags: [],
      designMetadata: {
        cardStyle: {
          template: 'standard',
          effect: 'none',
          borderRadius: '8px',
          borderColor: '#000000',
          frameWidth: 2,
          frameColor: '#000000',
          shadowColor: 'rgba(0,0,0,0.2)'
        },
        textStyle: {
          titleColor: '#000000',
          titleAlignment: 'center',
          titleWeight: 'bold',
          descriptionColor: '#333333'
        },
        cardMetadata: {
          category: 'Standard',
          series: 'Base',
          cardType: 'Standard'
        },
        marketMetadata: {
          isPrintable: false,
          isForSale: false,
          includeInCatalog: false
        }
      }
    }
  );
  
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('design');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 750, // 2.5" at 300 DPI
      height: 1050, // 3.5" at 300 DPI
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    // Set up event handlers
    canvas.on('selection:created', (e) => {
      if (e.selected && e.selected[0] && e.selected[0].data?.layerId) {
        setSelectedLayerId(e.selected[0].data.layerId);
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedLayerId(null);
    });

    canvas.on('object:modified', (e) => {
      if (e.target && e.target.data?.layerId) {
        handleLayerUpdate(e.target.data.layerId, {
          position: { x: e.target.left || 0, y: e.target.top || 0, z: 0 },
          rotation: e.target.angle || 0,
          size: { 
            width: (e.target.width || 100) * (e.target.scaleX || 1), 
            height: (e.target.height || 100) * (e.target.scaleY || 1) 
          },
        });
      }
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // Render layers on canvas
  useEffect(() => {
    if (!fabricRef.current || !activeCard.layers) return;

    fabricRef.current.clear();
    
    activeCard.layers.forEach((layer) => {
      renderLayer(fabricRef.current!, layer);
    });
  }, [activeCard.layers]);

  const renderLayer = (canvas: fabric.Canvas, layer: CardLayer) => {
    switch (layer.type) {
      case 'image':
        if (layer.imageUrl) {
          fabric.Image.fromURL(layer.imageUrl)
            .then((img) => {
              img.set({
                left: layer.position.x,
                top: layer.position.y,
                angle: layer.rotation,
                opacity: layer.opacity,
                visible: layer.visible,
                data: { layerId: layer.id }
              });
              canvas.add(img);
              canvas.renderAll();
            })
            .catch(err => {
              console.error('Error loading image:', err);
              toast.error('Failed to load image layer');
            });
        }
        break;
      
      case 'text':
        const text = new fabric.Text(layer.content || 'Text', {
          left: layer.position.x,
          top: layer.position.y,
          angle: layer.rotation,
          opacity: layer.opacity,
          fontSize: layer.textStyle?.fontSize || 24,
          fontFamily: layer.textStyle?.fontFamily || 'Arial',
          fill: layer.textStyle?.color || '#000000',
          textAlign: layer.textStyle?.textAlign || 'left',
          data: { layerId: layer.id }
        });
        canvas.add(text);
        break;
      
      case 'shape':
        if (layer.shapeType === 'rectangle') {
          const rect = new fabric.Rect({
            left: layer.position.x,
            top: layer.position.y,
            width: layer.size.width as number || 100,
            height: layer.size.height as number || 100,
            fill: layer.color || '#000000',
            angle: layer.rotation,
            opacity: layer.opacity,
            data: { layerId: layer.id }
          });
          canvas.add(rect);
        }
        break;
    }
  };

  const handleLayerUpdate = useCallback((layerId: string, updates: Partial<CardLayer>) => {
    setActiveCard(prev => ({
      ...prev,
      layers: prev.layers?.map(layer => 
        layer.id === layerId ? { ...layer, ...updates } : layer
      ) || []
    }));
  }, []);

  const addImageLayer = useCallback((imageUrl: string) => {
    const newLayer: CardLayer = {
      id: `layer-${Date.now()}`,
      type: 'image',
      content: '',
      position: { x: 100, y: 100, z: 0 },
      size: { width: 200, height: 200 },
      rotation: 0,
      opacity: 1,
      zIndex: (activeCard.layers?.length || 0) + 1,
      visible: true,
      imageUrl
    };

    setActiveCard(prev => ({
      ...prev,
      layers: [...(prev.layers || []), newLayer]
    }));

    toast.success('Image layer added');
  }, [activeCard.layers]);

  const addTextLayer = useCallback((text: string = 'New Text') => {
    const newLayer: CardLayer = {
      id: `layer-${Date.now()}`,
      type: 'text',
      content: text,
      position: { x: 100, y: 100, z: 0 },
      size: { width: 'auto', height: 'auto' },
      rotation: 0,
      opacity: 1,
      zIndex: (activeCard.layers?.length || 0) + 1,
      visible: true,
      textStyle: {
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#000000',
        textAlign: 'left'
      }
    };

    setActiveCard(prev => ({
      ...prev,
      layers: [...(prev.layers || []), newLayer]
    }));

    toast.success('Text layer added');
  }, [activeCard.layers]);

  const handleSave = async () => {
    try {
      const cardToSave: Card = {
        id: activeCard.id || `card-${Date.now()}`,
        title: activeCard.title || 'Untitled Card',
        description: activeCard.description || '',
        imageUrl: activeCard.imageUrl || '',
        thumbnailUrl: activeCard.thumbnailUrl || '',
        userId: activeCard.userId || 'current-user',
        tags: activeCard.tags || [],
        effects: activeCard.effects || [],
        createdAt: activeCard.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        designMetadata: activeCard.designMetadata!,
        layers: activeCard.layers || []
      };

      await onSave(cardToSave);
      toast.success('Card saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save card');
    }
  };

  const handlePreview = () => {
    const cardToPreview: Card = {
      id: activeCard.id || `card-${Date.now()}`,
      title: activeCard.title || 'Untitled Card',
      description: activeCard.description || '',
      imageUrl: activeCard.imageUrl || '',
      thumbnailUrl: activeCard.thumbnailUrl || '',
      userId: activeCard.userId || 'current-user',
      tags: activeCard.tags || [],
      effects: activeCard.effects || [],
      createdAt: activeCard.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: activeCard.designMetadata!,
      layers: activeCard.layers || []
    };

    onPreview(cardToPreview);
  };

  return (
    <div className={`flex h-screen bg-gray-900 ${className}`}>
      {/* Left Toolbar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <h2 className="text-white text-lg font-bold mb-4">Tools</h2>
        
        <div className="space-y-2">
          <Button
            onClick={() => addTextLayer()}
            variant="outline"
            className="w-full justify-start"
          >
            Add Text
          </Button>
          
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                addImageLayer(url);
              }
            }}
            className="hidden"
            id="image-upload"
          />
          <Button
            onClick={() => document.getElementById('image-upload')?.click()}
            variant="outline"
            className="w-full justify-start"
          >
            Add Image
          </Button>
        </div>

        {/* Layer List */}
        <div className="mt-6 flex-1">
          <h3 className="text-white text-sm font-semibold mb-2">Layers</h3>
          <div className="space-y-1">
            {activeCard.layers?.map((layer) => (
              <div
                key={layer.id}
                className={`p-2 rounded cursor-pointer ${
                  selectedLayerId === layer.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedLayerId(layer.id)}
              >
                <div className="text-sm capitalize">
                  {layer.type} Layer
                </div>
                <div className="text-xs opacity-70">
                  {layer.type === 'text' ? layer.content : layer.imageUrl ? 'Image' : 'Shape'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button onClick={handlePreview} className="w-full">
            Preview 3D
          </Button>
          <Button onClick={handleSave} variant="outline" className="w-full">
            Save Card
          </Button>
        </div>
      </div>

      {/* Center Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-800 p-8">
        <UICard className="p-4 bg-white">
          <canvas ref={canvasRef} className="border border-gray-300 shadow-lg" />
        </UICard>
      </div>

      {/* Right Properties Panel */}
      <div className="w-80 bg-gray-800 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="mt-4">
            <div className="text-white">
              <h3 className="font-semibold mb-2">Card Properties</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Title</label>
                  <input
                    type="text"
                    value={activeCard.title || ''}
                    onChange={(e) => setActiveCard(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 bg-gray-700 rounded text-white"
                    placeholder="Card title"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Description</label>
                  <textarea
                    value={activeCard.description || ''}
                    onChange={(e) => setActiveCard(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 bg-gray-700 rounded text-white"
                    placeholder="Card description"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="effects" className="mt-4">
            <div className="text-white">
              <h3 className="font-semibold mb-2">Effects</h3>
              <p className="text-sm text-gray-400">Effect controls will be implemented in the next phase</p>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="mt-4">
            <div className="text-white">
              <h3 className="font-semibold mb-2">Export Options</h3>
              <p className="text-sm text-gray-400">Export options will be implemented in the next phase</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CardEditorCore;
