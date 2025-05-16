
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Image, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ElementUploadMetadata } from '@/lib/types/cardElements';
import { useMediaService } from '@/hooks/useMediaService';

interface AssetUploaderProps {
  onUploadComplete?: (url: string, id: string) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  metadata?: Partial<ElementUploadMetadata>;
  className?: string;
  showPreview?: boolean;
}

const AssetUploader: React.FC<AssetUploaderProps> = ({
  onUploadComplete,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB = 5,
  metadata = {},
  className = '',
  showPreview = true
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaService = useMediaService();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    
    if (!selected) return;
    
    // Check file size
    if (selected.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSizeMB}MB`);
      return;
    }
    
    // Reset states
    setError(null);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }, [maxSizeMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc: Record<string, string[]>, type) => {
      acc[type] = [];
      return acc;
    }, {}),
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      let progress = 0;
      
      // Simulate upload progress
      const interval = setInterval(() => {
        progress += 5;
        if (progress >= 95) {
          clearInterval(interval);
        }
        setProgress(progress);
      }, 100);
      
      // Upload the file
      const { data, error } = await mediaService.uploadImage(file, `uploads/${Date.now()}-${file.name}`);
      
      clearInterval(interval);
      setProgress(100);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        toast.success('File uploaded successfully');
        
        if (onUploadComplete) {
          onUploadComplete(data.url, data.path);
        }
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Error uploading file');
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };

  return (
    <div className={`w-full ${className}`}>
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-40 cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
          {isDragActive ? (
            <p className="text-sm text-center text-gray-500">Drop the file here</p>
          ) : (
            <>
              <p className="text-sm text-center text-gray-500">
                Drag & drop a file here, or click to select
              </p>
              <p className="text-xs text-center text-gray-400 mt-1">
                {acceptedTypes.join(', ')} (max {maxSizeMB}MB)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              {preview && showPreview ? (
                <div className="h-10 w-10 mr-3 rounded overflow-hidden bg-gray-100">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 mr-3 rounded bg-gray-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFile}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {uploading && (
            <div className="mb-3">
              <Progress value={progress} className="h-2 mb-1" />
              <p className="text-xs text-gray-500 text-right">{progress}%</p>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive mb-3">{error}</p>
          )}

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="mr-2"
              onClick={clearFile}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleUpload}
              disabled={uploading || !!error}
            >
              {uploading ? (
                <span className="flex items-center">
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="mr-1 h-4 w-4" /> Upload
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetUploader;
