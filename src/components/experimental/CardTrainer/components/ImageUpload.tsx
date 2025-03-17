
import React from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onImageChange: (imageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ fileInputRef, onImageChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={() => fileInputRef.current?.click()}
      className="relative overflow-hidden"
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      Upload Image
    </Button>
  );
};

export default ImageUpload;
