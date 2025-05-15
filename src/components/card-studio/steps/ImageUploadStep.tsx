
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, Camera } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploadStepProps {
  imageUrl: string;
  onImageSelect: (url: string) => void;
}

const ImageUploadStep: React.FC<ImageUploadStepProps> = ({
  imageUrl,
  onImageSelect
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size and type
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive"
      });
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Create URL for the file
    const objectUrl = URL.createObjectURL(file);
    onImageSelect(objectUrl);
    
    toast({
      title: "Image uploaded",
      description: "Your image has been uploaded successfully"
    });
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please drop an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Create URL for the file
    const objectUrl = URL.createObjectURL(file);
    onImageSelect(objectUrl);
    
    toast({
      title: "Image uploaded",
      description: "Your image has been uploaded successfully"
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Upload Card Image</h2>
        <p className="text-sm text-gray-500">
          Start by uploading a high-quality image for your card. For best results, use a clear image with good lighting.
        </p>
      </div>
      
      {imageUrl ? (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Card preview" 
            className="max-h-64 mx-auto rounded-md object-contain"
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Image
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center py-6">
            <Upload className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-lg font-medium text-gray-700">
              Drag and drop your image here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Or click to browse (max 5MB)
            </p>
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Browse Files
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => {
            // Implement camera capture functionality
            toast({
              title: "Camera capture",
              description: "This feature is coming soon!"
            });
          }}
        >
          <Camera className="h-4 w-4 mr-2" />
          Take Photo
        </Button>
      </div>
    </div>
  );
};

export default ImageUploadStep;
