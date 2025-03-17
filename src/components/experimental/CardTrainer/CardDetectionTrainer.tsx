
import React, { useRef, useState, useEffect } from 'react';
import { Pen, Wand2, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { detectCardsInImage } from '@/components/card-upload/cardDetection';
import { useCardCanvas } from './hooks/useCardCanvas';
import { drawDetectedCards, calculateMatchScore } from './utils/cardDetectionUtils';
import { DetectedCard } from './types';
import ImageUpload from './components/ImageUpload';
import TracingTab from './components/TracingTab';
import DetectionTab from './components/DetectionTab';
import ComparisonTab from './components/ComparisonTab';
import ImageDisplay from './components/ImageDisplay';
import TabContent from './components/TabContent';

const CardDetectionTrainer = () => {
  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // State
  const [image, setImage] = useState<string | null>(null);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEdges, setShowEdges] = useState(false);
  const [showContours, setShowContours] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('trace');

  // Custom hook for canvas management
  const {
    canvasRef,
    manualTraces,
    displayWidth,
    displayHeight,
    createCanvas,
    handleAddTrace,
    handleClearTraces
  } = useCardCanvas();

  // Effect to initialize canvas when image changes
  useEffect(() => {
    if (image && imageRef.current) {
      createCanvas(imageRef.current);
    }
  }, [image]);
  
  const handleImageChange = (imageUrl: string) => {
    setImage(imageUrl);
    // Reset previous detection/traces when loading a new image
    setDetectedCards([]);
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
        drawDetectedCards(canvas, detected, showEdges, showContours, img);
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Card Detection Trainer</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload an image containing trading cards, then trace them manually to help improve our automatic detection algorithm.
        </p>
      </div>
      
      <TabContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        image={image}
        fileInputRef={fileInputRef}
        detectedCards={detectedCards}
        manualTraces={manualTraces}
        isProcessing={isProcessing}
        showEdges={showEdges}
        showContours={showContours}
        onImageChange={handleImageChange}
        onDetectCards={handleDetectCards}
        onAddTrace={handleAddTrace}
        onClearTraces={handleClearTraces}
        onCompareResults={handleCompareResults}
        onToggleEdges={setShowEdges}
        onToggleContours={setShowContours}
        onClearDetection={() => setDetectedCards([])}
      />
      
      <ImageDisplay 
        image={image}
        imageRef={imageRef}
        canvasRef={canvasRef}
        displayWidth={displayWidth}
        displayHeight={displayHeight}
        onUploadClick={() => fileInputRef.current?.click()}
      />
    </div>
  );
};

export default CardDetectionTrainer;
