import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { OaklandMemoryData } from '@/lib/types';
import ImageUploader from '@/components/dam/ImageUploader';
import { UserProfile } from '@/lib/types/profiles';

// Import form field components
import BasicMemoryFields from './form-fields/BasicMemoryFields';
import DatePickerField from './form-fields/DatePickerField';
import LocationFields from './form-fields/LocationFields';
import GameDetailsFields from './form-fields/GameDetailsFields';
import MemoryTypeField from './form-fields/MemoryTypeField';
import TagField from './form-fields/TagField';
import AttendeeField from './form-fields/AttendeeField';
import HistoricalContextField from './form-fields/HistoricalContextField';
import PersonalSignificanceField from './form-fields/PersonalSignificanceField';

export interface OaklandMemoryFormValues extends OaklandMemoryData {}

interface OaklandMemoryFormProps {
  initialData?: Partial<OaklandMemoryData>;
  onSubmit: (data: OaklandMemoryData) => void;
  onCancel?: () => void;
  currentUser?: UserProfile;
}

export const OaklandMemoryForm: React.FC<OaklandMemoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  currentUser
}) => {
  const form = useForm<OaklandMemoryData>({
    defaultValues: initialData || {
      title: '',
      description: '',
      tags: []
    }
  });
  
  const { handleSubmit, setValue, watch } = form;
  const watchTags = watch('tags') || [];
  const watchAttendees = watch('attendees') || [];
  
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
  
  const handleAddAttendee = (attendee: string) => {
    if (attendee.trim() && !watchAttendees.includes(attendee.trim())) {
      setValue('attendees', [...watchAttendees, attendee.trim()]);
      return true;
    }
    return false;
  };
  
  const handleRemoveAttendee = (attendeeToRemove: string) => {
    setValue('attendees', watchAttendees.filter(attendee => attendee !== attendeeToRemove));
  };
  
  const handleImageUploadComplete = (imageUrl: string) => {
    setValue('imageUrl', imageUrl);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Left column */}
            <BasicMemoryFields form={form} />
            <DatePickerField form={form} />
            <LocationFields form={form} />
            <GameDetailsFields form={form} />
            <MemoryTypeField form={form} />
          </div>
          
          <div className="space-y-4">
            {/* Right column */}
            <TagField 
              tags={watchTags} 
              onTagsChange={(tags) => setValue('tags', tags)} 
            />
            
            <AttendeeField 
              attendees={watchAttendees} 
              onAttendeeChange={(attendees) => setValue('attendees', attendees)} 
            />
            
            <HistoricalContextField form={form} />
            <PersonalSignificanceField form={form} />
            
            <div>
              <label className="block mb-2 font-medium">Memory Image</label>
              <ImageUploader
                onUploadComplete={handleImageUploadComplete}
                title="Upload Your Memory Image"
                maxSizeMB={5}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" className="bg-[#006341] hover:bg-[#003831]">
            Save Memory Details
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
