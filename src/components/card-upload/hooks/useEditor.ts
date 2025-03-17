
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
    editorImgRef: React.RefObject<HTMLImageElement>
  ) => {
    try {
      if (!currentFile) {
        toast.error("No image file loaded");
        return;
      }
      
      if (!editorImgRef.current) {
        toast.error("Editor image not loaded");
        return;
      }
      
      const canvas = canvasRef.current;
      if (!canvas) {
        console.warn("Canvas reference not available, but proceeding with the editor image");
        // Continue with the operation since we have the editor image
      }
      
      console.log("Starting crop with box:", selectedBox);
      
      // We're passing the canvas (which might be null) but the applyCrop function 
      // is now better equipped to handle this case
      const result = await applyCrop(selectedBox, canvas, currentFile, editorImgRef.current);
      
      if (result && result.file && result.url) {
        const newStagedCard: StagedCardProps = {
          id: `card-${Date.now()}`,
          cropBox: {...selectedBox},
          previewUrl: result.url,
          file: result.file  // Store the file for later use
        };
        
        setStagedCards(prev => [...prev, newStagedCard]);
        toast.success("Card added to staging area");
      } else {
        console.error("Failed to crop the image, result:", result);
        toast.error("Failed to crop the image");
      }
    } catch (error) {
      console.error("Error in stageSelectedCrop:", error);
      toast.error(`Error cropping image: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
