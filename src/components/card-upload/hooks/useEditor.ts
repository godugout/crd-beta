
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
    const result = await applyCrop(selectedBox, canvasRef.current, currentFile, editorImgRef.current);
    
    if (result) {
      // Add to staging area with the cropFile included
      const newStagedCard: StagedCardProps = {
        id: `card-${Date.now()}`,
        cropBox: {...selectedBox},
        previewUrl: result.url,
        file: result.file  // Store the file for later use
      };
      
      setStagedCards(prev => [...prev, newStagedCard]);
      toast.success("Card added to staging area");
    } else {
      toast.error("Failed to crop the image");
    }
  };

  const selectStagedCard = (cardId: string) => {
    const stagedCard = stagedCards.find(card => card.id === cardId);
    if (stagedCard) {
      if (stagedCard.file) {
        // If we have the stored file, use it
        onCropComplete(stagedCard.file, stagedCard.previewUrl);
      } else if (currentFile) {
        // Fallback to the original file if needed
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
