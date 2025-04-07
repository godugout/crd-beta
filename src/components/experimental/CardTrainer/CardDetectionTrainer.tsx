
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useCardCanvas } from './hooks/useCardCanvas';
import ImageUpload from './components/ImageUpload';
import TracingTab from './components/TracingTab';
import DetectionTab from './components/DetectionTab';
import ComparisonTab from './components/ComparisonTab';
import { CardTrainerProps, DetectedCard } from './types';
import { detectCardsInImage } from '../../card-upload/cardDetection';
import { EnhancedCropBoxProps } from '../../card-upload/CropBox';

const CardDetectionTrainer: React.FC<CardTrainerProps> = () => {
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [detectionResults, setDetectionResults] = useState<DetectedCard[]>([]);
  
  const {
    canvasRef,
    fabricCanvasRef,
    manualTraces,
    displayWidth,
    displayHeight,
    activeTool,
    setActiveTool,
    createCanvas,
    handleAddTrace,
    handleClearTraces
  } = useCardCanvas();
  
  // Run detection when an image is uploaded
  useEffect(() => {
    if (uploadedImage && canvasRef.current) {
      // Run the detection algorithm
      const autoDetectedCards = detectCardsInImage(
        uploadedImage,
        false,
        canvasRef.current
      );
      
      // Convert to DetectedCard format
      const convertedCards: DetectedCard[] = autoDetectedCards.map(card => ({
        x: card.x,
        y: card.y,
        width: card.width,
        height: card.height,
        rotation: card.rotation || 0
      }));
      
      setDetectionResults(convertedCards);
      
      // Initialize the canvas for manual tracing
      createCanvas(uploadedImage);
    }
  }, [uploadedImage, canvasRef, createCanvas]);
  
  // Run comparison metrics when detections or manual traces change
  useEffect(() => {
    if (detectionResults.length > 0 && manualTraces.length > 0) {
      // In a real implementation, we would run IoU calculations here
      console.log('Comparing', detectionResults.length, 'auto detections with', manualTraces.length, 'manual traces');
    }
  }, [detectionResults, manualTraces]);
  
  const handleSelectImage = (img: HTMLImageElement) => {
    setUploadedImage(img);
  };
  
  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Card Detection Trainer</h2>
      
      {!uploadedImage ? (
        <ImageUpload onSelectImage={handleSelectImage} />
      ) : (
        <Tabs defaultValue="detection" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="detection">Detection Results</TabsTrigger>
              <TabsTrigger value="tracing">Manual Tracing</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
            <Button variant="outline" onClick={() => setUploadedImage(null)}>
              Upload New Image
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <TabsContent value="detection">
                <DetectionTab 
                  uploadedImage={uploadedImage} 
                  detectedCards={detectionResults} 
                />
              </TabsContent>
              
              <TabsContent value="tracing">
                <TracingTab 
                  uploadedImage={uploadedImage}
                  canvasRef={canvasRef}
                  fabricCanvasRef={fabricCanvasRef}
                  displayWidth={displayWidth}
                  displayHeight={displayHeight}
                  activeTool={activeTool}
                  setActiveTool={setActiveTool}
                  manualTraces={manualTraces}
                  onAddTrace={handleAddTrace}
                  onClearTraces={handleClearTraces}
                />
              </TabsContent>
              
              <TabsContent value="comparison">
                <ComparisonTab 
                  uploadedImage={uploadedImage}
                  detectedCards={detectionResults}
                  manualTraces={manualTraces}
                />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      )}
    </div>
  );
};

export default CardDetectionTrainer;
