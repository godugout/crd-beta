
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Camera, Plus, Scan } from 'lucide-react';
import { toast } from 'sonner';
import CardUpload from '@/components/card-upload/CardUpload';
import ImageEditor from '@/components/card-upload/ImageEditor';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';
import useImageProcessing from '@/hooks/useImageProcessing';

interface CardScanUploadProps {
  onImageCaptured: (imageUrl: string) => void;
}

const CardScanUpload: React.FC<CardScanUploadProps> = ({ onImageCaptured }) => {
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editorImage, setEditorImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isProcessing } = useImageProcessing();

  // Handle card scanning/photo capture
  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  // Handle image upload from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCurrentFile(file);
      
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setEditorImage(url);
      
      // Show the editor for cropping and processing
      setShowEditor(true);
    }
  };

  // Handle image upload via drag and drop or file browser
  const handleImageUpload = (file: File, previewUrl: string) => {
    onImageCaptured(previewUrl);
    toast.success("Card image uploaded successfully! Ready to customize.");
  };

  // Handle crop completion from the editor
  const handleCropComplete = (file: File, url: string, memorabiliaType?: MemorabiliaType) => {
    onImageCaptured(url);
    setShowEditor(false);
    toast.success("Card extracted successfully! Ready to customize.");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="scan">
            <Scan className="h-4 w-4 mr-2" />
            Scan Card
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-2" />
            Create Custom
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan" className="space-y-4 py-4">
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              Use your camera to scan a trading card. 
              Position the card on a flat surface with good lighting for best results.
            </p>
            
            <input 
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <Button 
              onClick={handleCameraCapture}
              className="w-full max-w-xs"
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              Capture Card
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="py-4">
          <CardUpload 
            onImageUpload={handleImageUpload}
            enabledMemorabiliaTypes={['card']}
            autoEnhance={true}
          />
        </TabsContent>
        
        <TabsContent value="create" className="py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Template placeholders - these would be dynamically loaded in a real implementation */}
            {['Vintage', 'Modern', 'Sports', 'Art', 'Gaming', 'Collectible'].map((template) => (
              <div 
                key={template}
                className="aspect-[2.5/3.5] border rounded-lg bg-gray-100 hover:bg-gray-200 flex flex-col items-center justify-center cursor-pointer transition-colors"
                onClick={() => {
                  toast.info(`${template} template selected! This will be implemented in the future.`);
                  setActiveTab('upload');
                }}
              >
                <div className="text-lg font-medium">{template}</div>
                <div className="text-xs text-gray-600">Template</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Editor Modal */}
      {showEditor && (
        <ImageEditor
          showEditor={showEditor}
          setShowEditor={setShowEditor}
          editorImage={editorImage}
          currentFile={currentFile}
          onCropComplete={handleCropComplete}
          enabledMemorabiliaTypes={['card']}
          autoEnhance={true}
        />
      )}
    </div>
  );
};

export default CardScanUpload;
