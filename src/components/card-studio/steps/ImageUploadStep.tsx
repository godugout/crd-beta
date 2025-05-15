
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, ImagePlus, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadStepProps {
  imageUrl: string;
  onImageSelect: (url: string) => void;
}

const ImageUploadStep: React.FC<ImageUploadStepProps> = ({ imageUrl, onImageSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  
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
    
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };
  
  const processFile = (file?: File) => {
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (jpg, png, gif, etc)",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleTakePhoto = () => {
    toast({
      title: "Camera Feature",
      description: "Camera functionality would be implemented here"
    });
  };
  
  const handleImageUrl = () => {
    const url = prompt("Enter image URL");
    if (url) {
      // Simple validation
      if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
        onImageSelect(url);
      } else {
        toast({
          title: "Invalid URL",
          description: "Please provide a valid image URL",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Upload Your Card Image</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload a high-quality image for your card. Square images work best.
        </p>
      </div>
      
      {/* Image Preview */}
      {imageUrl && (
        <div className="mt-4">
          <div className="relative aspect-[2.5/3.5] max-w-xs mx-auto bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Card Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-4">
              <Button 
                variant="outline" 
                className="bg-white/90 hover:bg-white w-full"
                onClick={() => onImageSelect('')}
              >
                Change Image
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Zone */}
      {!imageUrl && (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Drag and drop your image here</p>
              <p className="text-xs text-gray-500 mt-1">or select an option below</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Label 
                htmlFor="image-upload" 
                className="bg-primary text-white rounded-md px-4 py-2 cursor-pointer hover:bg-primary/90 transition-colors"
              >
                Browse Files
                <Input 
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </Label>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleImageUrl}
              >
                <ImagePlus className="h-4 w-4" />
                URL
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleTakePhoto}
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Tips for great card images:</h3>
        <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
          <li>Use high-resolution images for best results</li>
          <li>Center the subject in the frame</li>
          <li>Good lighting enhances card appearance</li>
          <li>Avoid busy backgrounds unless intentional</li>
          <li>Recommended aspect ratio: 2.5:3.5 (trading card standard)</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploadStep;
