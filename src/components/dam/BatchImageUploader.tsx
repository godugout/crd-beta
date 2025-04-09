
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { assetService } from '@/lib/dam/assetService';

interface BatchImageUploaderProps {
  onComplete?: (urls: string[], assetIds: string[]) => void;
  className?: string;
  collectionId?: string;
  teamId?: string;
  maxSizeMB?: number;
  maxFiles?: number;
}

const BatchImageUploader: React.FC<BatchImageUploaderProps> = ({
  onComplete,
  className = '',
  collectionId,
  teamId,
  maxSizeMB = 10,
  maxFiles = 10
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Limit number of files
      if (files.length + selectedFiles.length > maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} files at once`);
        return;
      }
      
      // Filter valid files
      const validFiles = selectedFiles.filter(file => {
        // Check file size
        if (file.size > maxSizeBytes) {
          toast.error(`"${file.name}" is too large. Maximum size is ${maxSizeMB}MB`);
          return false;
        }
        
        // Check file type (optional)
        if (!file.type.startsWith('image/')) {
          toast.error(`"${file.name}" is not a valid image`);
          return false;
        }
        
        return true;
      });
      
      // Add valid files
      if (validFiles.length > 0) {
        // Generate previews
        validFiles.forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviews(prev => [...prev, e.target?.result as string]);
          };
          reader.readAsDataURL(file);
        });
        
        // Set files
        setFiles(prev => [...prev, ...validFiles]);
        // Initialize progress
        setProgress(prev => [...prev, ...validFiles.map(() => 0)]);
      }
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setProgress(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }
    
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    const uploadedIds: string[] = [];
    let failedUploads = 0;
    
    try {
      await Promise.all(files.map(async (file, index) => {
        try {
          // Progress updates would normally be handled by your asset service
          // Here we'll simulate progress
          const simulateProgress = () => {
            setProgress(prev => {
              const newProgress = [...prev];
              newProgress[index] = Math.min(newProgress[index] + 10, 90);
              return newProgress;
            });
          };
          
          // Simulate progress updates
          const interval = setInterval(simulateProgress, 300);
          
          // Actual upload
          const result = await assetService.uploadAsset(file, {
            title: file.name,
            collectionId,
            teamId
          });
          
          clearInterval(interval);
          
          if (result && result.url) {
            uploadedUrls.push(result.url);
            uploadedIds.push(result.id);
            setProgress(prev => {
              const newProgress = [...prev];
              newProgress[index] = 100;
              return newProgress;
            });
          } else {
            failedUploads++;
            setProgress(prev => {
              const newProgress = [...prev];
              newProgress[index] = -1; // Mark as failed
              return newProgress;
            });
          }
        } catch (error) {
          failedUploads++;
          setProgress(prev => {
            const newProgress = [...prev];
            newProgress[index] = -1; // Mark as failed
            return newProgress;
          });
          console.error(`Error uploading ${file.name}:`, error);
        }
      }));
      
      if (failedUploads === 0) {
        toast.success(`Successfully uploaded ${files.length} images`);
      } else {
        toast.warning(`Uploaded ${files.length - failedUploads} images, ${failedUploads} failed`);
      }
      
      if (onComplete && uploadedUrls.length > 0) {
        onComplete(uploadedUrls, uploadedIds);
      }
      
      // Clear successfully uploaded files
      const failedIndexes = progress.map((p, i) => p === -1 ? i : -1).filter(i => i !== -1);
      setFiles(files.filter((_, i) => failedIndexes.includes(i)));
      setPreviews(previews.filter((_, i) => failedIndexes.includes(i)));
      setProgress(progress.filter((_, i) => failedIndexes.includes(i)));
      
    } catch (error) {
      console.error('Error during batch upload:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      
      if (files.length + droppedFiles.length > maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} files at once`);
        return;
      }
      
      const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
      
      // Generate previews
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
      
      setFiles(prev => [...prev, ...imageFiles]);
      setProgress(prev => [...prev, ...imageFiles.map(() => 0)]);
    }
  }, [files.length, maxFiles]);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className={className}>
      <div className="mb-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => document.getElementById('batch-file-input')?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className="h-10 w-10 text-gray-400 mb-3" />
          <p className="text-lg font-semibold mb-1">Upload Multiple Images</p>
          <p className="text-sm text-gray-500 mb-3">Drag and drop or click to select files</p>
          <Button>
            Select Files
          </Button>
        </div>
        <input
          id="batch-file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-medium">{files.length} file(s) selected</p>
            {!isUploading && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setFiles([]);
                  setPreviews([]);
                  setProgress([]);
                }}>
                  Clear All
                </Button>
                <Button onClick={uploadFiles}>
                  Upload All
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center p-2 border rounded-lg">
                <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden shrink-0">
                  {previews[index] ? (
                    <img 
                      src={previews[index]} 
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    {!isUploading && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {progress[index] > 0 && (
                    <div className="mt-1">
                      <Progress 
                        value={progress[index]} 
                        max={100}
                        className="h-1"
                      />
                      <div className="flex justify-between text-xs mt-0.5">
                        <span className="text-gray-500">
                          {progress[index] === 100 ? 'Completed' : `${progress[index]}%`}
                        </span>
                        {progress[index] === 100 && (
                          <span className="text-green-600">✓ Uploaded</span>
                        )}
                        {progress[index] === -1 && (
                          <span className="text-red-600">Failed</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchImageUploader;
