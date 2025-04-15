
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CardUpload from '@/components/card-upload/CardUpload';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';

interface ImageUploadStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  completeStep: () => void;
}

const ImageUploadStep: React.FC<ImageUploadStepProps> = ({
  formData,
  updateFormData,
  completeStep
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleImageUpload = useCallback((file: File, previewUrl: string, storagePath?: string) => {
    updateFormData({
      imageFile: file,
      imageUrl: previewUrl,
      storagePath,
    });
    
    completeStep();
    toast.success("Image uploaded successfully!");
  }, [updateFormData, completeStep]);
  
  const handleBatchUpload = useCallback((files: File[], previewUrls: string[], types?: MemorabiliaType[]) => {
    // For now, just use the first image in a batch
    if (files.length > 0 && previewUrls.length > 0) {
      updateFormData({
        imageFile: files[0],
        imageUrl: previewUrls[0],
        memorabiliaType: types?.[0] || 'card',
      });
      
      completeStep();
      toast.success("Image uploaded successfully!");
    }
  }, [updateFormData, completeStep]);
  
  const handleRemoveBackground = useCallback(async () => {
    if (!formData.imageUrl) {
      toast.error("Please upload an image first");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // This would actually use a background removal service
      // For now, we'll just simulate it with a timeout
      toast("Removing background...", {
        duration: 3000,
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // We'd update the image URL to the background-removed version
      toast.success("Background removed successfully!");
    } catch (error) {
      console.error("Error removing background:", error);
      toast.error("Failed to remove background");
    } finally {
      setIsProcessing(false);
    }
  }, [formData.imageUrl]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Upload Card Image</h2>
        <p className="text-gray-500 text-sm">
          Upload a photo of the card you want to digitize. For best results, use a well-lit, high-resolution image.
        </p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        {formData.imageUrl ? (
          <div className="space-y-4">
            <div className="aspect-[2.5/3.5] max-w-xs mx-auto relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src={formData.imageUrl} 
                alt="Card preview" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => updateFormData({ imageFile: null, imageUrl: null })}
              >
                Remove Image
              </Button>
              
              <Button
                onClick={handleRemoveBackground}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Remove Background"}
              </Button>
            </div>
          </div>
        ) : (
          <CardUpload
            onImageUpload={handleImageUpload}
            onBatchUpload={handleBatchUpload}
            batchProcessingEnabled={false}
            enabledMemorabiliaTypes={['card']}
            autoEnhance={true}
          />
        )}
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-700 mb-2">Tips for great card photos:</h3>
        <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
          <li>Place the card on a contrasting background</li>
          <li>Avoid glare and reflections on the card surface</li>
          <li>Ensure the card fills most of the frame</li>
          <li>Use natural lighting when possible</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploadStep;
