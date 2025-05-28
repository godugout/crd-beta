
import { useRef, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface WorkerTask {
  id: string;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  onProgress?: (progress: number) => void;
}

export const useImageProcessingWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const tasksRef = useRef<Map<string, WorkerTask>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/imageProcessingWorker.ts', import.meta.url),
        { type: 'module' }
      );

      workerRef.current.onmessage = (e) => {
        const { type, id, result, error, progress } = e.data;
        const task = tasksRef.current.get(id);

        if (!task) return;

        switch (type) {
          case 'PROGRESS':
            task.onProgress?.(progress);
            break;
          case 'BACKGROUND_REMOVED':
          case 'IMAGE_ENHANCED':
            const blob = new Blob([result]);
            const url = URL.createObjectURL(blob);
            task.resolve({ blob, url });
            tasksRef.current.delete(id);
            setIsProcessing(false);
            break;
          case 'ERROR':
            task.reject(new Error(error));
            tasksRef.current.delete(id);
            setIsProcessing(false);
            toast.error(`Processing failed: ${error}`);
            break;
        }
      };
    }
    return workerRef.current;
  }, []);

  const removeBackground = useCallback(async (
    imageElement: HTMLImageElement,
    onProgress?: (progress: number) => void
  ) => {
    const worker = initializeWorker();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const id = `bg_removal_${Date.now()}`;
    
    setIsProcessing(true);
    
    return new Promise((resolve, reject) => {
      tasksRef.current.set(id, { id, resolve, reject, onProgress });
      
      worker.postMessage({
        type: 'REMOVE_BACKGROUND',
        id,
        payload: {
          imageData: imageData.data,
          width: canvas.width,
          height: canvas.height
        }
      });
    });
  }, [initializeWorker]);

  const enhanceImage = useCallback(async (
    imageElement: HTMLImageElement,
    options: any,
    onProgress?: (progress: number) => void
  ) => {
    const worker = initializeWorker();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const id = `enhance_${Date.now()}`;
    
    setIsProcessing(true);
    
    return new Promise((resolve, reject) => {
      tasksRef.current.set(id, { id, resolve, reject, onProgress });
      
      worker.postMessage({
        type: 'ENHANCE_IMAGE',
        id,
        payload: {
          imageData: imageData.data,
          width: canvas.width,
          height: canvas.height,
          options
        }
      });
    });
  }, [initializeWorker]);

  return {
    removeBackground,
    enhanceImage,
    isProcessing
  };
};
