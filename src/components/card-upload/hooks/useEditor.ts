
import { useState } from 'react';
import { toast } from 'sonner';
import { EnhancedCropBoxProps, MemorabiliaType, applyCrop, detectText } from '../cardDetection';

export interface StagedCardProps {
  id: string;
  cropBox: EnhancedCropBoxProps;
  previewUrl: string;
  file: File;
  url: string;
  metadata?: any;
}

export interface UseEditorProps {
  onCropComplete: (file: File, url: string, memorabiliaType?: MemorabiliaType, metadata?: any) => void;
  currentFile: File | null;
  setShowEditor: (show: boolean) => void;
  autoEnhance?: boolean;
}

export const useEditor = ({ 
  onCropComplete, 
  currentFile, 
  setShowEditor,
  autoEnhance = true
}: UseEditorProps) => {
  const [stagedCards, setStagedCards] = useState<StagedCardProps[]>([]);

  const stageSelectedCrop = async (
    selectedBox: EnhancedCropBoxProps, 
    canvasRef: React.RefObject<HTMLCanvasElement>,
    editorImgRef: React.RefObject<HTMLImageElement>,
    memorabiliaType?: MemorabiliaType,
    showToast: boolean = true
  ) => {
    try {
      if (!currentFile) {
        showToast && toast.error("No image file loaded");
        return null;
      }
      
      if (!editorImgRef.current) {
        showToast && toast.error("Editor image not loaded");
        return null;
      }
      
      console.log("Starting crop with box:", selectedBox);
      
      // Use memorabilia type for specialized enhancement
      const actualType = memorabiliaType || selectedBox.memorabiliaType || 'unknown';
      const enhancementType = autoEnhance ? actualType : undefined;
      
      // Create a temporary canvas to extract just the cropped area for metadata detection
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      if (ctx && editorImgRef.current) {
        tempCanvas.width = selectedBox.width;
        tempCanvas.height = selectedBox.height;
        
        ctx.drawImage(
          editorImgRef.current,
          selectedBox.x, selectedBox.y, selectedBox.width, selectedBox.height,
          0, 0, selectedBox.width, selectedBox.height
        );
      }
      
      // Extract text data in parallel while cropping
      const metadataPromise = detectText(tempCanvas);
      
      // We're passing the canvas reference directly instead of accessing it here
      // This gives more control to the applyCrop function to handle null cases
      const result = await applyCrop(
        selectedBox, 
        canvasRef.current, 
        currentFile, 
        editorImgRef.current,
        enhancementType
      );
      
      // Wait for metadata extraction to complete
      const metadata = await metadataPromise;
      
      if (result && result.file && result.url) {
        const newStagedCard: StagedCardProps = {
          id: `card-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          cropBox: {
            ...selectedBox,
            memorabiliaType: actualType
          },
          previewUrl: result.url,
          file: result.file,
          url: result.url,
          metadata
        };
        
        setStagedCards(prev => [...prev, newStagedCard]);
        
        // Show appropriate toast message based on memorabilia type
        if (showToast) {
          switch (actualType) {
            case 'ticket':
              toast.success("Ticket stub extracted and enhanced");
              break;
            case 'program':
              toast.success("Program/scorecard extracted and enhanced");
              break;
            case 'autograph':
              toast.success("Autographed item extracted and enhanced");
              break;
            case 'card':
              toast.success("Baseball card extracted and enhanced");
              break;
            default:
              toast.success("Item extracted successfully");
          }
        }
        
        return {...result, metadata};
      } else {
        console.error("Failed to crop the image, result:", result);
        showToast && toast.error("Failed to extract the item");
        return null;
      }
    } catch (error) {
      console.error("Error in stageSelectedCrop:", error);
      showToast && toast.error(`Error processing image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  // Fix types for select and remove functions to handle numbers or strings
  const selectStagedCard = (cardId: string | number) => {
    const idStr = cardId.toString();
    const stagedCard = stagedCards.find(card => card.id === idStr);
    if (stagedCard && stagedCard.file) {
      onCropComplete(
        stagedCard.file, 
        stagedCard.previewUrl, 
        stagedCard.cropBox.memorabiliaType,
        stagedCard.metadata
      );
      setShowEditor(false);
    }
  };

  const removeStagedCard = (cardId: string | number) => {
    const idStr = cardId.toString();
    setStagedCards(prev => prev.filter(card => card.id !== idStr));
  };

  return {
    stagedCards,
    stageSelectedCrop,
    selectStagedCard,
    removeStagedCard
  };
};
