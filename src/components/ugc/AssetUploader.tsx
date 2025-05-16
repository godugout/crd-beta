import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { UploadCloud, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Use the updated MediaServiceHook type that includes uploadImage
import { MediaServiceHook } from '@/hooks/card-effects/types';

interface AssetUploaderProps {
  mediaService: MediaServiceHook;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
  accept?: string[];
  maxSize?: number;
  multiple?: boolean;
  className?: string;
  text?: string;
  buttonText?: string;
}

export const AssetUploader: React.FC<AssetUploaderProps> = ({
  mediaService,
  onSuccess,
  onError,
  accept = ['image/*'],
  maxSize = 5000000, // 5MB default
  multiple = false,
  className = '',
  text = 'Drag and drop files here',
  buttonText = 'Select Files'
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!multiple && acceptedFiles.length > 1) {
      acceptedFiles = [acceptedFiles[0]];
    }
    
    setFiles(acceptedFiles);
    
    // Generate previews
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => {
      // Revoke previous object URLs to avoid memory leaks
      prev.forEach(url => URL.revokeObjectURL(url));
      return newPreviews;
    });
  }, [multiple]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple
  });
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index]);
      updated.splice(index, 1);
      return updated;
    });
  };
  
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    try {
      if (files[0].type.startsWith('image/')) {
        const url = await mediaService.uploadImage(files[0]);
        onSuccess?.(url);
        toast({
          title: "Upload complete",
          description: "Image uploaded successfully",
          variant: "success"
        });
      } else {
        const url = await mediaService.uploadFile(files[0]);
        onSuccess?.(url);
        toast({
          title: "Upload complete", 
          description: "File uploaded successfully",
          variant: "success"
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      onError?.(error as Error);
      toast({
        title: "Upload failed",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };
  
  return (
    
    <div className={className}>
      <Card>
        <CardContent className="p-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer ${
              isDragActive ? 'border-primary bg-muted/50' : 'border-muted-foreground/25'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">{text}</p>
            <Button variant="outline" type="button" className="mt-4">
              {buttonText}
            </Button>
          </div>

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="rounded-md w-full h-24 object-cover"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-black/40 rounded-full p-1"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end px-4 pb-4">
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || mediaService.isUploading}
          >
            {mediaService.isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AssetUploader;
