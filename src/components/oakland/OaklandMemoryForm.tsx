
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OaklandMemoryData } from '@/lib/types';
import ImageUploader from '@/components/dam/ImageUploader';

interface OaklandMemoryFormProps {
  initialData?: OaklandMemoryData;
  onSubmit: (data: OaklandMemoryData) => void;
}

export const OaklandMemoryForm: React.FC<OaklandMemoryFormProps> = ({
  initialData,
  onSubmit
}) => {
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<OaklandMemoryData>({
    defaultValues: initialData || {
      title: '',
      description: '',
      tags: []
    }
  });
  
  const watchTags = watch('tags') || [];
  
  const handleAddTag = (tag: string) => {
    if (tag.trim() && !watchTags.includes(tag.trim())) {
      setValue('tags', [...watchTags, tag.trim()]);
      return true;
    }
    return false;
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', watchTags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      if (handleAddTag(input.value)) {
        input.value = '';
      }
    }
  };
  
  const handleImageUploadComplete = (imageUrl: string) => {
    setValue('imageUrl', imageUrl);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Memory Title</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. First A's Game"
              className="mt-1"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="e.g. Oakland Coliseum"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="opponent">Opponent (if applicable)</Label>
            <Input
              id="opponent"
              {...register('opponent')}
              placeholder="e.g. Los Angeles Angels"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="score">Score (if applicable)</Label>
            <Input
              id="score"
              {...register('score')}
              placeholder="e.g. A's 5, Angels 3"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="section">Section/Seats (if applicable)</Label>
            <Input
              id="section"
              {...register('section')}
              placeholder="e.g. Section 120, Row 5"
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              rows={4}
              placeholder="Share your memory..."
              className="mt-1"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="memoryType">Type of Memory</Label>
            <Input
              id="memoryType"
              {...register('memoryType')}
              placeholder="e.g. Game, Event, Memorabilia"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center gap-2">
              <Input
                id="tagInput"
                placeholder="Add a tag..."
                onKeyDown={handleTagKeyDown}
                className="mt-1"
              />
              <Button 
                type="button"
                onClick={(e) => {
                  const input = document.getElementById('tagInput') as HTMLInputElement;
                  if (handleAddTag(input.value)) {
                    input.value = '';
                  }
                }}
              >
                Add
              </Button>
            </div>
            {watchTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {watchTags.map((tag, index) => (
                  <div key={index} className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <Label>Memory Image</Label>
            <div className="mt-1">
              <ImageUploader
                onUploadComplete={handleImageUploadComplete}
                title="Upload Your Memory Image"
                maxSizeMB={5}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" className="bg-[#006341] hover:bg-[#003831]">
          Save Memory Details
        </Button>
      </div>
    </form>
  );
};
