
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  RotateCcw, 
  Scissors, 
  Trash2, 
  Plus, 
  Download,
  ZoomIn,
  ZoomOut,
  Move
} from 'lucide-react';
import { toast } from 'sonner';

interface DetectedCard {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  type: 'single' | 'multi';
}

interface CroppedCard {
  id: string;
  imageUrl: string;
  title: string;
  tags: string[];
  metadata: Record<string, any>;
}

interface CardDetectionCanvasProps {
  imageUrl: string;
  detectedCards: DetectedCard[];
  onCropsUpdate: (cards: DetectedCard[]) => void;
  onCropComplete: (croppedCards: CroppedCard[]) => void;
  onReset: () => void;
}

const CardDetectionCanvas: React.FC<CardDetectionCanvasProps> = ({
  imageUrl,
  detectedCards,
  onCropsUpdate,
  onCropComplete,
  onReset
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(new Image());
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [cards, setCards] = useState<DetectedCard[]>(detectedCards);

  useEffect(() => {
    setCards(detectedCards);
  }, [detectedCards]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageRef.current.complete) return;

    const img = imageRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and pan transformations
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);
    
    // Draw image
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    
    // Draw crop boxes
    cards.forEach((card) => {
      const isSelected = selectedCard === card.id;
      
      // Box outline
      ctx.strokeStyle = isSelected ? '#3b82f6' : '#10b981';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.strokeRect(card.x, card.y, card.width, card.height);
      
      // Fill with semi-transparent overlay
      ctx.fillStyle = isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)';
      ctx.fillRect(card.x, card.y, card.width, card.height);
      
      // Confidence badge
      ctx.fillStyle = isSelected ? '#3b82f6' : '#10b981';
      ctx.fillRect(card.x, card.y - 25, 60, 20);
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(`${Math.round(card.confidence * 100)}%`, card.x + 5, card.y - 10);
      
      // Card ID
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(card.x, card.y + card.height - 20, 80, 20);
      ctx.fillStyle = 'white';
      ctx.fillText(card.id, card.x + 5, card.y + card.height - 5);
      
      // Resize handles for selected card
      if (isSelected) {
        const handleSize = 8;
        ctx.fillStyle = '#3b82f6';
        // Corner handles
        ctx.fillRect(card.x - handleSize/2, card.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(card.x + card.width - handleSize/2, card.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(card.x - handleSize/2, card.y + card.height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(card.x + card.width - handleSize/2, card.y + card.height - handleSize/2, handleSize, handleSize);
      }
    });
    
    ctx.restore();
  }, [cards, selectedCard, zoom, pan]);

  useEffect(() => {
    const img = imageRef.current;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Set canvas size to fit image with initial zoom
      const maxWidth = 1200;
      const maxHeight = 800;
      const scale = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight);
      
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      
      setZoom(scale);
      drawCanvas();
    };
    img.src = imageUrl;
  }, [imageUrl, drawCanvas]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - pan.x;
    const y = (e.clientY - rect.top) / zoom - pan.y;
    
    // Check if click is on any card
    const clickedCard = cards.find(card => 
      x >= card.x && x <= card.x + card.width &&
      y >= card.y && y <= card.y + card.height
    );
    
    setSelectedCard(clickedCard ? clickedCard.id : null);
  };

  const handleDeleteCard = () => {
    if (!selectedCard) return;
    
    const updatedCards = cards.filter(card => card.id !== selectedCard);
    setCards(updatedCards);
    setSelectedCard(null);
    onCropsUpdate(updatedCards);
    toast.success('Crop box deleted');
  };

  const handleAddCard = () => {
    const newCard: DetectedCard = {
      id: `manual-${Date.now()}`,
      x: 100,
      y: 100,
      width: 200,
      height: 280, // Standard card ratio
      confidence: 1.0,
      type: 'single'
    };
    
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    setSelectedCard(newCard.id);
    onCropsUpdate(updatedCards);
    toast.success('New crop box added');
  };

  const cropCards = async () => {
    if (!imageRef.current.complete) return;
    
    const croppedCards: CroppedCard[] = [];
    
    for (const card of cards) {
      // Create a canvas for each crop
      const cropCanvas = document.createElement('canvas');
      const cropCtx = cropCanvas.getContext('2d');
      if (!cropCtx) continue;
      
      cropCanvas.width = card.width;
      cropCanvas.height = card.height;
      
      // Draw the cropped portion
      cropCtx.drawImage(
        imageRef.current,
        card.x, card.y, card.width, card.height,
        0, 0, card.width, card.height
      );
      
      // Convert to blob URL
      const imageUrl = cropCanvas.toDataURL('image/png');
      
      croppedCards.push({
        id: card.id,
        imageUrl,
        title: `Card ${card.id}`,
        tags: [],
        metadata: {
          confidence: card.confidence,
          type: card.type,
          originalBounds: { x: card.x, y: card.y, width: card.width, height: card.height }
        }
      });
    }
    
    onCropComplete(croppedCards);
  };

  return (
    <Card className="p-6 mb-8 bg-gray-800/50 border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">
          Detected Cards ({cards.length})
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setZoom(zoom * 1.2)}
            size="sm"
            variant="outline"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setZoom(zoom / 1.2)}
            size="sm"
            variant="outline"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleAddCard}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleDeleteCard}
            disabled={!selectedCard}
            size="sm"
            variant="outline"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={onReset}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="border border-gray-600 rounded cursor-crosshair max-w-full"
          style={{ display: 'block', margin: '0 auto' }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {selectedCard ? `Selected: ${selectedCard}` : 'Click on a card to select it'}
        </div>
        <Button
          onClick={cropCards}
          disabled={cards.length === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          <Scissors className="h-4 w-4 mr-2" />
          Crop All Cards ({cards.length})
        </Button>
      </div>
    </Card>
  );
};

export default CardDetectionCanvas;
