
import { useState, useCallback } from 'react';
import { EnhancedCropBoxProps, MemorabiliaType } from '@/components/card-upload/cardDetection';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { toast } from 'sonner';

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
  
  // Add a new selection area
  const addSelectionArea = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    editorImgRef: React.RefObject<HTMLImageElement>
  ) => {
    if (!canvasRef.current || !editorImgRef.current) return;
    
    const img = editorImgRef.current;
    
    // Create a new area in the center
    const newArea: EnhancedCropBoxProps = {
      id: selectedAreas.length + 1,
      x: img.naturalWidth / 2 - 100,
      y: img.naturalHeight / 2 - 100,
      width: 200,
      height: 200,
      rotation: 0,
      color: '#00AAFF',
      memorabiliaType: 'face',
      confidence: 0.5
    };
    
    setSelectedAreas([...selectedAreas, newArea]);
  };
  
  // Remove an area by index
  const removeArea = (index: number) => {
    const updatedAreas = [...selectedAreas];
    updatedAreas.splice(index, 1);
    setSelectedAreas(updatedAreas);
  };

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
    setIsProcessing
  };
};
