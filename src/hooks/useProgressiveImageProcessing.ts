
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  imageProcessingPipeline, 
  ProcessingOptions, 
  ProcessingJob 
} from '@/services/imageProcessingPipeline';

interface UseProgressiveImageProcessingProps {
  onComplete?: (result: {
    processedUrl: string;
    thumbnailUrl?: string;
    metadata?: any;
  }) => void;
  onStageComplete?: (stageName: string, result: any) => void;
  onError?: (error: Error, stageName?: string) => void;
  autoProcess?: boolean;
  processingOptions?: ProcessingOptions;
}

/**
 * Hook for progressive image processing with multi-stage pipeline
 */
export const useProgressiveImageProcessing = ({
  onComplete,
  onStageComplete,
  onError,
  autoProcess = true,
  processingOptions = {}
}: UseProgressiveImageProcessingProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [currentJob, setCurrentJob] = useState<ProcessingJob | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Store job ID for cleanup
  const jobIdRef = useRef<string | null>(null);
  
  // Poll for job updates
  useEffect(() => {
    if (!jobIdRef.current) return;
    
    const interval = setInterval(() => {
      const job = imageProcessingPipeline.getJobStatus(jobIdRef.current!);
      if (job) {
        setCurrentJob(job);
        
        // Calculate overall progress
        const totalStages = job.stages.length;
        const completedStages = job.stages.filter(s => s.status === 'completed').length;
        const processingStage = job.stages.find(s => s.status === 'processing');
        
        let calculatedProgress = (completedStages / totalStages) * 100;
        if (processingStage && processingStage.progress) {
          // Add partial progress from the current processing stage
          const stageWeight = 1 / totalStages;
          calculatedProgress += (processingStage.progress / 100) * stageWeight * 100;
        }
        
        setProgress(Math.round(calculatedProgress));
        
        // Check for completion
        if (job.isComplete) {
          setIsProcessing(false);
          clearInterval(interval);
          
          const result = {
            processedUrl: job.processedUrl || '',
            thumbnailUrl: job.thumbnailUrl,
            metadata: job.metadata
          };
          
          onComplete?.(result);
        }
        
        // Check for newly completed stages
        if (job.currentStage > 0) {
          const justCompletedStage = job.stages[job.currentStage - 1];
          if (justCompletedStage && justCompletedStage.status === 'completed') {
            onStageComplete?.(justCompletedStage.name, justCompletedStage.result);
            
            // Update URLs based on completed stages
            if (justCompletedStage.name === 'client-preview' && justCompletedStage.result?.previewUrl) {
              setPreviewUrl(justCompletedStage.result.previewUrl);
            }
            
            if (justCompletedStage.name === 'initial-processing' && justCompletedStage.result?.processedUrl) {
              setProcessedUrl(justCompletedStage.result.processedUrl);
            }
            
            if (justCompletedStage.name === 'thumbnail-generation' && justCompletedStage.result?.thumbnailUrl) {
              setThumbnailUrl(justCompletedStage.result.thumbnailUrl);
            }
          }
        }
      }
    }, 100); // Poll every 100ms
    
    return () => clearInterval(interval);
  }, [onComplete, onStageComplete]);
  
  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
    };
  }, [previewUrl, processedUrl, thumbnailUrl]);
  
  /**
   * Start processing an image file
   */
  const processImage = useCallback((file: File, options: ProcessingOptions = {}) => {
    // Clean up previous URLs
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
    
    setPreviewUrl(null);
    setProcessedUrl(null);
    setThumbnailUrl(null);
    setCurrentFile(file);
    setIsProcessing(true);
    setProgress(0);
    
    // Merge options
    const mergedOptions = {
      ...processingOptions,
      ...options
    };
    
    try {
      // Start processing pipeline
      const jobId = imageProcessingPipeline.startProcessing(file, mergedOptions);
      jobIdRef.current = jobId;
      
      // Get initial job status
      const job = imageProcessingPipeline.getJobStatus(jobId);
      setCurrentJob(job);
    } catch (error) {
      setIsProcessing(false);
      onError?.(error as Error);
      console.error('Error starting image processing:', error);
    }
  }, [onError, processingOptions, previewUrl, processedUrl, thumbnailUrl]);
  
  /**
   * Cancel current processing job
   */
  const cancelProcessing = useCallback(() => {
    if (jobIdRef.current) {
      imageProcessingPipeline.abortJob(jobIdRef.current);
      setIsProcessing(false);
    }
  }, []);
  
  /**
   * Process a newly selected file
   * Used with file input change events
   */
  const handleFileSelected = useCallback((file: File) => {
    if (!file) return;
    
    setCurrentFile(file);
    if (autoProcess) {
      processImage(file);
    }
  }, [autoProcess, processImage]);
  
  return {
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
  };
};

export default useProgressiveImageProcessing;
