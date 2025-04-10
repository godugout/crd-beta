
import { useState, useCallback } from 'react';

interface CardEditorStateProps {
  initialCard?: any;
  initialMetadata?: any;
}

export function useCardEditorState({ initialCard, initialMetadata }: CardEditorStateProps) {
  // Basic info
  const [title, setTitle] = useState(initialCard?.title || initialMetadata?.title || '');
  const [description, setDescription] = useState(initialCard?.description || initialMetadata?.description || '');
  const [player, setPlayer] = useState(initialCard?.player || initialMetadata?.player || '');
  const [team, setTeam] = useState(initialCard?.team || initialMetadata?.team || '');
  const [year, setYear] = useState(initialCard?.year || initialMetadata?.year || '');
  const [tags, setTags] = useState<string[]>(initialCard?.tags || initialMetadata?.tags || []);
  
  // Image
  const [imageUrl, setImageUrl] = useState<string>(initialCard?.imageUrl || initialMetadata?.imageUrl || '');
  
  // Design options
  const [cardStyle, setCardStyle] = useState<any>(initialCard?.designMetadata?.cardStyle || {
    borderRadius: '8px',
    effect: 'classic',
    borderColor: '#48BB78',
    backgroundColor: '#FFFFFF'
  });
  
  // Effects
  const [selectedEffects, setSelectedEffects] = useState<string[]>(initialCard?.designMetadata?.effects || []);
  
  const handleFileChange = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);
  
  const getCardData = useCallback(() => {
    return {
      title,
      description,
      imageUrl,
      tags,
      designMetadata: {
        cardStyle,
        effects: selectedEffects,
        player,
        team,
        year,
      }
    };
  }, [title, description, imageUrl, tags, cardStyle, selectedEffects, player, team, year]);

  return {
    // Basic info
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
    
    // Image
    imageUrl,
    setImageUrl,
    handleFileChange,
    
    // Design
    cardStyle,
    setCardStyle,
    
    // Effects
    selectedEffects,
    setSelectedEffects,
    
    // Utils
    getCardData
  };
}
