
import { useState, useCallback } from 'react';
import { EnhancedCropBoxProps, MemorabiliaType } from '@/components/card-upload/cardDetection';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useToast } from '@/hooks/use-toast';
import { createToast } from '@/types/toast';

interface UseEditorStateProps {
  isDetecting?: boolean;
  isProcessing?: boolean;
  detectionType?: 'group' | 'memorabilia' | 'mixed';
}

export const useEditorState = ({ 
  isDetecting: initialIsDetecting = false, 
  isProcessing: initialIsProcessing = false,
  detectionType = 'group'
}: UseEditorStateProps = {}) => {
  const [selectedAreas, setSelectedAreas] = useState<EnhancedCropBoxProps[]>([]);
  const [activePanel, setActivePanel] = useState<string>("detect");
  const [autoEnhance, setAutoEnhance] = useState<boolean>(true);
  const [isDetecting, setIsDetecting] = useState<boolean>(initialIsDetecting);
  const [isProcessing, setIsProcessing] = useState<boolean>(initialIsProcessing);
  const { isMobile } = useMobileOptimization();
  const { toast } = useToast();
  
  // Add a new selection area
  const addSelectionArea = useCallback(
    (
      canvasRef: React.RefObject<HTMLCanvasElement>,
      editorImgRef: React.RefObject<HTMLImageElement>
    ) => {
      if (!canvasRef.current || !editorImgRef.current) {
        toast(createToast({
          variant: "warning",
          title: "Cannot add selection",
          description: "Canvas or image reference is not available"
        }));
        return;
      }
      
      const img = editorImgRef.current;
      
      // Create a new area in the center
      const newArea: EnhancedCropBoxProps = {
        id: `selection-${selectedAreas.length + 1}`, // Change from number to string
        x: img.naturalWidth / 2 - 100,
        y: img.naturalHeight / 2 - 100,
        width: 200,
        height: 200,
        rotation: 0,
        color: '#00AAFF',
        memorabiliaType: 'face',
        confidence: 0.5
      };
      
      setSelectedAreas(prev => [...prev, newArea]);
      
      toast(createToast({
        variant: "success",
        title: "Selection area added",
        description: `Added new selection area (#${selectedAreas.length + 1})`
      }));
    },
    [selectedAreas.length, toast]
  );
  
  // Remove an area by index
  const removeArea = useCallback((index: number) => {
    setSelectedAreas(prev => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      
      toast(createToast({
        variant: "info",
        title: "Selection area removed",
        description: `Removed selection area (#${removed.id})`
      }));
      
      return updated;
    });
  }, [toast]);
  
  // Start detection process
  const startDetection = useCallback(() => {
    setIsDetecting(true);
    
    toast(createToast({
      variant: "info",
      title: "Detection started",
      description: "Analyzing image for face detection..."
    }));
    
    // In a real implementation, this would be connected to an actual detection API
  }, [toast]);
  
  // Handle processing state
  const startProcessing = useCallback(() => {
    setIsProcessing(true);
    
    toast(createToast({
      variant: "info",
      title: "Processing started",
      description: "Enhancing selected areas..."
    }));
    
    // Simulate processing completion after a delay
    setTimeout(() => {
      setIsProcessing(false);
      
      toast(createToast({
        variant: "success",
        title: "Processing complete",
        description: `Successfully enhanced ${selectedAreas.length} selection areas`
      }));
    }, 2000);
  }, [selectedAreas.length, toast]);

  return {
    selectedAreas,
    setSelectedAreas,
    activePanel,
    setActivePanel,
    autoEnhance,
    setAutoEnhance,
    addSelectionArea,
    removeArea,
    isDetecting,
    setIsDetecting,
    isProcessing,
    setIsProcessing,
    startDetection,
    startProcessing
  };
};
