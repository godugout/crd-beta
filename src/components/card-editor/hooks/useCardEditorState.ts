
import { useState, useCallback } from 'react';

export interface CardStyle {
  effect: string;
  brightness: number;
  contrast: number;
  saturation: number;
  borderWidth: number;
  borderRadius: string;
  borderColor: string;
  backgroundColor: string;
}

interface UseCardEditorStateProps {
  initialCard?: any;
  initialMetadata?: any;
}

export const useCardEditorState = ({ initialCard, initialMetadata }: UseCardEditorStateProps) => {
  // Basic card info
  const [title, setTitle] = useState(initialCard?.title || initialMetadata?.title || '');
  const [description, setDescription] = useState(initialCard?.description || initialMetadata?.description || '');
  const [player, setPlayer] = useState(initialCard?.player || initialMetadata?.player || '');
  const [team, setTeam] = useState(initialCard?.team || initialMetadata?.team || '');
  const [year, setYear] = useState(initialCard?.year || initialMetadata?.year || '');
  const [tags, setTags] = useState<string[]>(initialCard?.tags || initialMetadata?.tags || []);
  const [imageUrl, setImageUrl] = useState<string>(initialCard?.imageUrl || '');
  
  // Card design customization
  const [cardStyle, setCardStyle] = useState<CardStyle>({
    effect: initialCard?.effect || 'classic',
    brightness: initialCard?.brightness || 100,
    contrast: initialCard?.contrast || 100,
    saturation: initialCard?.saturation || 100,
    borderWidth: initialCard?.borderWidth || 0,
    borderRadius: initialCard?.borderRadius || '8px',
    borderColor: initialCard?.borderColor || '#000000',
    backgroundColor: initialCard?.backgroundColor || '#ffffff',
  });
  
  // Card effects
  const [selectedEffect, setSelectedEffect] = useState<string>(initialCard?.selectedEffect || 'none');
  
  // Handle image upload
  const handleFileChange = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);
  
  // Get final card data for saving
  const getCardData = useCallback(() => {
    return {
      title,
      description,
      player,
      team,
      year,
      tags,
      imageUrl,
      effect: selectedEffect,
      ...cardStyle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [title, description, player, team, year, tags, imageUrl, selectedEffect, cardStyle]);
  
  return {
    title,
    setTitle,
    description,
    setDescription,
    player, 
    setPlayer,
    team,
    setTeam,
    year,
    setYear,
    tags,
    setTags,
    imageUrl,
    setImageUrl,
    cardStyle,
    setCardStyle,
    selectedEffect,
    setSelectedEffect,
    handleFileChange,
    getCardData,
  };
};
