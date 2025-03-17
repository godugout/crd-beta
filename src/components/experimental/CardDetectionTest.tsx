
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw, Maximize, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Toggle } from '@/components/ui/toggle';
import { detectCardsInImage } from '@/components/card-upload/cardDetection';

interface DetectedCard {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

const CardDetectionTest = () => {
  const [image, setImage] = useState<string | null>(null);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [displayHeight, setDisplayHeight] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEdges, setShowEdges] = useState(false);
  const [showContours, setShowContours] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
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
    };
    reader.readAsDataURL(file);
  };
  
  const handleDetectCards = () => {
    if (!canvasRef.current || !imageRef.current || !image) return;
    
    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      
      // Resize canvas to match image dimensions
      const maxDimension = 800;
      const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
      const width = img.naturalWidth * scale;
      const height = img.naturalHeight * scale;
      
      canvas.width = width;
      canvas.height = height;
      setDisplayWidth(width);
      setDisplayHeight(height);
      
      // Use the detectCardsInImage function from cardDetection.ts
      const detected = detectCardsInImage(img, false, canvas);
      setDetectedCards(detected);
      
      // Draw the detected cards
      drawDetectedCards(canvas, detected, showEdges, showContours);
      
      toast.success(`Detected ${detected.length} cards`);
    } catch (error) {
      console.error('Error detecting cards:', error);
      toast.error('Error detecting cards');
    } finally {
      setIsProcessing(false);
    }
  };
  
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
    
    // DEBUG: Draw edges and contours if enabled
    if (drawEdges) {
      // This would be implemented with actual edge detection
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    }
    
    if (drawContours) {
      // This would be implemented with actual contour detection
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
  };
  
  // Redraw canvas when visualization options change
  useEffect(() => {
    if (canvasRef.current && detectedCards.length > 0) {
      drawDetectedCards(canvasRef.current, detectedCards, showEdges, showContours);
    }
  }, [showEdges, showContours, detectedCards]);
  
  const handleAddNewCard = () => {
    // Add a new placeholder card
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const newCard: DetectedCard = {
      x: canvas.width / 2 - 75,
      y: canvas.height / 2 - 105,
      width: 150,
      height: 210,
      rotation: 0
    };
    
    const newCards = [...detectedCards, newCard];
    setDetectedCards(newCards);
  };
  
  const handleClearDetections = () => {
    setDetectedCards([]);
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          imageRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
    }
  };
  
  const useSmallScreen = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const OverlayContainer = useSmallScreen ? Drawer : Dialog;
  const OverlayTrigger = useSmallScreen ? DrawerTrigger : DialogTrigger;
  const OverlayContent = useSmallScreen ? DrawerContent : DialogContent;
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Card Detection Test Lab</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload an image containing trading cards to test the automatic card detection algorithm.
          Adjust visualization options to see how the detection works.
        </p>
      </div>
      
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
          onClick={handleAddNewCard}
          disabled={!image}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Card Frame
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleClearDetections}
          disabled={!image || detectedCards.length === 0}
        >
          <Trash className="mr-2 h-4 w-4" />
          Clear Detection
        </Button>
      </div>
      
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
      
      <div className="border rounded-lg overflow-hidden bg-neutral-50 flex items-center justify-center relative">
        {image ? (
          <>
            <img 
              ref={imageRef}
              src={image} 
              alt="Card detection" 
              className="hidden"
              onLoad={handleDetectCards}
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
              Upload an image containing trading cards to test the automatic detection algorithm
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
      
      {detectedCards.length > 0 && (
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
