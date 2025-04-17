import React, { useState, useEffect } from 'react';
import { CardRarity } from '@/lib/types';
import { DesignMetadata } from '@/lib/types/cardTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/lib/types';

interface CardEditorFormProps {
  initialCard?: Partial<Card>;
  onSubmit: (cardData: Partial<Card>) => void;
}

const CardEditorForm = ({ initialCard, onSubmit }: CardEditorFormProps) => {
  const [formData, setFormData] = useState({
    title: initialCard?.title || '',
    description: initialCard?.description || '',
    imageUrl: initialCard?.imageUrl || '',
    tags: initialCard?.tags || [],
    template: initialCard?.designMetadata?.cardStyle?.template || 'classic',
    effect: initialCard?.designMetadata?.cardStyle?.effect || 'none',
    borderRadius: initialCard?.designMetadata?.cardStyle?.borderRadius || '10px',
    borderColor: initialCard?.designMetadata?.cardStyle?.borderColor || '#000000',
    shadowColor: initialCard?.designMetadata?.cardStyle?.shadowColor || 'rgba(0,0,0,0.5)',
    frameWidth: initialCard?.designMetadata?.cardStyle?.frameWidth || 0,
    frameColor: initialCard?.designMetadata?.cardStyle?.frameColor || '#000000',
    titleColor: initialCard?.designMetadata?.textStyle?.titleColor || '#ffffff',
    titleAlignment: initialCard?.designMetadata?.textStyle?.titleAlignment || 'center',
    titleWeight: initialCard?.designMetadata?.textStyle?.titleWeight || 'bold',
    descriptionColor: initialCard?.designMetadata?.textStyle?.descriptionColor || '#ffffff',
    category: initialCard?.designMetadata?.cardMetadata?.category || 'sports',
    series: initialCard?.designMetadata?.cardMetadata?.series || 'standard',
    cardType: initialCard?.designMetadata?.cardMetadata?.cardType || 'player',
    isPrintable: initialCard?.designMetadata?.marketMetadata?.isPrintable || false,
    isForSale: initialCard?.designMetadata?.marketMetadata?.isForSale || false,
    includeInCatalog: initialCard?.designMetadata?.marketMetadata?.includeInCatalog || true,
    player: initialCard?.player || '',
    team: initialCard?.team || '',
    year: initialCard?.year || '',
    effects: initialCard?.effects || []
  });
  
  useEffect(() => {
    if (initialCard) {
      setFormData({
        title: initialCard.title || '',
        description: initialCard.description || '',
        imageUrl: initialCard.imageUrl || '',
        tags: initialCard.tags || [],
        template: initialCard.designMetadata?.cardStyle?.template || 'classic',
        effect: initialCard.designMetadata?.cardStyle?.effect || 'none',
        borderRadius: initialCard.designMetadata?.cardStyle?.borderRadius || '10px',
        borderColor: initialCard.designMetadata?.cardStyle?.borderColor || '#000000',
        shadowColor: initialCard.designMetadata?.cardStyle?.shadowColor || 'rgba(0,0,0,0.5)',
        frameWidth: initialCard.designMetadata?.cardStyle?.frameWidth || 0,
        frameColor: initialCard.designMetadata?.cardStyle?.frameColor || '#000000',
        titleColor: initialCard.designMetadata?.textStyle?.titleColor || '#ffffff',
        titleAlignment: initialCard.designMetadata?.textStyle?.titleAlignment || 'center',
        titleWeight: initialCard.designMetadata?.textStyle?.titleWeight || 'bold',
        descriptionColor: initialCard.designMetadata?.textStyle?.descriptionColor || '#ffffff',
        category: initialCard.designMetadata?.cardMetadata?.category || 'sports',
        series: initialCard.designMetadata?.cardMetadata?.series || 'standard',
        cardType: initialCard.designMetadata?.cardMetadata?.cardType || 'player',
        isPrintable: initialCard.designMetadata?.marketMetadata?.isPrintable || false,
        isForSale: initialCard.designMetadata?.marketMetadata?.isForSale || false,
        includeInCatalog: initialCard.designMetadata?.marketMetadata?.includeInCatalog || true,
        player: initialCard.player || '',
        team: initialCard.team || '',
        year: initialCard.year || '',
        effects: initialCard.effects || []
      });
    }
  }, [initialCard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Create card data with proper types
    const cardData = {
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      thumbnailUrl: formData.imageUrl, // Use same URL for thumbnail
      tags: formData.tags,
      isPublic: true,
      userId: 'user-1', // This would be dynamic in a real app
      effects: formData.effects || [],
      rarity: CardRarity.COMMON, // Use enum value instead of string
      designMetadata: {
        cardStyle: {
          template: formData.template || 'classic',
          effect: formData.effect || 'none',
          borderRadius: formData.borderRadius || '10px',
          borderColor: formData.borderColor || '#000000',
          shadowColor: formData.shadowColor || 'rgba(0,0,0,0.5)',
          frameWidth: formData.frameWidth || 0,
          frameColor: formData.frameColor || '#000000'
        },
        textStyle: {
          titleColor: formData.titleColor || '#ffffff',
          titleAlignment: formData.titleAlignment || 'center',
          titleWeight: formData.titleWeight || 'bold',
          descriptionColor: formData.descriptionColor || '#ffffff'
        },
        cardMetadata: {
          category: formData.category || 'sports',
          series: formData.series || 'standard',
          cardType: formData.cardType || 'player'
        },
        marketMetadata: {
          isPrintable: formData.isPrintable || false,
          isForSale: formData.isForSale || false,
          includeInCatalog: formData.includeInCatalog || true
        },
        player: formData.player || '',
        team: formData.team || '',
        year: formData.year || ''
      }
    };
    
    onSubmit(cardData);
  };
  
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Card Title"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Card Description"
        />
      </div>
      
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
        />
      </div>
      
      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags"
        />
      </div>
      
      <div>
        <Label htmlFor="player">Player</Label>
        <Input
          type="text"
          id="player"
          name="player"
          value={formData.player}
          onChange={handleChange}
          placeholder="Player Name"
        />
      </div>
      
      <div>
        <Label htmlFor="team">Team</Label>
        <Input
          type="text"
          id="team"
          name="team"
          value={formData.team}
          onChange={handleChange}
          placeholder="Team Name"
        />
      </div>
      
      <div>
        <Label htmlFor="year">Year</Label>
        <Input
          type="text"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year"
        />
      </div>
      
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default CardEditorForm;
