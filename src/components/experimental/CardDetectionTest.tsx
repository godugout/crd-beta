
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw, Maximize, Plus, Trash, Pen, Wand2, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { detectCardsInImage } from '@/components/card-upload/cardDetection';
import { Canvas, Rect, util } from 'fabric';

interface DetectedCard {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

const CardDetectionTest = () => {
  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  
  // State
  const [image, setImage] = useState<string | null>(null);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [manualTraces, setManualTraces] = useState<DetectedCard[]>([]);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [displayHeight, setDisplayHeight] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEdges, setShowEdges] = useState(false);
  const [showContours, setShowContours] = useState(false);
  const [activeTool, setActiveTool] = useState<'select' | 'trace'>('select');
  const [activeTab, setActiveTab] = useState<string>('trace');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      // Reset previous detection/traces when loading a new image
      setDetectedCards([]);
      setManualTraces([]);
    };
    reader.readAsDataURL(file);
  };
  
  // Initialize fabric.js canvas when an image is loaded
  useEffect(() => {
    if (!image || !canvasRef.current) return;
    
    // If a canvas already exists, dispose of it
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }
    
    const canvas = new Canvas(canvasRef.current);
    fabricCanvasRef.current = canvas;
    
    // Load the image
    if (imageRef.current) {
      const img = imageRef.current;
      
      // Wait for the image to load
      if (img.complete) {
        initializeCanvas(img, canvas);
      } else {
        img.onload = () => initializeCanvas(img, canvas);
      }
    }
    
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [image]);
  
  // Initialize canvas with loaded image
  const initializeCanvas = (img: HTMLImageElement, canvas: Canvas) => {
    const maxDimension = 800;
    const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;
    
    // Set canvas dimensions
    canvas.setWidth(width);
    canvas.setHeight(height);
    setDisplayWidth(width);
    setDisplayHeight(height);
    
    // Create a fabric image object
    util.loadImage(img.src, (fabricImg) => {
      canvas.setBackgroundImage(fabricImg, canvas.renderAll.bind(canvas), {
        scaleX: width / img.naturalWidth,
        scaleY: height / img.naturalHeight,
        originX: 'left',
        originY: 'top'
      });
    });
    
    // Configure canvas for tracing
    setupCanvasForTracing(canvas);
  };
  
  // Configure canvas for card tracing
  const setupCanvasForTracing = (canvas: Canvas) => {
    // Set default options
    canvas.selection = false;
    
    // Handle object added
    canvas.on('object:added', (e) => {
      if (!e.target) return;
      
      // Apply constraints for card shape
      if (e.target.type === 'rect') {
        const rect = e.target;
        // Force a 2.5:3.5 ratio for trading cards
        const currentWidth = rect.width || 0;
        rect.set('height', currentWidth * (3.5 / 2.5));
        rect.set({
          fill: 'rgba(0, 0, 255, 0.2)',
          stroke: 'blue',
          strokeWidth: 2,
          transparentCorners: false,
          cornerColor: 'blue',
          cornerStrokeColor: 'white',
          borderColor: 'blue',
          cornerSize: 8,
          padding: 5,
          cornerStyle: 'circle',
          borderDashArray: [3, 3]
        });
      }
      
      canvas.renderAll();
      updateManualTraces();
    });
    
    // Update traces when objects are modified
    canvas.on('object:modified', () => {
      updateManualTraces();
    });
  };
  
  // Update manual traces from canvas objects
  const updateManualTraces = () => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const traces: DetectedCard[] = [];
    
    canvas.getObjects().forEach(obj => {
      if (obj.type === 'rect') {
        const rect = obj;
        traces.push({
          x: rect.left || 0,
          y: rect.top || 0,
          width: rect.width || 0,
          height: rect.height || 0,
          rotation: rect.angle || 0
        });
      }
    });
    
    setManualTraces(traces);
  };
  
  // Add a new card trace rectangle
  const handleAddTrace = () => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const width = 150;
    const height = width * (3.5 / 2.5);
    
    const rect = new Rect({
      left: canvas.width! / 2 - width / 2,
      top: canvas.height! / 2 - height / 2,
      width: width,
      height: height,
      fill: 'rgba(0, 0, 255, 0.2)',
      stroke: 'blue',
      strokeWidth: 2,
      transparentCorners: false,
      cornerColor: 'blue',
      cornerStrokeColor: 'white',
      borderColor: 'blue',
      cornerSize: 8,
      padding: 5,
      cornerStyle: 'circle',
      borderDashArray: [3, 3]
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    
    updateManualTraces();
  };
  
  // Clear all traced objects
  const handleClearTraces = () => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    canvas.getObjects().forEach(obj => canvas.remove(obj));
    canvas.renderAll();
    
    setManualTraces([]);
  };
  
  // Run automatic card detection based on traces
  const handleDetectCards = () => {
    if (!canvasRef.current || !imageRef.current || !image) return;
    
    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      
      // Use the detectCardsInImage function from cardDetection.ts
      const detected = detectCardsInImage(img, false, canvas);
      setDetectedCards(detected);
      
      if (activeTab === 'detect') {
        // If we're in detect mode, draw the detected cards on the canvas
        drawDetectedCards(canvas, detected, showEdges, showContours);
      }
      
      toast.success(`Detected ${detected.length} cards`);
    } catch (error) {
      console.error('Error detecting cards:', error);
      toast.error('Error detecting cards');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Compare manual traces with detected cards
  const handleCompareResults = () => {
    if (!manualTraces.length) {
      toast.error('You need to trace at least one card first');
      return;
    }
    
    if (!detectedCards.length) {
      handleDetectCards();
    }
    
    setActiveTab('compare');
    
    // Calculate match score (simple version)
    const matchPercentage = calculateMatchScore(manualTraces, detectedCards);
    
    toast.info(`Comparison complete. Algorithm match: ${matchPercentage.toFixed(0)}%`, {
      description: "Manual tracing helps improve our detection algorithms",
      duration: 5000
    });
  };
  
  // Calculate a simple match score between manual traces and detected cards
  const calculateMatchScore = (manual: DetectedCard[], detected: DetectedCard[]): number => {
    if (!manual.length || !detected.length) return 0;
    
    // For simplicity, we'll use a very basic overlap score
    let totalScore = 0;
    
    manual.forEach(manualCard => {
      // Find the best matching detected card
      const scores = detected.map(detectedCard => {
        // Calculate center points
        const manualCenterX = manualCard.x + manualCard.width / 2;
        const manualCenterY = manualCard.y + manualCard.height / 2;
        const detectedCenterX = detectedCard.x + detectedCard.width / 2;
        const detectedCenterY = detectedCard.y + detectedCard.height / 2;
        
        // Calculate distance between centers
        const distance = Math.sqrt(
          Math.pow(manualCenterX - detectedCenterX, 2) + 
          Math.pow(manualCenterY - detectedCenterY, 2)
        );
        
        // Calculate size difference
        const sizeDiff = Math.abs(
          (manualCard.width * manualCard.height) - 
          (detectedCard.width * detectedCard.height)
        ) / (manualCard.width * manualCard.height);
        
        // Calculate rotation difference (simplified)
        const rotDiff = Math.abs(manualCard.rotation - detectedCard.rotation) / 180;
        
        // Combine factors (lower is better)
        return distance + sizeDiff * 100 + rotDiff * 50;
      });
      
      // Find the best match (lowest score)
      const bestScore = Math.min(...scores);
      const normalizedScore = Math.max(0, 100 - bestScore);
      
      totalScore += normalizedScore;
    });
    
    return totalScore / manual.length;
  };
  
  // Draw detected cards on canvas
  const drawDetectedCards = (
    canvas: HTMLCanvasElement, 
    cards: DetectedCard[], 
    drawEdges: boolean, 
    drawContours: boolean
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx || !imageRef.current) return;
    
    // Draw the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    // Draw the detected cards
    cards.forEach((card, index) => {
      ctx.save();
      
      // Set up styles for card bounding box
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.lineWidth = 2;
      
      // Draw the bounding box with rotation
      ctx.translate(card.x + card.width/2, card.y + card.height/2);
      ctx.rotate(card.rotation * Math.PI / 180);
      ctx.strokeRect(-card.width/2, -card.height/2, card.width, card.height);
      
      // Label the card
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.font = '14px Arial';
      ctx.fillText(`Card ${index + 1}`, -card.width/2 + 5, -card.height/2 + 20);
      
      ctx.restore();
    });
    
    // Draw edges and contours if enabled
    if (drawEdges || drawContours) {
      // This would be implemented with actual edge/contour detection
      if (drawEdges) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
      }
      
      if (drawContours) {
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(canvas.width - 100, 100);
        ctx.lineTo(canvas.width - 100, canvas.height - 100);
        ctx.lineTo(100, canvas.height - 100);
        ctx.closePath();
        ctx.stroke();
      }
    }
  };
  
  // Configure UI based on screen size
  const useSmallScreen = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const OverlayContainer = useSmallScreen ? Drawer : Dialog;
  const OverlayTrigger = useSmallScreen ? DrawerTrigger : DialogTrigger;
  const OverlayContent = useSmallScreen ? DrawerContent : DialogContent;
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Card Detection Trainer</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload an image containing trading cards, then trace them manually to help improve our automatic detection algorithm.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="trace" className="flex items-center gap-2">
            <Pen className="h-4 w-4" />
            Trace Cards
          </TabsTrigger>
          <TabsTrigger value="detect" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Detect Cards
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Compare Results
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
        
        {activeTab === 'trace' && (
          <>
            <Button 
              variant="outline" 
              onClick={handleAddTrace}
              disabled={!image}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Card Frame
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleClearTraces}
              disabled={!image || manualTraces.length === 0}
            >
              <Trash className="mr-2 h-4 w-4" />
              Clear Traces
            </Button>
            
            <Button 
              variant="default" 
              onClick={handleCompareResults}
              disabled={!image || manualTraces.length === 0}
            >
              <Layers className="mr-2 h-4 w-4" />
              Compare with Detection
            </Button>
          </>
        )}
        
        {activeTab === 'detect' && (
          <>
            <Button 
              variant="default" 
              onClick={handleDetectCards}
              disabled={!image || isProcessing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
              Detect Cards
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setDetectedCards([])}
              disabled={!image || detectedCards.length === 0}
            >
              <Trash className="mr-2 h-4 w-4" />
              Clear Detection
            </Button>
          </>
        )}
      </div>
      
      {activeTab === 'detect' && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Toggle
            pressed={showEdges}
            onPressedChange={setShowEdges}
            variant="outline"
            aria-label="Show edges"
          >
            Show Edges
          </Toggle>
          
          <Toggle
            pressed={showContours}
            onPressedChange={setShowContours}
            variant="outline"
            aria-label="Show contours"
          >
            Show Contours
          </Toggle>
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden bg-neutral-50 flex items-center justify-center relative">
        {image ? (
          <>
            <img 
              ref={imageRef}
              src={image} 
              alt="Card detection" 
              className="hidden"
              onLoad={() => {/* Image loaded callback */}}
            />
            <canvas 
              ref={canvasRef} 
              className="max-w-full"
              style={{ 
                width: displayWidth > 0 ? displayWidth : 'auto',
                height: displayHeight > 0 ? displayHeight : 'auto'
              }}
            />
            <div className="absolute top-4 right-4">
              <OverlayContainer>
                <OverlayTrigger asChild>
                  <Button size="icon" variant="outline" className="rounded-full bg-white/80">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </OverlayTrigger>
                <OverlayContent className="max-w-full w-full h-[90vh] max-h-[90vh] flex items-center justify-center">
                  <div className="w-full h-full overflow-auto flex items-center justify-center">
                    <canvas 
                      width={displayWidth} 
                      height={displayHeight}
                      style={{ 
                        maxWidth: '100%',
                        maxHeight: '100%'
                      }}
                      className="border"
                    />
                  </div>
                </OverlayContent>
              </OverlayContainer>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-neutral-200 rounded-full p-4 mb-4">
              <Upload className="h-8 w-8 text-neutral-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload an image</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Upload an image containing trading cards to trace and improve the detection algorithm
            </p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Image
            </Button>
          </div>
        )}
      </div>
      
      {activeTab === 'compare' && detectedCards.length > 0 && manualTraces.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Manual Traces ({manualTraces.length}):</h3>
            <pre className="text-xs bg-neutral-100 p-4 rounded-md overflow-x-auto h-60">
              {JSON.stringify(manualTraces, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Detected Cards ({detectedCards.length}):</h3>
            <pre className="text-xs bg-neutral-100 p-4 rounded-md overflow-x-auto h-60">
              {JSON.stringify(detectedCards, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      {(activeTab === 'trace' && manualTraces.length > 0) && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Traces ({manualTraces.length}):</h3>
          <pre className="text-xs bg-neutral-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(manualTraces, null, 2)}
          </pre>
        </div>
      )}
      
      {(activeTab === 'detect' && detectedCards.length > 0) && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Detection Results:</h3>
          <pre className="text-xs bg-neutral-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(detectedCards, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CardDetectionTest;
