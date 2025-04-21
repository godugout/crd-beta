
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/lib/types';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const cardFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  tags: z.string().optional(),
  imageUrl: z.string().url({
    message: 'Please enter a valid URL.',
  }).optional(),
});

type CardFormData = z.infer<typeof cardFormSchema>;

interface CardEditorFormProps {
  card?: Card;
  onSubmit?: (data: CardFormData) => void;
}

const CardEditorForm: React.FC<CardEditorFormProps> = ({ card, onSubmit }) => {
  const { addCard, updateCard } = useCards();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CardFormData>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      title: card?.title || '',
      description: card?.description || '',
      tags: card?.tags?.join(', ') || '',
      imageUrl: card?.imageUrl || '',
    },
  });
  
  const handleSubmit = async (data: CardFormData) => {
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        onSubmit(data);
        return;
      }
      
      const currentDate = new Date().toISOString();
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
      
      const cardData: Partial<Card> = {
        title: data.title,
        description: data.description,
        tags: tags,
        imageUrl: data.imageUrl || '',
        thumbnailUrl: data.imageUrl || '',
        userId: 'current-user',
        effects: [],
        createdAt: card?.createdAt || currentDate,
        updatedAt: currentDate,
        designMetadata: card?.designMetadata || {
          cardStyle: {
            template: 'classic',
            effect: 'classic',
            borderRadius: '8px',
            borderColor: '#000000',
            frameColor: '#000000',
            frameWidth: 2,
            shadowColor: 'rgba(0,0,0,0.2)',
          },
          textStyle: {
            titleColor: '#FFFFFF',
            titleAlignment: 'left',
            titleWeight: 'bold',
            descriptionColor: '#FFFFFF',
          },
          marketMetadata: {
            isPrintable: false,
            isForSale: false,
            includeInCatalog: true
          },
          cardMetadata: {
            category: 'sports',
            cardType: 'collectible',
            series: 'standard'
          }
        }
      };
      
      if (card) {
        await updateCard({
          ...cardData,
          id: card.id
        });
        toast.success('Card updated successfully');
      } else {
        await addCard(cardData);
        toast.success('Card created successfully');
      }
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter card title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter card description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="Enter comma-separated tags" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter image URL" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
};

export default CardEditorForm;
