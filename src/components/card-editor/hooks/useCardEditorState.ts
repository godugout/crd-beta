import { useState } from 'react';
import { CardStyle } from '../CardDesignCustomization';
import { TextStyle } from '../CardTextCustomization';
import { FabricSwatch } from '../types';

interface UseCardEditorStateProps {
  initialCard?: any;
}

export const useCardEditorState = ({ initialCard }: UseCardEditorStateProps = {}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(initialCard?.imageUrl || '');
  const [title, setTitle] = useState(initialCard?.title || '');
  const [description, setDescription] = useState(initialCard?.description || '');
  const [tags, setTags] = useState<string[]>(initialCard?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [fabricSwatches, setFabricSwatches] = useState<FabricSwatch[]>(initialCard?.fabricSwatches || []);
  
  // Card design customization state - ensure borderRadius is string type
  const [cardStyle, setCardStyle] = useState<CardStyle>({
    effect: 'classic',
    brightness: 100,
    contrast: 100,
    saturation: 100,
    borderWidth: 0,
    borderRadius: '8px', // Using string instead of number
    borderColor: '#ffffff',
    backgroundColor: '#ffffff'
  });
  
  // Card text customization state
  const [textStyle, setTextStyle] = useState<TextStyle>({
    titleFont: 'sans',
    titleSize: 24,
    titleColor: '#ffffff',
    titleAlignment: 'left',
    titleWeight: 'bold',
    titleStyle: 'normal',
    descriptionFont: 'sans',
    descriptionSize: 12,
    descriptionColor: '#ffffff',
    showOverlay: true,
    overlayOpacity: 50,
    overlayColor: '#000000',
    overlayPosition: 'bottom'
  });

  return {
    // State
    imageFile,
    imageUrl,
    title,
    description,
    tags,
    newTag,
    fabricSwatches,
    cardStyle,
    textStyle,
    
    // Setters
    setImageFile,
    setImageUrl,
    setTitle,
    setDescription,
    setTags,
    setNewTag,
    setFabricSwatches,
    setCardStyle,
    setTextStyle,
    
    // Helpers
    handleImageUpload: (file: File, url: string) => {
      setImageFile(file);
      setImageUrl(url);
    },
    getCardData: () => {
      // Format the fabric swatches data
      const fabricMetadata = fabricSwatches.map(swatch => ({
        type: swatch.type,
        team: swatch.team,
        year: swatch.year,
        manufacturer: swatch.manufacturer,
        position: swatch.position,
        size: swatch.size
      }));

      return {
        title,
        description,
        imageUrl,
        thumbnailUrl: imageUrl,
        tags,
        fabricSwatches: fabricMetadata,
        designMetadata: {
          cardStyle,
          textStyle
        }
      };
    }
  };
};
