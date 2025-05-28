import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardLayer, CardEffect } from '@/lib/types';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Eye, 
  Download, 
  Undo, 
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  MousePointer,
  Type,
  Image as ImageIcon,
  Circle as CircleIcon,
  Square
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CardEditorProps {
  initialCard?: Partial<Card>;
  onSave?: (card: Card) => void;
  onPreview?: (card: Card) => void;
  onExport?: (card: Card) => void;
  className?: string;
}

type Tool = 'select' | 'text' | 'image' | 'rectangle' | 'circle';

const CardEditor: React.FC<CardEditorProps> = ({
  initialCard,
  onSave = () => {},
  onPreview = () => {},
  onExport = () => {},
  className
}) => {
  // Core state
  const [activeCard, setActiveCard] = useState<Partial<Card>>(
    initialCard || {
      id: `card-${Date.now()}`,
      title: 'Untitled Card',
      layers: [],
      effects: [],
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<Partial<Card>[]>([activeCard]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('Initializing Fabric.js canvas');
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 750, // 2.5" at 300 DPI
      height: 1050, // 3.5" at 300 DPI
      backgroundColor: '#ffffff',
    });

    fabricRef.current = canvas;

    // Set up event handlers
    canvas.on('selection:created', (e) => {
      const selected = e.selected?.[0];
      if (selected && selected.data?.layerId) {
        setSelectedLayerId(selected.data.layerId);
        console.log('Layer selected:', selected.data.layerId);
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedLayerId(null);
      console.log('Selection cleared');
    });

    canvas.on('object:modified', (e) => {
      if (e.target && e.target.data?.layerId) {
        updateLayer(e.target.data.layerId, {
          position: { x: e.target.left || 0, y: e.target.top || 0, z: 0 },
          rotation: e.target.angle || 0,
          size: { 
            width: ((e.target.width || 100) * (e.target.scaleX || 1)), 
            height: ((e.target.height || 100) * (e.target.scaleY || 1))
          },
        });
      }
    });

    console.log('Fabric.js canvas initialized successfully');

    return () => {
      console.log('Disposing Fabric.js canvas');
      canvas.dispose();
    };
  }, []);

  // Render layers on canvas with proper z-index ordering
  useEffect(() => {
    if (!fabricRef.current || !activeCard.layers) return;

    console.log('Rendering layers:', activeCard.layers.length);
    fabricRef.current.clear();
    
    // Sort layers by zIndex to ensure proper rendering order
    const sortedLayers = [...activeCard.layers].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    sortedLayers.forEach((layer) => {
      if (layer.visible !== false) { // Default to visible if not specified
        renderLayer(fabricRef.current!, layer);
      }
    });
    
    // Ensure canvas is rendered after all layers are added
    fabricRef.current.renderAll();
  }, [activeCard.layers]);

  const renderLayer = async (canvas: fabric.Canvas, layer: CardLayer) => {
    console.log('Rendering layer:', layer.type, layer.id, 'at position:', layer.position, 'with zIndex:', layer.zIndex);
    
    try {
      switch (layer.type) {
        case 'image':
          if (layer.imageUrl) {
            console.log('Loading image from URL:', layer.imageUrl);
            
            fabric.Image.fromURL(layer.imageUrl, (img) => {
              if (img) {
                // Ensure the image is visible with proper positioning
                img.set({
                  left: layer.position.x,
                  top: layer.position.y,
                  angle: layer.rotation,
                  opacity: layer.opacity || 1,
                  scaleX: typeof layer.size.width === 'number' ? Number(layer.size.width) / (img.width || 1) : 0.5,
                  scaleY: typeof layer.size.height === 'number' ? Number(layer.size.height) / (img.height || 1) : 0.5,
                  selectable: true,
                  moveCursor: 'move',
                  hoverCursor: 'move',
                });
                
                // Store layer ID and set z-index
                (img as any).data = { layerId: layer.id };
                
                // Add to canvas and move to proper layer
                canvas.add(img);
                if (layer.zIndex !== undefined) {
                  canvas.moveTo(img, layer.zIndex);
                }
                
                canvas.renderAll();
                console.log('Image layer rendered successfully at:', img.left, img.top);
              }
            }, {
              crossOrigin: 'anonymous'
            });
          }
          break;
        
        case 'text':
          console.log('Creating text layer:', layer.content);
          const text = new fabric.Text(layer.content || 'Text', {
            left: layer.position.x,
            top: layer.position.y,
            angle: layer.rotation,
            opacity: layer.opacity || 1,
            fontSize: layer.textStyle?.fontSize || 24,
            fontFamily: layer.textStyle?.fontFamily || 'Arial',
            fill: layer.textStyle?.color || '#000000',
            selectable: true,
            moveCursor: 'move',
            hoverCursor: 'move',
          });
          
          (text as any).data = { layerId: layer.id };
          canvas.add(text);
          
          if (layer.zIndex !== undefined) {
            canvas.moveTo(text, layer.zIndex);
          }
          
          console.log('Text layer rendered successfully at:', text.left, text.top);
          break;
        
        case 'shape':
          if (layer.shapeType === 'rectangle') {
            console.log('Creating rectangle shape');
            const width = typeof layer.size.width === 'number' ? Number(layer.size.width) : 100;
            const height = typeof layer.size.height === 'number' ? Number(layer.size.height) : 100;
            
            const rect = new fabric.Rect({
              left: layer.position.x,
              top: layer.position.y,
              width: width,
              height: height,
              fill: layer.color || '#4F46E5', // Use a visible default color
              stroke: '#000000', // Add stroke to make it more visible
              strokeWidth: 1,
              angle: layer.rotation,
              opacity: layer.opacity || 1,
              selectable: true,
              moveCursor: 'move',
              hoverCursor: 'move',
            });
            
            (rect as any).data = { layerId: layer.id };
            canvas.add(rect);
            
            if (layer.zIndex !== undefined) {
              canvas.moveTo(rect, layer.zIndex);
            }
            
            console.log('Rectangle shape rendered successfully at:', rect.left, rect.top, 'with color:', rect.fill);
          } else if (layer.shapeType === 'circle') {
            console.log('Creating circle shape');
            const radius = typeof layer.size.width === 'number' ? Number(layer.size.width) / 2 : 50;
            
            const circle = new fabric.Circle({
              left: layer.position.x,
              top: layer.position.y,
              radius: radius,
              fill: layer.color || '#4F46E5', // Use a visible default color
              stroke: '#000000', // Add stroke to make it more visible
              strokeWidth: 1,
              angle: layer.rotation,
              opacity: layer.opacity || 1,
              selectable: true,
              moveCursor: 'move',
              hoverCursor: 'move',
            });
            
            (circle as any).data = { layerId: layer.id };
            canvas.add(circle);
            
            if (layer.zIndex !== undefined) {
              canvas.moveTo(circle, layer.zIndex);
            }
            
            console.log('Circle shape rendered successfully at:', circle.left, circle.top, 'with color:', circle.fill);
          }
          break;
      }
      
    } catch (error) {
      console.error('Error rendering layer:', layer.type, error);
      toast.error(`Failed to render ${layer.type} layer`);
    }
  };

  const updateLayer = useCallback((layerId: string, updates: Partial<CardLayer>) => {
    console.log('Updating layer:', layerId, updates);
    setActiveCard(prev => ({
      ...prev,
      layers: prev.layers?.map(layer => 
        layer.id === layerId ? { ...layer, ...updates } : layer
      ) || [],
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const addImageLayer = useCallback((imageUrl: string) => {
    console.log('Adding image layer with URL:', imageUrl);
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
      layers: [...(prev.layers || []), newLayer],
      updatedAt: new Date().toISOString()
    }));

    toast.success('Image layer added');
  }, [activeCard.layers]);

  const addTextLayer = useCallback(() => {
    console.log('Adding text layer');
    const newLayer: CardLayer = {
      id: `layer-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      position: { x: 100, y: 100, z: 0 },
      size: { width: 'auto', height: 'auto' },
      rotation: 0,
      opacity: 1,
      zIndex: (activeCard.layers?.length || 0) + 1,
      visible: true,
      textStyle: {
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#000000'
      }
    };

    setActiveCard(prev => ({
      ...prev,
      layers: [...(prev.layers || []), newLayer],
      updatedAt: new Date().toISOString()
    }));

    toast.success('Text layer added');
  }, [activeCard.layers]);

  const addShapeLayer = useCallback((shapeType: 'rectangle' | 'circle') => {
    console.log('Adding shape layer:', shapeType);
    const newLayer: CardLayer = {
      id: `layer-${Date.now()}`,
      type: 'shape',
      content: '',
      position: { x: 100, y: 100, z: 0 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      zIndex: (activeCard.layers?.length || 0) + 1,
      visible: true,
      shapeType,
      color: '#4F46E5'
    };

    setActiveCard(prev => ({
      ...prev,
      layers: [...(prev.layers || []), newLayer],
      updatedAt: new Date().toISOString()
    }));

    toast.success('Shape layer added');
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
        designMetadata: activeCard.designMetadata || {
          cardStyle: {
            template: 'custom',
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
            category: 'Custom',
            series: 'Base',
            cardType: 'Standard'
          },
          marketMetadata: {
            isPrintable: false,
            isForSale: false,
            includeInCatalog: false
          }
        },
        layers: activeCard.layers || []
      };

      await onSave(cardToSave);
      toast.success('Card saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save card');
    }
  };

  const selectedLayer = activeCard.layers?.find(layer => layer.id === selectedLayerId);

  return (
    <div className={cn("flex h-screen bg-gray-900 text-white", className)}>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 z-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Card Editor</h1>
          <input
            type="text"
            value={activeCard.title || ''}
            onChange={(e) => setActiveCard(prev => ({ ...prev, title: e.target.value }))}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
            placeholder="Card title"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Redo className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button onClick={handleSave} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button onClick={() => onPreview(activeCard as Card)} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            Preview 3D
          </Button>
          <Button onClick={() => onExport(activeCard as Card)} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Left Toolbar */}
      <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-20 space-y-2">
        <Button
          variant={activeTool === 'select' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTool('select')}
          className="w-12 h-12"
        >
          <MousePointer className="w-5 h-5" />
        </Button>
        
        <Button
          variant={activeTool === 'text' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            setActiveTool('text');
            addTextLayer();
          }}
          className="w-12 h-12"
        >
          <Type className="w-5 h-5" />
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
          variant={activeTool === 'image' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => document.getElementById('image-upload')?.click()}
          className="w-12 h-12"
        >
          <ImageIcon className="w-5 h-5" />
        </Button>
        
        <Button
          variant={activeTool === 'rectangle' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            setActiveTool('rectangle');
            addShapeLayer('rectangle');
          }}
          className="w-12 h-12"
        >
          <Square className="w-5 h-5" />
        </Button>
        
        <Button
          variant={activeTool === 'circle' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            setActiveTool('circle');
            addShapeLayer('circle');
          }}
          className="w-12 h-12"
        >
          <CircleIcon className="w-5 h-5" />
        </Button>
        
        <Separator className="my-4" />
        
        <Button
          variant={showGrid ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
          className="w-12 h-12"
        >
          <Grid className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
          className="w-12 h-12"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
          className="w-12 h-12"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-800 pt-16">
        <div 
          className="relative shadow-2xl"
          style={{ transform: `scale(${zoom})` }}
        >
          <canvas 
            ref={canvasRef} 
            className="border border-gray-600 bg-white"
            style={{
              backgroundImage: showGrid ? 
                'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)' : 
                'none',
              backgroundSize: showGrid ? '20px 20px' : 'auto'
            }}
          />
          {/* Debug overlay to show canvas bounds */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs p-1 opacity-50">
              Canvas: 750x1050, Layers: {activeCard.layers?.length || 0}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 pt-16">
        <Tabs defaultValue="layers" className="h-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="layers" className="p-4 space-y-2">
            <h3 className="font-semibold mb-3">Layers</h3>
            {activeCard.layers?.map((layer) => (
              <div
                key={layer.id}
                className={cn(
                  "p-3 rounded border cursor-pointer transition-colors",
                  selectedLayerId === layer.id 
                    ? "bg-blue-600 border-blue-500" 
                    : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                )}
                onClick={() => setSelectedLayerId(layer.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm capitalize">{layer.type}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCard(prev => ({
                        ...prev,
                        layers: prev.layers?.map(l => 
                          l.id === layer.id ? { ...l, visible: !l.visible } : l
                        )
                      }));
                    }}
                    className={cn(
                      "w-6 h-6 rounded border text-xs",
                      layer.visible ? "bg-green-600 border-green-500" : "bg-gray-600 border-gray-500"
                    )}
                  >
                    {layer.visible ? '👁' : '👁‍🗨'}
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {layer.type === 'text' ? layer.content : layer.type === 'image' ? 'Image' : 'Shape'}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="properties" className="p-4">
            <h3 className="font-semibold mb-3">Properties</h3>
            {selectedLayer ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Position</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="X"
                      value={selectedLayer.position.x}
                      onChange={(e) => updateLayer(selectedLayer.id, {
                        position: { ...selectedLayer.position, x: Number(e.target.value) }
                      })}
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Y"
                      value={selectedLayer.position.y}
                      onChange={(e) => updateLayer(selectedLayer.id, {
                        position: { ...selectedLayer.position, y: Number(e.target.value) }
                      })}
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedLayer.opacity}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      opacity: Number(e.target.value)
                    })}
                    className="w-full mt-1"
                  />
                </div>
                
                {selectedLayer.type === 'text' && (
                  <div>
                    <label className="text-sm text-gray-400">Text</label>
                    <input
                      type="text"
                      value={selectedLayer.content || ''}
                      onChange={(e) => updateLayer(selectedLayer.id, {
                        content: e.target.value
                      })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm mt-1"
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Select a layer to edit properties</p>
            )}
          </TabsContent>
          
          <TabsContent value="effects" className="p-4">
            <h3 className="font-semibold mb-3">Effects</h3>
            <p className="text-gray-400 text-sm">Effects panel coming soon...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CardEditor;
