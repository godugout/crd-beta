
import { useState } from 'react';
import { toast } from 'sonner';
import { CropBoxProps } from '../CropBox';
import { applyCrop } from '../cardDetection';

interface StagedCardProps {
  id: string;
  cropBox: CropBoxProps;
  previewUrl: string;
  file?: File;  // Add file property to store the cropped file
}

export interface UseEditorProps {
  onCropComplete: (file: File, url: string) => void;
  currentFile: File | null;
  setShowEditor: (show: boolean) => void;
}

export const useEditor = ({ onCropComplete, currentFile, setShowEditor }: UseEditorProps) => {
  const [stagedCards, setStagedCards] = useState<StagedCardProps[]>([]);

  const stageSelectedCrop = async (
    selectedBox: CropBoxProps, 
    canvasRef: React.RefObject<HTMLCanvasElement>,
    editorImgRef: React.RefObject<HTMLImageElement>,
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
      
      // We're passing the canvas reference directly instead of accessing it here
      // This gives more control to the applyCrop function to handle null cases
      const result = await applyCrop(
        selectedBox, 
        canvasRef.current, 
        currentFile, 
        editorImgRef.current
      );
      
      if (result && result.file && result.url) {
        const newStagedCard: StagedCardProps = {
          id: `card-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          cropBox: {...selectedBox},
          previewUrl: result.url,
          file: result.file  // Store the file for later use
        };
        
        setStagedCards(prev => [...prev, newStagedCard]);
        showToast && toast.success("Card added to staging area");
        
        return result;
      } else {
        console.error("Failed to crop the image, result:", result);
        showToast && toast.error("Failed to crop the image");
        return null;
      }
    } catch (error) {
      console.error("Error in stageSelectedCrop:", error);
      showToast && toast.error(`Error cropping image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  const selectStagedCard = (cardId: string) => {
    const stagedCard = stagedCards.find(card => card.id === cardId);
    if (stagedCard) {
      if (stagedCard.file) {
        onCropComplete(stagedCard.file, stagedCard.previewUrl);
      } else if (currentFile) {
        onCropComplete(new File([currentFile], currentFile.name), stagedCard.previewUrl);
      }
      setShowEditor(false);
    }
  };

  const removeStagedCard = (cardId: string) => {
    setStagedCards(prev => prev.filter(card => card.id !== cardId));
  };

  return {
    stagedCards,
    stageSelectedCrop,
    selectStagedCard,
    removeStagedCard
  };
};
