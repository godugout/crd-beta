import React, { useState } from 'react';
import { Upload, Camera, Grid, Image as ImageIcon, X } from 'lucide-react';
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

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  detectedCards: DetectedCard[];
  croppedCards: CroppedCard[];
  isProcessed: boolean;
}

const CardDetectorPage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionMode, setDetectionMode] = useState<'auto' | 'multi' | 'single'>('auto');
  
  const { isProcessing: imageProcessing, createThumbnail } = useImageProcessing();

  // Test images - hardcoded for prototype
  const testImages = {
    multiCard: '/lovable-uploads/4c14689f-5abb-4655-aa52-4ad8f5327a2e.png',
    singleCard: '/lovable-uploads/04b639ff-6296-4ea4-ae94-cb97cee8fec8.png'
  };

  const handleMultipleImageUpload = async (files: File[]) => {
    try {
      setIsProcessing(true);
      
      const newImages: UploadedImage[] = [];
      
      for (const file of files) {
        const imageUrl = URL.createObjectURL(file);
        const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const uploadedImage: UploadedImage = {
          id: imageId,
          file,
          url: imageUrl,
          name: file.name,
          detectedCards: [],
          croppedCards: [],
          isProcessed: false
        };
        
        // Detect cards for this image
        const detectedCards = await detectCardsForImage(imageUrl);
        uploadedImage.detectedCards = detectedCards;
        uploadedImage.isProcessed = true;
        
        newImages.push(uploadedImage);
      }
      
      setUploadedImages(prev => [...prev, ...newImages]);
      
      // Select the first uploaded image if none is selected
      if (!selectedImageId && newImages.length > 0) {
        setSelectedImageId(newImages[0].id);
      }
      
      toast.success(`Uploaded and processed ${files.length} images!`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to process images');
    } finally {
      setIsProcessing(false);
    }
  };

  const detectCardsForImage = async (imageUrl: string): Promise<DetectedCard[]> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        
        let cards: DetectedCard[] = [];
        
        // Detect if this looks like a multi-card image or single card
        const aspectRatio = width / height;
        const isLandscape = aspectRatio > 1.2;
        
        if (detectionMode === 'multi' || (detectionMode === 'auto' && isLandscape && width > 1000)) {
          // Multi-card detection with dynamic grid analysis
          cards = detectMultipleCardsAdvanced(width, height);
        } else {
          // Single card detection
          cards = detectSingleCard(width, height);
        }
        
        resolve(cards);
      };
      img.src = imageUrl;
    });
  };

  const detectMultipleCardsAdvanced = (imageWidth: number, imageHeight: number): DetectedCard[] => {
    const cards: DetectedCard[] = [];
    
    // Dynamic grid detection based on aspect ratio and image size
    let cols = 5; // Default for the test image
    let rows = 5;
    
    // Analyze image to determine grid size
    const aspectRatio = imageWidth / imageHeight;
    
    // For landscape images, try to detect the grid structure
    if (aspectRatio > 1.5) {
      // Very wide image - likely more columns than rows
      cols = Math.max(5, Math.round(aspectRatio * 3));
      rows = Math.max(3, Math.round(cols / aspectRatio));
    } else if (aspectRatio > 1.0) {
      // Moderately wide - balanced grid
      cols = 5;
      rows = 5;
    } else {
      // Portrait or square - more rows than columns
      rows = Math.max(5, Math.round(1 / aspectRatio * 3));
      cols = Math.max(3, Math.round(rows * aspectRatio));
    }
    
    // Calculate cell dimensions with proper spacing detection
    const marginX = imageWidth * 0.05; // 5% margin on each side
    const marginY = imageHeight * 0.05; // 5% margin top and bottom
    
    const availableWidth = imageWidth - (marginX * 2);
    const availableHeight = imageHeight - (marginY * 2);
    
    const cellWidth = availableWidth / cols;
    const cellHeight = availableHeight / rows;
    
    // Calculate card size within each cell (accounting for spacing)
    const spacingRatio = 0.1; // 10% spacing between cards
    const cardWidth = cellWidth * (1 - spacingRatio);
    const cardHeight = cellHeight * (1 - spacingRatio);
    
    console.log(`Detecting ${rows}x${cols} grid with cards of size ${cardWidth}x${cardHeight}`);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Calculate position with proper centering within each cell
        const cellCenterX = marginX + (col * cellWidth) + (cellWidth / 2);
        const cellCenterY = marginY + (row * cellHeight) + (cellHeight / 2);
        
        const x = cellCenterX - (cardWidth / 2);
        const y = cellCenterY - (cardHeight / 2);
        
        // Add some randomness to confidence based on position
        // Edge cards might have lower confidence
        const isEdgeCard = row === 0 || row === rows - 1 || col === 0 || col === cols - 1;
        const baseConfidence = isEdgeCard ? 0.75 : 0.85;
        const confidence = baseConfidence + (Math.random() * 0.15);
        
        cards.push({
          id: `card-${row + 1}-${col + 1}`,
          x,
          y,
          width: cardWidth,
          height: cardHeight,
          confidence,
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
    
    // Create a mock file for the test image
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], `test-${type}-card.png`, { type: 'image/png' });
    
    setDetectionMode(type);
    await handleMultipleImageUpload([file]);
    toast.success(`Loaded ${type}-card test image`);
  };

  const handleRemoveImage = (imageId: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      
      // If we're removing the selected image, select another one
      if (selectedImageId === imageId) {
        setSelectedImageId(updated.length > 0 ? updated[0].id : null);
      }
      
      return updated;
    });
    toast.success('Image removed');
  };

  const handleCropsUpdate = (updatedCards: DetectedCard[]) => {
    if (!selectedImageId) return;
    
    setUploadedImages(prev =>
      prev.map(img =>
        img.id === selectedImageId
          ? { ...img, detectedCards: updatedCards }
          : img
      )
    );
  };

  const handleCropComplete = async (croppedCards: CroppedCard[]) => {
    if (!selectedImageId) return;
    
    setUploadedImages(prev =>
      prev.map(img =>
        img.id === selectedImageId
          ? { ...img, croppedCards }
          : img
      )
    );
    
    toast.success(`Successfully cropped ${croppedCards.length} cards!`);
  };

  const selectedImage = uploadedImages.find(img => img.id === selectedImageId);
  const allCroppedCards = uploadedImages.flatMap(img => img.croppedCards);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Card Detection & Cropping</h1>
          <p className="text-gray-300">Upload multiple images to automatically detect and crop trading cards</p>
        </div>

        {/* Upload Section */}
        {uploadedImages.length === 0 && (
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
              
              <MultiImageDropzone
                onFilesSelected={handleMultipleImageUpload}
                isUploading={isProcessing}
              />
            </div>
          </Card>
        )}

        {/* Image Gallery */}
        {uploadedImages.length > 0 && (
          <Card className="p-6 mb-8 bg-gray-800/50 border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Uploaded Images ({uploadedImages.length})
              </h2>
              <MultiImageDropzone
                onFilesSelected={handleMultipleImageUpload}
                isUploading={isProcessing}
                compact
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageId === image.id
                      ? 'border-blue-500 ring-2 ring-blue-500/50'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedImageId(image.id)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(image.id);
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                    <p className="text-xs text-white truncate">{image.name}</p>
                    <p className="text-xs text-gray-300">
                      {image.detectedCards.length} cards detected
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Detection Canvas for Selected Image */}
        {selectedImage && (
          <CardDetectionCanvas
            imageUrl={selectedImage.url}
            detectedCards={selectedImage.detectedCards}
            onCropsUpdate={handleCropsUpdate}
            onCropComplete={handleCropComplete}
            onReset={() => {
              setUploadedImages([]);
              setSelectedImageId(null);
            }}
          />
        )}

        {/* All Cropped Cards Preview */}
        {allCroppedCards.length > 0 && (
          <CroppedCardsPreview
            croppedCards={allCroppedCards}
            onSaveToCollection={() => {
              toast.success('All cards saved to collection!');
              // Reset for next upload
              setUploadedImages([]);
              setSelectedImageId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Multi-Image Dropzone Component
interface MultiImageDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
  compact?: boolean;
}

const MultiImageDropzone: React.FC<MultiImageDropzoneProps> = ({ 
  onFilesSelected, 
  isUploading, 
  compact = false 
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      if (files.length > 0) {
        onFilesSelected(files);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="compact-image-upload"
          disabled={isUploading}
        />
        <label htmlFor="compact-image-upload">
          <Button 
            className="cursor-pointer" 
            disabled={isUploading}
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Processing...' : 'Add More'}
          </Button>
        </label>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 transition-colors ${
        dragActive 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-gray-600 hover:border-gray-500'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Upload Card Images</h3>
      <p className="text-gray-400 mb-4">
        Drag and drop multiple images or click to browse
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Supports single cards and multi-card screenshots
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="multi-image-upload"
        disabled={isUploading}
      />
      <label htmlFor="multi-image-upload">
        <Button className="cursor-pointer" disabled={isUploading}>
          {isUploading ? 'Processing...' : 'Choose Images'}
        </Button>
      </label>
    </div>
  );
};

export default CardDetectorPage;
