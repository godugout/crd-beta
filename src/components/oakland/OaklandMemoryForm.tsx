
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import BasicMemoryFields from './form-fields/BasicMemoryFields';
import DatePickerField from './form-fields/DatePickerField';
import MemoryTypeField from './form-fields/MemoryTypeField';
import GameDetailsFields from './form-fields/GameDetailsFields';
import LocationFields from './form-fields/LocationFields';
import AttendeeField from './form-fields/AttendeeField';
import TagField from './form-fields/TagField';
import HistoricalContextField from './form-fields/HistoricalContextField';
import PersonalSignificanceField from './form-fields/PersonalSignificanceField';
import { format } from 'date-fns';
import { OaklandMemoryData as OaklandMemoryDataType } from '@/lib/types';

// Form schema for Oakland memories
const formSchema = z.object({
  title: z.string().min(2, { message: 'Please enter a title' }).max(100),
  description: z.string().min(10, { message: 'Please enter a description' }).max(1000),
  date: z.string().optional(),
  memoryType: z.string().optional(),
  opponent: z.string().optional(),
  score: z.string().optional(),
  location: z.string().optional(),
  section: z.string().optional(),
  attendees: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  historicalContext: z.string().optional(),
  personalSignificance: z.string().optional(),
});

export type OaklandMemoryFormValues = z.infer<typeof formSchema>;

// Component props
interface OaklandMemoryFormProps {
  onSubmit: (data: OaklandMemoryDataType) => void;
  initialData?: Partial<OaklandMemoryDataType>;
}

// Memory form component
const OaklandMemoryForm: React.FC<OaklandMemoryFormProps> = ({ onSubmit, initialData }) => {
  // Initialize form
  const form = useForm<OaklandMemoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
      memoryType: initialData?.memoryType || 'game',
      opponent: initialData?.opponent || '',
      score: initialData?.score || '',
      location: initialData?.location || '',
      section: initialData?.section || '',
      attendees: initialData?.attendees || [],
      tags: initialData?.tags || [],
      imageUrl: initialData?.imageUrl || '',
      historicalContext: initialData?.historicalContext || '',
      personalSignificance: initialData?.personalSignificance || '',
    },
  });

  // Handle form submission
  const handleFormSubmit = (data: OaklandMemoryFormValues) => {
    onSubmit(data as OaklandMemoryDataType);
  };

  const selectedMemoryType = form.watch('memoryType');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Fields: Title and Description */}
        <BasicMemoryFields form={form} />

        {/* Date Picker */}
        <DatePickerField form={form} />

        {/* Memory Type */}
        <MemoryTypeField form={form} />

        {/* Game Specific Fields */}
        {(selectedMemoryType === 'game' || !selectedMemoryType) && (
          <GameDetailsFields form={form} />
        )}

        {/* Location Fields */}
        <LocationFields form={form} />

        {/* Historical Context */}
        <HistoricalContextField form={form} />

        {/* Personal Significance */}
        <PersonalSignificanceField form={form} />

        {/* Attendees */}
        <AttendeeField 
          attendees={form.watch('attendees')} 
          onAttendeeChange={(attendees) => form.setValue('attendees', attendees)}
        />

        {/* Tags */}
        <TagField 
          tags={form.watch('tags')} 
          onTagsChange={(tags) => form.setValue('tags', tags)}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-[#006341] hover:bg-[#003831]">
          Save Memory Details
        </Button>
      </form>
    </Form>
  );
};

export { OaklandMemoryForm };
