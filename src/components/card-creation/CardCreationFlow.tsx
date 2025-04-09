
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from '@/components/dam/ImageUploader';
import ImageEditor from '@/components/card-upload/ImageEditor';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';
import { storageOperations } from '@/lib/supabase/storage';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import CardEditorContainer from '@/components/card-editor/CardEditorContainer';

interface CardCreationFlowProps {
  card?: any;
  className?: string;
}

const CardCreationFlow: React.FC<CardCreationFlowProps> = ({ card, className }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [extractedImage, setExtractedImage] = useState<string | null>(null);
  const [extractedFile, setExtractedFile] = useState<File | null>(null);
  const [cardType, setCardType] = useState<MemorabiliaType | undefined>('card');
  const [extractedMetadata, setExtractedMetadata] = useState<any>(null);
  
  const navigate = useNavigate();
  
  // Simulate file upload from image URL
  const createFileFromUrl = async (url: string, fileName: string = 'image.jpg'): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };
  
  // Handle image upload
  const handleImageUpload = async (file: File) => {
    setCurrentFile(file);
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    
    // Auto-open editor for extraction
    setShowEditor(true);
  };
  
  // Adapter function for ImageUploader which expects a different signature
  const handleImageUploaderComplete = async (url: string, assetId: string) => {
    try {
      // Convert the dataURL to a File object
      const fileName = `upload-${Date.now()}.jpg`;
      const file = await createFileFromUrl(url, fileName);
      handleImageUpload(file);
    } catch (error) {
      console.error("Error converting image URL to file:", error);
      toast.error("Failed to process the uploaded image");
    }
  };
  
  // Handle crop completion
  const handleCropComplete = async (file: File, url: string, memType?: MemorabiliaType, metadata?: any) => {
    setExtractedFile(file);
    setExtractedImage(url);
    setCardType(memType);
    setExtractedMetadata(metadata);
    
    // Move to details tab after extraction
    setActiveTab('details');
    
    toast.success("Card extracted successfully! Now add details about your card.");
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="upload">Upload & Extract</TabsTrigger>
          <TabsTrigger value="details" disabled={!extractedImage}>Card Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Upload Card Image</h2>
            
            {!uploadedImage ? (
              <ImageUploader onUploadComplete={handleImageUploaderComplete} maxSizeMB={10} />
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-[2.5/3.5] max-w-xs mx-auto border rounded-md overflow-hidden">
                  <img
                    src={extractedImage || uploadedImage}
                    alt="Uploaded card"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex justify-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEditor(true)}
                  >
                    {extractedImage ? "Re-extract Card" : "Extract Card"}
                  </Button>
                  
                  <Button 
                    variant="default"
                    onClick={() => setActiveTab('details')}
                    disabled={!extractedImage}
                  >
                    Continue to Details
                  </Button>
                </div>
              </div>
            )}
            
            {/* Card Editor Dialog */}
            <ImageEditor
              showEditor={showEditor}
              setShowEditor={setShowEditor}
              editorImage={uploadedImage}
              currentFile={currentFile}
              onCropComplete={handleCropComplete}
              enabledMemorabiliaTypes={['card']}
              autoEnhance={true}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          {extractedImage && extractedFile && (
            <CardEditorContainer 
              initialMetadata={extractedMetadata} 
              card={{
                imageUrl: extractedImage,
                title: extractedMetadata?.title || '',
                description: extractedMetadata?.text || '',
                tags: extractedMetadata?.tags || []
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardCreationFlow;
