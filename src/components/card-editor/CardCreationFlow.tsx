
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from '@/components/dam/ImageUploader';
import ImageEditor from '@/components/card-upload/ImageEditor';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';
import { storageOperations } from '@/lib/supabase/storage';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    rarity: 'common',
    isPublic: false,
  });
  
  const navigate = useNavigate();
  
  // Handle image upload
  const handleImageUpload = async (file: File) => {
    setCurrentFile(file);
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    
    // Auto-open editor for extraction
    setShowEditor(true);
  };
  
  // Adapter function to convert ImageUploader's expected format
  const handleImageUploaderComplete = (url: string, assetId: string) => {
    // Since we're not actually using the URL from ImageUploader directly,
    // we can just trigger a file selection instead
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleImageUpload(target.files[0]);
      }
    };
    fileInput.click();
  };
  
  // Handle crop completion
  const handleCropComplete = async (file: File, url: string, memType?: MemorabiliaType) => {
    setExtractedFile(file);
    setExtractedImage(url);
    setCardType(memType);
    
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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Card Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {extractedImage && (
                  <div className="relative aspect-[2.5/3.5] max-w-xs border rounded-md overflow-hidden">
                    <img
                      src={extractedImage}
                      alt="Extracted card"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {cardType || 'Card'}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Card details form would go here */}
              <div className="space-y-4">
                {/* This would be expanded with proper form fields */}
                <p className="text-sm text-gray-500">
                  Card extracted and ready for details. Complete implementation would include form fields for:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-500">
                  <li>Player name</li>
                  <li>Team</li>
                  <li>Year</li>
                  <li>Card set</li>
                  <li>Card number</li>
                  <li>Condition</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardCreationFlow;
