
import { useState } from 'react';
import { toast } from 'sonner';
import { CropBoxProps } from '../CropBox';
import { applyCrop } from '../cardDetection';

interface StagedCardProps {
  id: string;
  cropBox: CropBoxProps;
  previewUrl: string;
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
      // Add to staging area instead of completing immediately
      const newStagedCard: StagedCardProps = {
        id: `card-${Date.now()}`,
        cropBox: {...selectedBox},
        previewUrl: result.url
      };
      
      setStagedCards(prev => [...prev, newStagedCard]);
      toast.success("Card added to staging area");
    }
  };

  const selectStagedCard = (cardId: string) => {
    const stagedCard = stagedCards.find(card => card.id === cardId);
    if (stagedCard && currentFile) {
      onCropComplete(new File([currentFile], currentFile.name), stagedCard.previewUrl);
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
