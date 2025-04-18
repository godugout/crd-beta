import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadMedia } from '@/lib/mediaManager';

interface MediaUploaderProps {
  memoryId: string;
  userId: string;
  onUploadComplete: (mediaItem: any) => void;
  isPrivate?: boolean;
  detectFaces?: boolean;
  onError?: (err: Error) => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  memoryId,
  userId,
  onUploadComplete,
  onError,
  isPrivate = false,
  detectFaces = false
}) => {
  const [selectedFile, setSelectedFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    fileRef.current?.click();
  };

  const handleCameraClick = () => {
    if (fileRef.current) {
      fileRef.current.setAttribute('capture', 'environment');
      fileRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const meta = { detectFaces };
      const mediaItem = await uploadMedia({
        file: selectedFile,
        memoryId,
        userId,
        isPrivate,
        metadata: meta,
        progressCallback: (pct) => setUploadProgress(pct)
      });
      onUploadComplete(mediaItem);
      setSelectedFile(null);
      setPreview(null);
      setUploadProgress(0);
    } catch (err: any) {
      console.error('Upload error:', err);
      if (onError) onError(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        className="hidden"
        ref={fileRef}
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      
      {!selectedFile ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <p className="text-gray-700 mb-2">Drag and drop files here, or</p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={handleBrowseClick}
                size="sm"
                className="flex items-center gap-1"
              >
                <Upload size={16} />
                Browse
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleCameraClick}
                size="sm"
                className="flex items-center gap-1"
              >
                <Camera size={16} />
                Camera
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {preview && (
            <div className="aspect-video bg-black flex items-center justify-center">
              {selectedFile.type.startsWith('image/') ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : selectedFile.type.startsWith('video/') ? (
                <video 
                  src={preview} 
                  controls 
                  className="max-h-full max-w-full"
                />
              ) : (
                <div className="text-white">Unsupported file type</div>
              )}
            </div>
          )}
          
          <div className="p-3 bg-white">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm truncate">{selectedFile.name}</div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRemoveFile}
                disabled={isUploading}
              >
                <X size={16} className="text-gray-500" />
              </Button>
            </div>
            
            {isUploading ? (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <div className="text-xs text-gray-500 text-right">
                  {Math.round(uploadProgress)}%
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleUpload} 
                size="sm" 
                className="w-full"
              >
                Upload
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
