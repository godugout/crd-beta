
import { useState, useCallback } from 'react';

interface UseCardEditorStateProps {
  initialCard?: any;
  initialMetadata?: any;
}

export const useCardEditorState = ({ 
  initialCard, 
  initialMetadata
}: UseCardEditorStateProps = {}) => {
  // Basic card info
  const [title, setTitle] = useState(initialCard?.title || initialMetadata?.title || '');
  const [description, setDescription] = useState(
    initialCard?.description || initialMetadata?.text || ''
  );
  const [tags, setTags] = useState<string[]>(
    initialCard?.tags || initialMetadata?.tags || []
  );
  const [newTag, setNewTag] = useState('');
  
  // Image data
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(initialCard?.imageUrl || '');
  
  // Card design - like borders, colors, effects
  const [cardStyle, setCardStyle] = useState<any>({
    borderColor: initialCard?.designMetadata?.borderColor || '#000000',
    borderWidth: initialCard?.designMetadata?.borderWidth || 1,
    borderRadius: initialCard?.designMetadata?.borderRadius || 8,
    backgroundColor: initialCard?.designMetadata?.backgroundColor || '#ffffff',
    effect: initialCard?.designMetadata?.effect || 'none'
  });
  
  // Text styling
  const [textStyle, setTextStyle] = useState<any>({
    titleColor: initialCard?.designMetadata?.titleColor || '#000000',
    titleFont: initialCard?.designMetadata?.titleFont || 'sans-serif',
    titleSize: initialCard?.designMetadata?.titleSize || 24,
    descriptionColor: initialCard?.designMetadata?.descriptionColor || '#333333',
    descriptionFont: initialCard?.designMetadata?.descriptionFont || 'sans-serif',
    descriptionSize: initialCard?.designMetadata?.descriptionSize || 14,
  });
  
  // FabricJS swatches for textiles (jerseys, etc)
  const [fabricSwatches, setFabricSwatches] = useState<any[]>(
    initialCard?.designMetadata?.fabricSwatches || []
  );

  const handleImageUpload = useCallback((file: File, url: string, metadata?: any) => {
    setImageFile(file);
    setImageUrl(url);
    
    // If metadata is provided from OCR, update other fields
    if (metadata) {
      if (metadata.title && !title) setTitle(metadata.title);
      if (metadata.text && !description) setDescription(metadata.text);
      if (metadata.tags && tags.length === 0) setTags(metadata.tags);
      // Could set other fields like year, player, team if they exist in metadata
    }
  }, [title, description, tags]);

  const getCardData = useCallback(() => {
    return {
      title,
      description,
      tags,
      imageUrl,
      designMetadata: {
        ...cardStyle,
        ...textStyle,
        fabricSwatches,
      }
    };
  }, [
    title, description, tags, imageUrl, 
    cardStyle, textStyle, fabricSwatches
  ]);

  return {
    // Basic info
    title, setTitle,
    description, setDescription,
    tags, setTags,
    newTag, setNewTag,
    
    // Image
    imageFile, setImageFile,
    imageUrl, setImageUrl,
    handleImageUpload,
    
    // Design
    cardStyle, setCardStyle,
    textStyle, setTextStyle,
    fabricSwatches, setFabricSwatches,
    
    // Utilities
    getCardData
  };
};
