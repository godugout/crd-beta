
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  EnhancedCropBoxProps, 
  MemorabiliaType, 
  detectCardsInImage 
} from '@/components/card-upload/cardDetection';

interface CardDetectionTrainerProps {
  onSaveModel?: () => void;
}

const CardDetectionTrainer: React.FC<CardDetectionTrainerProps> = ({ onSaveModel }) => {
  const [selectedTab, setSelectedTab] = useState('upload');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [detectedAreas, setDetectedAreas] = useState<EnhancedCropBoxProps[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setUploadedImages(prev => [...prev, reader.result as string]);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const runDetection = async () => {
    if (!imageRef.current || !imageRef.current.complete) return;
    
    try {
      // Use the mocked function
      const detections = await detectCardsInImage(
        imageRef.current,
        true,
        canvasRef.current,
        ['card']
      );
      
      setDetectedAreas(detections);
    } catch (error) {
      console.error('Detection error:', error);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Card Detection Trainer</CardTitle>
        <CardDescription>
          Upload images to train the card detection model
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="train">Train</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x600px)</p>
                  </div>
                </Label>
                <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>
              
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square border rounded-md overflow-hidden">
                      <img src={img} alt={`Uploaded ${idx}`} className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="train">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
                <h3 className="text-lg font-medium mb-4">Training Dashboard</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Start the training process to improve card detection
                </p>
                <Button>Start Training</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="test">
            <div className="space-y-4">
              <div className="relative border rounded-lg overflow-hidden aspect-video">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <img ref={imageRef} src={uploadedImages[0] || ''} alt="Test image" className="hidden" />
              </div>
              
              <div className="flex justify-center">
                <Button onClick={runDetection}>Run Detection</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset</Button>
        <Button onClick={onSaveModel}>Save Model</Button>
      </CardFooter>
    </Card>
  );
};

export default CardDetectionTrainer;
