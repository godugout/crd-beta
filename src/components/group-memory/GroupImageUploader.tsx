
import React, { useState } from 'react';
import { UploadFileItem } from './hooks/useUploadHandling';
import ProcessingQueue from './components/ProcessingQueue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AssetManager from '@/components/asset-manager/AssetManager';
import { DigitalAsset } from '@/services/digitalAssetService';
import { File, Upload, Users } from 'lucide-react';
import { useDigitalAssets } from '@/hooks/useDigitalAssets';
import { toast } from 'sonner';
import ImageUploadArea from './components/ImageUploadArea';
import { FaceDetectionService } from '@/services/faceDetectionService';

// Update props for ProcessingQueue
interface GroupImageUploaderProps {
  onComplete?: (cardIds: string[]) => void;
  className?: string;
}

const GroupImageUploader: React.FC<GroupImageUploaderProps> = ({ onComplete, className }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAssetManager, setShowAssetManager] = useState(false);
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(true);
  
  const { uploadAsset, isUploading } = useDigitalAssets({
    folder: 'user-uploads',
    autoFetch: false,
  });

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcessUploads = async () => {
    try {
      setIsProcessing(true);
      // Processing logic here - fixed Promise usage
      await new Promise<void>(resolve => {
        setTimeout(resolve, 1000);
      });
      
      // If onComplete is provided, call it with the processed card IDs
      if (onComplete) {
        // In a real implementation, we would get actual IDs from the server
        const cardIds = uploadedFiles.map((_, index) => `processed-file-${Date.now()}-${index}`);
        onComplete(cardIds);
      }
      
      setUploadedFiles([]); // Clear after processing
      toast.success(`Successfully processed ${uploadedFiles.length} images`);
    } catch (error) {
      console.error('Error processing uploads:', error);
      toast.error('Error processing uploads');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleFileSelected = async (file: File) => {
    try {
      // Create a URL for preview
      const url = URL.createObjectURL(file);
      
      // Add to uploaded files
      setUploadedFiles(prev => [...prev, { file, url }]);
    } catch (error) {
      console.error('Error handling file:', error);
      toast.error('Failed to process file');
    }
  };
  
  const handleAssetSelected = async (asset: DigitalAsset) => {
    try {
      const response = await fetch(asset.url);
      const blob = await response.blob();
      const file = new File([blob], asset.originalFilename, { type: asset.mimeType });
      
      // Add to uploaded files
      setUploadedFiles(prev => [...prev, { file, url: asset.url }]);
      
      // Close the asset manager
      setShowAssetManager(false);
      toast.success('Asset added to queue');
    } catch (error) {
      console.error('Error selecting asset:', error);
      toast.error('Failed to add asset to queue');
    }
  };

  // Load face detection models on component mount
  React.useEffect(() => {
    if (faceDetectionEnabled) {
      FaceDetectionService.loadModels().catch(err => {
        console.error('Failed to load face detection models:', err);
        // Fallback to disable face detection if models fail to load
        setFaceDetectionEnabled(false);
      });
    }
  }, [faceDetectionEnabled]);

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Upload Group Photos</h3>
        <Button 
          variant={faceDetectionEnabled ? "default" : "outline"}
          size="sm"
          onClick={() => setFaceDetectionEnabled(!faceDetectionEnabled)}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          {faceDetectionEnabled ? "Face Detection On" : "Face Detection Off"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploadArea onFileSelected={handleFileSelected} />
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Select from Media Library</h3>
          
          <div className="border rounded-lg p-6 text-center">
            <div className="bg-gray-100 rounded-full p-4 mx-auto w-16 h-16 grid place-items-center mb-4">
              <File className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-lg font-semibold mb-2">Choose from your library</p>
            <p className="text-sm text-gray-500 mb-4">
              Select images from your previously uploaded assets
            </p>
            <Button 
              onClick={() => setShowAssetManager(true)} 
              className="w-full"
            >
              Browse Media Library
            </Button>
          </div>
        </div>
      </div>
      
      <ProcessingQueue 
        queue={uploadedFiles}
        onRemoveFromQueue={handleRemoveFile}
        onClearQueue={() => setUploadedFiles([])}
        onProcessAll={handleProcessUploads}
        isProcessing={isProcessing}
      />
      
      <Dialog open={showAssetManager} onOpenChange={setShowAssetManager}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
          </DialogHeader>
          <div className="h-[60vh]">
            <AssetManager
              onSelect={handleAssetSelected}
              allowedTypes={['image/*']}
              initialFolder="user-uploads"
              showUploadTab={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupImageUploader;
