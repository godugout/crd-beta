
import React, { useState, useEffect } from 'react';
import { useProgressiveImageProcessing } from '@/hooks/useProgressiveImageProcessing';
import { ProcessingOptions } from '@/services/imageProcessingPipeline';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ProgressiveImageProcessorProps {
  onProcessingComplete?: (result: {
    processedUrl: string;
    thumbnailUrl?: string;
    metadata?: any;
  }) => void;
  processingOptions?: ProcessingOptions;
  className?: string;
  maxFileSize?: number; // In MB
  allowedFileTypes?: string[]; // e.g. ['image/jpeg', 'image/png']
  showPreview?: boolean;
}

export const ProgressiveImageProcessor: React.FC<ProgressiveImageProcessorProps> = ({
  onProcessingComplete,
  processingOptions = {
    enhanceQuality: true,
    removeBackground: false,
    detectObjects: true,
    optimizeForWeb: true,
    generateThumbnails: true
  },
  className = '',
  maxFileSize = 10, // 10MB
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  showPreview = true
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [stageMessages, setStageMessages] = useState<{[key: string]: string}>({});
  
  const {
    isProcessing,
    progress,
    previewUrl,
    processedUrl,
    thumbnailUrl,
    currentFile,
    currentJob,
    processImage,
    cancelProcessing,
    handleFileSelected
  } = useProgressiveImageProcessing({
    processingOptions,
    onComplete: (result) => {
      // Update UI with completed state
      toast.success('Image processing completed!');
      
      // Notify parent component of completion
      if (onProcessingComplete) {
        onProcessingComplete(result);
      }
    },
    onStageComplete: (stageName, result) => {
      // Update UI with stage completion
      const messages: {[key: string]: string} = {
        'client-preview': 'Preview generated',
        'initial-processing': 'Basic processing completed',
        'quality-enhancement': 'Quality enhancement completed',
        'background-removal': 'Background removal completed',
        'object-detection': 'Objects detected in image',
        'thumbnail-generation': 'Thumbnails generated',
        'web-optimization': 'Optimized for web display'
      };
      
      setStageMessages(prev => ({
        ...prev,
        [stageName]: messages[stageName] || `Stage ${stageName} completed`
      }));
      
      // Show toast for key stages
      if (['quality-enhancement', 'background-removal', 'object-detection'].includes(stageName)) {
        toast.info(messages[stageName] || `Stage ${stageName} completed`);
      }
    },
    onError: (error, stageName) => {
      toast.error(`Error ${stageName ? `in ${stageName}` : ''}: ${error.message}`);
    }
  });
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };
  
  // Handle file input change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };
  
  // Validate file type and size
  const validateAndProcessFile = (file: File) => {
    const fileSizeInMB = file.size / (1024 * 1024);
    const isValidType = allowedFileTypes.includes(file.type);
    
    if (!isValidType) {
      toast.error(`Invalid file type. Please upload one of: ${allowedFileTypes.join(', ')}`);
      return;
    }
    
    if (fileSizeInMB > maxFileSize) {
      toast.error(`File too large. Maximum size is ${maxFileSize}MB.`);
      return;
    }
    
    handleFileSelected(file);
  };
  
  // Get active stage name
  const getActiveStage = () => {
    if (!currentJob) return 'Preparing...';
    
    const processingStage = currentJob.stages.find(s => s.status === 'processing');
    if (processingStage) {
      return processingStage.description;
    }
    
    return 'Processing...';
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* File Drop Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 dark:border-gray-700'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <Upload className="h-12 w-12 text-gray-400" />
          <div className="text-center">
            <p className="text-lg font-medium">Drag & drop image here</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or click to browse files
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Supported formats: JPG, PNG, WebP up to {maxFileSize}MB
            </p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept={allowedFileTypes.join(',')}
            onChange={handleFileInput}
            id="file-upload"
            disabled={isProcessing}
          />
          <label 
            htmlFor="file-upload" 
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
          >
            Select Image
          </label>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {getActiveStage()}
            </h3>
            <Button variant="ghost" size="sm" onClick={cancelProcessing}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="mt-4 space-y-2 text-sm">
            {Object.entries(stageMessages).map(([stage, message]) => (
              <div key={stage} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {message}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Preview */}
      {showPreview && previewUrl && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Preview</h3>
          <div className="relative aspect-[3/4] max-h-80 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <img
              src={processedUrl || previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            
            {thumbnailUrl && (
              <div className="absolute top-2 right-2 border border-white rounded shadow-md">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="w-16 h-16 object-cover"
                />
              </div>
            )}
          </div>
          
          {processedUrl && (
            <div className="flex justify-between mt-3">
              <span className="text-sm text-gray-500">
                Processed image ready
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs"
                onClick={() => window.open(processedUrl, '_blank')}
              >
                View Full Size
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {!isProcessing && currentJob?.stages.some(s => s.status === 'error') && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>An error occurred during processing</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
            Please try again or use a different image
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressiveImageProcessor;
