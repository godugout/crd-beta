
import React, { useState } from 'react';
import { Upload, Camera, Grid, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import CardDetectionCanvas from './CardDetectionCanvas';
import CroppedCardsPreview from './CroppedCardsPreview';
import { useImageProcessing } from '@/hooks/useImageProcessing';

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

const CardDetectorPage: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [croppedCards, setCroppedCards] = useState<CroppedCard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionMode, setDetectionMode] = useState<'auto' | 'multi' | 'single'>('auto');
  
  const { isProcessing: imageProcessing, createThumbnail } = useImageProcessing();

  // Test images - hardcoded for prototype
  const testImages = {
    multiCard: '/lovable-uploads/4c14689f-5abb-4655-aa52-4ad8f5327a2e.png',
    singleCard: '/lovable-uploads/04b639ff-6296-4ea4-ae94-cb97cee8fec8.png'
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      
      // Simulate card detection
      await detectCards(imageUrl);
      
      toast.success('Image uploaded and cards detected!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const detectCards = async (imageUrl: string) => {
    // Create an image element to get dimensions
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      
      let cards: DetectedCard[] = [];
      
      // Detect if this looks like a multi-card image or single card
      const aspectRatio = width / height;
      const isLandscape = aspectRatio > 1.2;
      
      if (detectionMode === 'multi' || (detectionMode === 'auto' && isLandscape && width > 1000)) {
        // Multi-card detection - simulate finding multiple cards in a grid
        cards = detectMultipleCards(width, height);
      } else {
        // Single card detection
        cards = detectSingleCard(width, height);
      }
      
      setDetectedCards(cards);
    };
    img.src = imageUrl;
  };

  const detectMultipleCards = (imageWidth: number, imageHeight: number): DetectedCard[] => {
    // Simulate detecting a grid of cards (like the Finder screenshot)
    const cards: DetectedCard[] = [];
    const cols = 7; // Based on the test image
    const rows = 5;
    
    const cardWidth = imageWidth / cols * 0.8; // 80% to account for spacing
    const cardHeight = imageHeight / rows * 0.8;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col * imageWidth / cols) + (imageWidth / cols - cardWidth) / 2;
        const y = (row * imageHeight / rows) + (imageHeight / rows - cardHeight) / 2;
        
        cards.push({
          id: `card-${row}-${col}`,
          x,
          y,
          width: cardWidth,
          height: cardHeight,
          confidence: 0.85 + Math.random() * 0.1,
          type: 'multi'
        });
      }
    }
    
    return cards;
  };

  const detectSingleCard = (imageWidth: number, imageHeight: number): DetectedCard[] => {
    // For single card, detect the main rectangular shape
    // Apply some padding and center the detection
    const padding = 0.1; // 10% padding
    const width = imageWidth * (1 - padding * 2);
    const height = imageHeight * (1 - padding * 2);
    const x = imageWidth * padding;
    const y = imageHeight * padding;
    
    return [{
      id: 'single-card',
      x,
      y,
      width,
      height,
      confidence: 0.95,
      type: 'single'
    }];
  };

  const handleTestImage = async (type: 'multi' | 'single') => {
    const imageUrl = testImages[type === 'multi' ? 'multiCard' : 'singleCard'];
    setUploadedImage(imageUrl);
    setDetectionMode(type);
    await detectCards(imageUrl);
    toast.success(`Loaded ${type}-card test image`);
  };

  const handleCropsUpdate = (updatedCards: DetectedCard[]) => {
    setDetectedCards(updatedCards);
  };

  const handleCropComplete = async (croppedCards: CroppedCard[]) => {
    setCroppedCards(croppedCards);
    toast.success(`Successfully cropped ${croppedCards.length} cards!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Card Detection & Cropping</h1>
          <p className="text-gray-300">Upload images to automatically detect and crop trading cards</p>
        </div>

        {/* Upload Section */}
        {!uploadedImage && (
          <Card className="p-8 mb-8 bg-gray-800/50 border-gray-700">
            <div className="text-center">
              <div className="flex justify-center gap-4 mb-6">
                <Button
                  onClick={() => handleTestImage('multi')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Grid className="h-5 w-5" />
                  Test Multi-Card
                </Button>
                <Button
                  onClick={() => handleTestImage('single')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <ImageIcon className="h-5 w-5" />
                  Test Single Card
                </Button>
              </div>
              
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-12">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Upload Card Image</h3>
                <p className="text-gray-400 mb-4">
                  Support for single cards or multi-card screenshots
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button className="cursor-pointer" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Choose Image'}
                  </Button>
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* Detection Canvas */}
        {uploadedImage && detectedCards.length > 0 && (
          <CardDetectionCanvas
            imageUrl={uploadedImage}
            detectedCards={detectedCards}
            onCropsUpdate={handleCropsUpdate}
            onCropComplete={handleCropComplete}
            onReset={() => {
              setUploadedImage(null);
              setDetectedCards([]);
              setCroppedCards([]);
            }}
          />
        )}

        {/* Cropped Cards Preview */}
        {croppedCards.length > 0 && (
          <CroppedCardsPreview
            croppedCards={croppedCards}
            onSaveToCollection={() => {
              toast.success('Cards saved to collection!');
              // Reset for next upload
              setUploadedImage(null);
              setDetectedCards([]);
              setCroppedCards([]);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CardDetectorPage;
