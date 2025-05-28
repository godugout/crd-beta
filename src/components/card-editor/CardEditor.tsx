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
  Square,
  ChevronUp,
  ChevronDown,
  Trash2,
  EyeOff,
  Move,
  Layers3,
  RotateCw,
  FlipHorizontal,
  FlipVertical
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCanvasControls } from '@/hooks/useCanvasControls';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import ImageTransformControls from './ImageTransformControls';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

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
  const [isUpdatingFromCanvas, setIsUpdatingFromCanvas] = useState(false);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  // Modern canvas controls
  const canvasControls = useCanvasControls({
    fabricRef,
    minZoom: 0.1,
    maxZoom: 5,
    zoomSensitivity: 0.001
  });

  // Undo/redo system
  const undoRedoSystem = useUndoRedo(
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

  // Sync undo/redo state with activeCard
  useEffect(() => {
    if (!isUpdatingFromCanvas) {
      setActiveCard(undoRedoSystem.state);
    }
  }, [undoRedoSystem.state, isUpdatingFromCanvas]);

  const updateCardWithHistory = useCallback((updates: Partial<Card>) => {
    const newCard = { ...activeCard, ...updates, updatedAt: new Date().toISOString() };
    undoRedoSystem.pushState(newCard);
  }, [activeCard, undoRedoSystem]);

  // Generate thumbnail from canvas
  const generateThumbnail = useCallback((): string => {
    if (!fabricRef.current) return '';
    
    try {
      // Temporarily hide guide lines for clean thumbnail
      const objects = fabricRef.current.getObjects();
      const guideLines = objects.filter(obj => 
        obj.name === 'bleed-line' || obj.name === 'crop-line' || obj.name === 'safe-line'
      );
      
      guideLines.forEach(line => line.set('visible', false));
      fabricRef.current.renderAll();
      
      // Generate thumbnail
      const dataURL = fabricRef.current.toDataURL({
        format: 'jpeg',
        quality: 0.8,
        multiplier: 0.3 // Scale down for thumbnail
      });
      
      // Restore guide lines
      guideLines.forEach(line => line.set('visible', true));
      fabricRef.current.renderAll();
      
      return dataURL;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return '';
    }
  }, []);

  // Generate full resolution image from canvas
  const generateCardImage = useCallback((): string => {
    if (!fabricRef.current) return '';
    
    try {
      // Temporarily hide guide lines for clean export
      const objects = fabricRef.current.getObjects();
      const guideLines = objects.filter(obj => 
        obj.name === 'bleed-line' || obj.name === 'crop-line' || obj.name === 'safe-line'
      );
      
      guideLines.forEach(line => line.set('visible', false));
      fabricRef.current.renderAll();
      
      // Generate high-quality image
      const dataURL = fabricRef.current.toDataURL({
        format: 'png',
        quality: 1.0,
        multiplier: 1 // Full resolution
      });
      
      // Restore guide lines
      guideLines.forEach(line => line.set('visible', true));
      fabricRef.current.renderAll();
      
      return dataURL;
    } catch (error) {
      console.error('Error generating card image:', error);
      return '';
    }
  }, []);

  // Define handleSave before using it in keyboard shortcuts
  const handleSave = useCallback(async () => {
    try {
      // Generate image and thumbnail
      const cardImage = generateCardImage();
      const thumbnail = generateThumbnail();
      
      const cardToSave: Card = {
        id: activeCard.id || `card-${Date.now()}`,
        title: activeCard.title || 'Untitled Card',
        description: activeCard.description || '',
        imageUrl: cardImage, // Set the generated canvas image
        thumbnailUrl: thumbnail, // Set the generated thumbnail
        userId: activeCard.userId || 'current-user',
        tags: activeCard.tags || [],
        effects: activeCard.effects || [],
        createdAt: activeCard.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        designMetadata: {
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
      
      // Show success message with action buttons
      toast.success(
        <div className="flex flex-col gap-2">
          <span>Card saved successfully!</span>
          <div className="flex gap-2">
            <button 
              onClick={() => window.open('/cards', '_blank')} 
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              View All Cards
            </button>
            <button 
              onClick={() => handlePreview()} 
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Preview in 3D
            </button>
          </div>
        </div>,
        { duration: 5000 }
      );
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save card');
    }
  }, [activeCard, onSave, generateCardImage, generateThumbnail]);

  // Keyboard shortcuts - now handleSave is defined
  useKeyboardShortcuts({
    onUndo: undoRedoSystem.undo,
    onRedo: undoRedoSystem.redo,
    onSave: handleSave,
    onZoomIn: canvasControls.zoomIn,
    onZoomOut: canvasControls.zoomOut,
    onResetView: canvasControls.resetView,
    onDelete: () => {
      if (selectedLayerId) {
        deleteLayer(selectedLayerId);
      }
    },
    canUndo: undoRedoSystem.canUndo,
    canRedo: undoRedoSystem.canRedo
  });

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('Initializing Fabric.js canvas');
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 750, // 2.5" at 300 DPI
      height: 1050, // 3.5" at 300 DPI
      backgroundColor: 'transparent',
    });

    fabricRef.current = canvas;

    // Add crop and bleed lines
    addCropAndBleedLines(canvas);

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
        // Set flag to prevent re-rendering during canvas update
        setIsUpdatingFromCanvas(true);
        
        const layerId = e.target.data.layerId;
        const updates = {
          position: { x: e.target.left || 0, y: e.target.top || 0, z: 0 },
          rotation: e.target.angle || 0,
          size: { 
            width: ((e.target.width || 100) * (e.target.scaleX || 1)), 
            height: ((e.target.height || 100) * (e.target.scaleY || 1))
          },
        };
        
        // Update activeCard and push to history
        setActiveCard(prevCard => {
          const updatedLayers = prevCard.layers?.map(layer => 
            layer.id === layerId ? { ...layer, ...updates } : layer
          ) || [];
          
          const newCard = {
            ...prevCard,
            layers: updatedLayers,
            updatedAt: new Date().toISOString()
          };
          
          // Push to history after a short delay to avoid infinite loops
          setTimeout(() => {
            undoRedoSystem.pushState(newCard);
            setIsUpdatingFromCanvas(false);
          }, 0);
          
          return newCard;
        });
        
        console.log('Updating layer:', layerId, updates);
      }
    });

    console.log('Fabric.js canvas initialized successfully');

    return () => {
      console.log('Disposing Fabric.js canvas');
      canvas.dispose();
    };
  }, []);

  // Add crop and bleed lines function
  const addCropAndBleedLines = (canvas: fabric.Canvas) => {
    const canvasWidth = canvas.width || 750;
    const canvasHeight = canvas.height || 1050;
    
    // Bleed area (extends beyond crop area)
    const bleedSize = 18; // 0.125" at 144 DPI (common bleed)
    
    // Safe area (inside crop area)
    const safeMargin = 36; // 0.25" margin from crop edge
    
    // Create bleed lines (outermost - red dashed)
    const bleedLines = [
      // Top bleed
      new fabric.Line([0, bleedSize, canvasWidth, bleedSize], {
        stroke: '#ff0000',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        name: 'bleed-line'
      }),
      // Bottom bleed  
      new fabric.Line([0, canvasHeight - bleedSize, canvasWidth, canvasHeight - bleedSize], {
        stroke: '#ff0000',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        name: 'bleed-line'
      }),
      // Left bleed
      new fabric.Line([bleedSize, 0, bleedSize, canvasHeight], {
        stroke: '#ff0000',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        name: 'bleed-line'
      }),
      // Right bleed
      new fabric.Line([canvasWidth - bleedSize, 0, canvasWidth - bleedSize, canvasHeight], {
        stroke: '#ff0000',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        name: 'bleed-line'
      })
    ];

    // Create crop lines (card edge - solid black)
    const cropLines = [
      // Top crop
      new fabric.Line([0, bleedSize * 2, canvasWidth, bleedSize * 2], {
        stroke: '#000000',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        name: 'crop-line'
      }),
      // Bottom crop
      new fabric.Line([0, canvasHeight - bleedSize * 2, canvasWidth, canvasHeight - bleedSize * 2], {
        stroke: '#000000',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        name: 'crop-line'
      }),
      // Left crop
      new fabric.Line([bleedSize * 2, 0, bleedSize * 2, canvasHeight], {
        stroke: '#000000',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        name: 'crop-line'
      }),
      // Right crop
      new fabric.Line([canvasWidth - bleedSize * 2, 0, canvasWidth - bleedSize * 2, canvasHeight], {
        stroke: '#000000',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        name: 'crop-line'
      })
    ];

    // Create safe area lines (inner margin - blue dashed)
    const safeLines = [
      // Top safe
      new fabric.Line([bleedSize * 2 + safeMargin, bleedSize * 2 + safeMargin, canvasWidth - bleedSize * 2 - safeMargin, bleedSize * 2 + safeMargin], {
        stroke: '#0066cc',
        strokeWidth: 1,
        strokeDashArray: [3, 3],
        selectable: false,
        evented: false,
        name: 'safe-line'
      }),
      // Bottom safe
      new fabric.Line([bleedSize * 2 + safeMargin, canvasHeight - bleedSize * 2 - safeMargin, canvasWidth - bleedSize * 2 - safeMargin, canvasHeight - bleedSize * 2 - safeMargin], {
        stroke: '#0066cc',
        strokeWidth: 1,
        strokeDashArray: [3, 3],
        selectable: false,
        evented: false,
        name: 'safe-line'
      }),
      // Left safe
      new fabric.Line([bleedSize * 2 + safeMargin, bleedSize * 2 + safeMargin, bleedSize * 2 + safeMargin, canvasHeight - bleedSize * 2 - safeMargin], {
        stroke: '#0066cc',
        strokeWidth: 1,
        strokeDashArray: [3, 3],
        selectable: false,
        evented: false,
        name: 'safe-line'
      }),
      // Right safe
      new fabric.Line([canvasWidth - bleedSize * 2 - safeMargin, bleedSize * 2 + safeMargin, canvasWidth - bleedSize * 2 - safeMargin, canvasHeight - bleedSize * 2 - safeMargin], {
        stroke: '#0066cc',
        strokeWidth: 1,
        strokeDashArray: [3, 3],
        selectable: false,
        evented: false,
        name: 'safe-line'
      })
    ];

    // Add all guide lines to canvas
    [...bleedLines, ...cropLines, ...safeLines].forEach(line => {
      canvas.add(line);
      canvas.sendToBack(line); // Keep guides behind content
    });
  };

  // Render layers on canvas with proper z-index ordering
  useEffect(() => {
    if (!fabricRef.current || !activeCard.layers || isUpdatingFromCanvas) return;

    console.log('Rendering layers:', activeCard.layers.length);
    fabricRef.current.clear();
    
    // Re-add guide lines
    addCropAndBleedLines(fabricRef.current);
    
    // Sort layers by zIndex to ensure proper rendering order
    const sortedLayers = [...activeCard.layers].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    sortedLayers.forEach((layer) => {
      if (layer.visible !== false) { // Default to visible if not specified
        renderLayer(fabricRef.current!, layer);
      }
    });
    
    // Ensure canvas is rendered after all layers are added
    fabricRef.current.renderAll();
  }, [activeCard.layers, isUpdatingFromCanvas]);

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
              fill: layer.color || '#4F46E5',
              stroke: '#000000',
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
              fill: layer.color || '#4F46E5',
              stroke: '#000000',
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
    
    // Set flag to prevent re-rendering during update
    setIsUpdatingFromCanvas(true);
    
    setActiveCard(prev => {
      const newCard = {
        ...prev,
        layers: prev.layers?.map(layer => 
          layer.id === layerId ? { ...layer, ...updates } : layer
        ) || [],
        updatedAt: new Date().toISOString()
      };
      
      // Update Fabric.js object if it exists and we're updating position/size/rotation
      if (fabricRef.current && (updates.position || updates.size || updates.rotation !== undefined || updates.visible !== undefined)) {
        const objects = fabricRef.current.getObjects();
        const layerObject = objects.find(obj => (obj as any).data?.layerId === layerId);
        
        if (layerObject) {
          if (updates.position) {
            layerObject.set({
              left: updates.position.x,
              top: updates.position.y
            });
          }
          
          if (updates.rotation !== undefined) {
            layerObject.set({
              angle: updates.rotation
            });
          }
          
          if (updates.visible !== undefined) {
            layerObject.set({
              visible: updates.visible
            });
          }
          
          if (updates.size) {
            const width = typeof updates.size.width === 'number' ? updates.size.width : layerObject.width;
            const height = typeof updates.size.height === 'number' ? updates.size.height : layerObject.height;
            
            if (layerObject.type === 'image') {
              layerObject.set({
                scaleX: width / (layerObject.width || 1),
                scaleY: height / (layerObject.height || 1)
              });
            } else {
              layerObject.set({
                width,
                height
              });
            }
          }
          
          fabricRef.current.renderAll();
        }
      }
      
      // Push to history after a short delay
      setTimeout(() => {
        undoRedoSystem.pushState(newCard);
        setIsUpdatingFromCanvas(false);
      }, 0);
      
      return newCard;
    });
  }, [undoRedoSystem]);

  const moveLayerUp = useCallback((layerId: string) => {
    setActiveCard(prev => {
      const layers = prev.layers || [];
      const currentIndex = layers.findIndex(l => l.id === layerId);
      if (currentIndex < layers.length - 1) {
        const newLayers = [...layers];
        [newLayers[currentIndex], newLayers[currentIndex + 1]] = [newLayers[currentIndex + 1], newLayers[currentIndex]];
        // Update zIndex
        newLayers.forEach((layer, index) => {
          layer.zIndex = index;
        });
        return { ...prev, layers: newLayers, updatedAt: new Date().toISOString() };
      }
      return prev;
    });
  }, []);

  const moveLayerDown = useCallback((layerId: string) => {
    setActiveCard(prev => {
      const layers = prev.layers || [];
      const currentIndex = layers.findIndex(l => l.id === layerId);
      if (currentIndex > 0) {
        const newLayers = [...layers];
        [newLayers[currentIndex], newLayers[currentIndex - 1]] = [newLayers[currentIndex - 1], newLayers[currentIndex]];
        // Update zIndex
        newLayers.forEach((layer, index) => {
          layer.zIndex = index;
        });
        return { ...prev, layers: newLayers, updatedAt: new Date().toISOString() };
      }
      return prev;
    });
  }, []);

  const deleteLayer = useCallback((layerId: string) => {
    setActiveCard(prev => ({
      ...prev,
      layers: prev.layers?.filter(layer => layer.id !== layerId) || [],
      updatedAt: new Date().toISOString()
    }));
    
    if (selectedLayerId === layerId) {
      setSelectedLayerId(null);
    }
    
    // Remove from canvas
    if (fabricRef.current) {
      const objects = fabricRef.current.getObjects();
      const objectToRemove = objects.find(obj => (obj as any).data?.layerId === layerId);
      if (objectToRemove) {
        fabricRef.current.remove(objectToRemove);
        fabricRef.current.renderAll();
      }
    }
    
    toast.success('Layer deleted');
  }, [selectedLayerId]);

  const addImageLayer = useCallback((imageUrl: string) => {
    console.log('Adding image layer with URL:', imageUrl);
    const newLayer: CardLayer = {
      id: `layer-${Date.now()}`,
      type: 'image',
      content: '',
      position: { x: 200, y: 200, z: 0 },
      size: { width: 200, height: 200 },
      rotation: 0,
      opacity: 1,
      zIndex: (activeCard.layers?.length || 0),
      visible: true,
      imageUrl
    };

    setActiveCard(prev => {
      const newCard = {
        ...prev,
        layers: [...(prev.layers || []), newLayer],
        updatedAt: new Date().toISOString()
      };
      
      // Push to history after a short delay
      setTimeout(() => {
        undoRedoSystem.pushState(newCard);
      }, 0);
      
      return newCard;
    });

    toast.success('Image layer added');
  }, [activeCard.layers, undoRedoSystem]);

  const addTextLayer = useCallback(() => {
    console.log('Adding text layer');
    const newLayer: CardLayer = {
      id: `layer-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      position: { x: 200, y: 200, z: 0 },
      size: { width: 'auto', height: 'auto' },
      rotation: 0,
      opacity: 1,
      zIndex: (activeCard.layers?.length || 0),
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
      position: { x: 200, y: 200, z: 0 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      zIndex: (activeCard.layers?.length || 0),
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

  // Image transformation functions
  const rotateSelectedImage = useCallback((degrees: number) => {
    if (!selectedLayerId || !fabricRef.current) return;
    
    const selectedObject = fabricRef.current.getObjects().find(obj => 
      (obj as any).data?.layerId === selectedLayerId
    );
    
    if (selectedObject) {
      const currentAngle = selectedObject.angle || 0;
      const newAngle = currentAngle + degrees;
      selectedObject.set('angle', newAngle);
      fabricRef.current.renderAll();
      
      updateLayer(selectedLayerId, { rotation: newAngle });
      toast.success(`Rotated ${degrees > 0 ? 'clockwise' : 'counter-clockwise'}`);
    }
  }, [selectedLayerId, updateLayer]);

  const flipSelectedImage = useCallback((direction: 'horizontal' | 'vertical') => {
    if (!selectedLayerId || !fabricRef.current) return;
    
    const selectedObject = fabricRef.current.getObjects().find(obj => 
      (obj as any).data?.layerId === selectedLayerId
    );
    
    if (selectedObject) {
      if (direction === 'horizontal') {
        selectedObject.set('flipX', !selectedObject.flipX);
      } else {
        selectedObject.set('flipY', !selectedObject.flipY);
      }
      fabricRef.current.renderAll();
      toast.success(`Flipped ${direction}ly`);
    }
  }, [selectedLayerId]);

  // Enhanced image transformation functions
  const fitImageToCanvas = useCallback(() => {
    if (!selectedLayerId || !fabricRef.current) return;
    
    const canvas = fabricRef.current;
    const selectedObject = canvas.getObjects().find(obj => 
      (obj as any).data?.layerId === selectedLayerId
    );
    
    if (selectedObject && selectedObject.type === 'image') {
      const canvasWidth = canvas.width || 750;
      const canvasHeight = canvas.height || 1050;
      const padding = 50;
      
      // Calculate scale to fit with padding
      const scaleX = (canvasWidth - padding * 2) / (selectedObject.width || 1);
      const scaleY = (canvasHeight - padding * 2) / (selectedObject.height || 1);
      const scale = Math.min(scaleX, scaleY);
      
      selectedObject.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale
      });
      
      canvas.renderAll();
      
      updateLayer(selectedLayerId, {
        position: { x: canvasWidth / 2, y: canvasHeight / 2, z: 0 },
        size: { 
          width: (selectedObject.width || 1) * scale, 
          height: (selectedObject.height || 1) * scale 
        }
      });
      
      toast.success('Image fitted to canvas');
    }
  }, [selectedLayerId, updateLayer]);

  const resetImageTransform = useCallback(() => {
    if (!selectedLayerId || !fabricRef.current) return;
    
    const canvas = fabricRef.current;
    const selectedObject = canvas.getObjects().find(obj => 
      (obj as any).data?.layerId === selectedLayerId
    );
    
    if (selectedObject) {
      selectedObject.set({
        left: 100,
        top: 100,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false
      });
      
      canvas.renderAll();
      
      updateLayer(selectedLayerId, {
        position: { x: 100, y: 100, z: 0 },
        size: { width: selectedObject.width || 200, height: selectedObject.height || 200 },
        rotation: 0
      });
      
      toast.success('Transform reset');
    }
  }, [selectedLayerId, updateLayer]);

  const handlePreview = () => {
    try {
      // Generate image and thumbnail for preview
      const cardImage = generateCardImage();
      const thumbnail = generateThumbnail();
      
      const cardToPreview: Card = {
        id: activeCard.id || `card-${Date.now()}`,
        title: activeCard.title || 'Untitled Card',
        description: activeCard.description || '',
        imageUrl: cardImage, // Use generated canvas image
        thumbnailUrl: thumbnail, // Use generated thumbnail
        userId: activeCard.userId || 'current-user',
        tags: activeCard.tags || [],
        effects: activeCard.effects || [],
        createdAt: activeCard.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        designMetadata: {
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

      onPreview(cardToPreview);
      toast.success('Opening 3D preview');
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to open preview');
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
            onChange={(e) => updateCardWithHistory({ title: e.target.value })}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
            placeholder="Card title"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Undo/Redo */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={undoRedoSystem.undo}
            disabled={!undoRedoSystem.canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={undoRedoSystem.redo}
            disabled={!undoRedoSystem.canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </Button>
          
          {/* Canvas Controls */}
          <Separator orientation="vertical" className="h-6" />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={canvasControls.zoomOut}
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-gray-400 px-2">
            {Math.round(canvasControls.zoom * 100)}%
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={canvasControls.zoomIn}
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={canvasControls.resetView}
            title="Reset View (0)"
          >
            <Grid className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Navigation Links */}
          <Button asChild variant="ghost" size="sm">
            <a href="/cards" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <Eye className="w-4 h-4 mr-1" />
              View Cards
            </a>
          </Button>
          
          <Button onClick={handleSave} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button onClick={handlePreview} variant="outline" size="sm">
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

      {/* Canvas Area with Instructions */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-800 pt-16">
        {/* Canvas Instructions */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-4 bg-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-600 rounded text-xs">Space</kbd>
              + drag to pan
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-600 rounded text-xs">Scroll</kbd>
              to zoom
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-600 rounded text-xs">Ctrl+Z</kbd>
              to undo
            </span>
          </div>
        </div>

        <div 
          className="relative shadow-2xl"
          style={{ transform: `scale(${canvasControls.zoom})` }}
        >
          <canvas 
            ref={canvasRef} 
            className="border border-gray-600"
            style={{
              background: 'transparent',
              backgroundImage: showGrid ? 
                'linear-gradient(rgba(128,128,128,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.3) 1px, transparent 1px)' : 
                'none',
              backgroundSize: showGrid ? '20px 20px' : 'auto'
            }}
          />
          {/* Guide lines legend */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-0 border-t border-red-500 border-dashed"></div>
              <span>Bleed</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-0 border-t-2 border-black"></div>
              <span>Crop</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0 border-t border-blue-500 border-dashed"></div>
              <span>Safe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Enhanced Layers Panel */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 pt-16">
        <Tabs defaultValue="layers" className="h-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="layers" className="p-4 space-y-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Layers</h3>
              <span className="text-xs text-gray-400">{activeCard.layers?.length || 0} layers</span>
            </div>
            
            {activeCard.layers && activeCard.layers.length > 0 ? (
              <div className="space-y-1">
                {[...activeCard.layers].reverse().map((layer, index) => (
                  <div
                    key={layer.id}
                    className={cn(
                      "group p-3 rounded border cursor-pointer transition-all duration-200",
                      selectedLayerId === layer.id 
                        ? "bg-blue-600 border-blue-500 shadow-md" 
                        : "bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-gray-500"
                    )}
                    onClick={() => setSelectedLayerId(layer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Layer type icon */}
                        <div className={cn(
                          "flex-shrink-0 w-8 h-8 rounded flex items-center justify-center",
                          layer.type === 'image' ? 'bg-green-600' : 
                          layer.type === 'text' ? 'bg-blue-600' : 'bg-purple-600'
                        )}>
                          {layer.type === 'text' && <Type size={14} className="text-white" />}
                          {layer.type === 'image' && <ImageIcon size={14} className="text-white" />}
                          {layer.type === 'shape' && <Square size={14} className="text-white" />}
                        </div>
                        
                        {/* Layer name/content */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {layer.type === 'text' ? 
                              (typeof layer.content === 'string' && layer.content ? layer.content : 'Text Layer') : 
                              layer.type === 'image' ? 'Image Layer' :
                              `${layer.shapeType === 'rectangle' ? 'Rectangle' : 'Circle'} Shape`
                            }
                          </div>
                          <div className="text-xs text-gray-400 capitalize">{layer.type}</div>
                        </div>
                      </div>
                      
                      {/* Layer controls */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Visibility toggle */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateLayer(layer.id, { visible: !layer.visible });
                          }}
                        >
                          {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </Button>
                        
                        {/* Move up */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayerUp(layer.id);
                          }}
                          disabled={index === 0}
                        >
                          <ChevronUp size={14} />
                        </Button>
                        
                        {/* Move down */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayerDown(layer.id);
                          }}
                          disabled={index === activeCard.layers.length - 1}
                        >
                          <ChevronDown size={14} />
                        </Button>
                        
                        {/* Delete */}
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-red-600 text-red-400 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLayer(layer.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <div className="mb-2">
                  <Layers3 className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <p className="text-sm">No layers yet</p>
                <p className="text-xs mt-1">Add text, images, or shapes to get started</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="properties" className="p-4">
            <h3 className="font-semibold mb-3">Properties</h3>
            {selectedLayer ? (
              <div className="space-y-4">
                {/* Advanced Image Controls */}
                {selectedLayer.type === 'image' && (
                  <ImageTransformControls
                    layer={selectedLayer}
                    onLayerUpdate={updateLayer}
                    onRotateImage={rotateSelectedImage}
                    onFlipImage={flipSelectedImage}
                    onFitToCanvas={fitImageToCanvas}
                    onResetTransform={resetImageTransform}
                  />
                )}
                
                <div>
                  <label className="text-sm text-gray-400">Position</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="X"
                      value={Math.round(selectedLayer.position.x)}
                      onChange={(e) => updateLayer(selectedLayer.id, {
                        position: { ...selectedLayer.position, x: Number(e.target.value) }
                      })}
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Y"
                      value={Math.round(selectedLayer.position.y)}
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
                  <div className="text-xs text-gray-400 mt-1">{Math.round(selectedLayer.opacity * 100)}%</div>
                </div>

                {/* Image transformation controls */}
                {selectedLayer.type === 'image' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Image Controls</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rotateSelectedImage(-90)}
                          className="text-xs"
                        >
                          <RotateCw className="w-3 h-3 mr-1 transform scale-x-[-1]" />
                          Rotate -90°
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rotateSelectedImage(90)}
                          className="text-xs"
                        >
                          <RotateCw className="w-3 h-3 mr-1" />
                          Rotate 90°
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => flipSelectedImage('horizontal')}
                          className="text-xs"
                        >
                          <FlipHorizontal className="w-3 h-3 mr-1" />
                          Flip H
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => flipSelectedImage('vertical')}
                          className="text-xs"
                        >
                          <FlipVertical className="w-3 h-3 mr-1" />
                          Flip V
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
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
                
                {selectedLayer.type === 'shape' && (
                  <div>
                    <label className="text-sm text-gray-400">Fill Color</label>
                    <input
                      type="color"
                      value={selectedLayer.color || '#4F46E5'}
                      onChange={(e) => updateLayer(selectedLayer.id, {
                        color: e.target.value
                      })}
                      className="w-full h-8 bg-gray-700 border border-gray-600 rounded mt-1"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Move className="w-12 h-12 mx-auto opacity-50 mb-2" />
                <p className="text-sm">Select a layer to edit properties</p>
                <p className="text-xs mt-1">Use Space + drag to pan the canvas</p>
              </div>
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
