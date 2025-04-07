
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, PlusCircle, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OaklandMemoryData } from '@/lib/types';

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
});

export type OaklandMemoryFormValues = z.infer<typeof formSchema>;

// Memory type options
const memoryTypes = [
  { value: 'game', label: 'Game Day' },
  { value: 'tailgate', label: 'Tailgate Party' },
  { value: 'memorabilia', label: 'Memorabilia' },
  { value: 'historical', label: 'Historical Moment' },
  { value: 'fan_experience', label: 'Fan Experience' },
  { value: 'stats', label: 'Stats & Analysis' },
];

// Component props
interface OaklandMemoryFormProps {
  onSubmit: (data: OaklandMemoryData) => void;
  initialData?: Partial<OaklandMemoryData>;
}

// Memory form component
const OaklandMemoryForm: React.FC<OaklandMemoryFormProps> = ({ onSubmit, initialData }) => {
  const [newAttendee, setNewAttendee] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');

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
    },
  });

  // Handle form submission
  const handleFormSubmit = (data: OaklandMemoryFormValues) => {
    onSubmit(data as OaklandMemoryData);
  };

  // Add attendee to list
  const handleAddAttendee = () => {
    if (newAttendee.trim() === '') return;
    
    const currentAttendees = form.getValues().attendees || [];
    form.setValue('attendees', [...currentAttendees, newAttendee]);
    setNewAttendee('');
  };

  // Remove attendee from list
  const handleRemoveAttendee = (index: number) => {
    const currentAttendees = form.getValues().attendees || [];
    form.setValue('attendees', currentAttendees.filter((_, i) => i !== index));
  };

  // Add tag to list
  const handleAddTag = () => {
    if (newTag.trim() === '') return;
    
    const currentTags = form.getValues().tags || [];
    form.setValue('tags', [...currentTags, newTag.toLowerCase()]);
    setNewTag('');
  };

  // Remove tag from list
  const handleRemoveTag = (index: number) => {
    const currentTags = form.getValues().tags || [];
    form.setValue('tags', currentTags.filter((_, i) => i !== index));
  };

  const selectedMemoryType = form.watch('memoryType');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memory Title</FormLabel>
              <FormControl>
                <Input placeholder="What would you call this memory?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about this memory..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Picker */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Memory Type */}
        <FormField
          control={form.control}
          name="memoryType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memory Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select memory type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {memoryTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Game Specific Fields */}
        {(selectedMemoryType === 'game' || !selectedMemoryType) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="opponent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opponent</FormLabel>
                  <FormControl>
                    <Input placeholder="Which team?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Final Score</FormLabel>
                  <FormControl>
                    <Input placeholder="A's 5 - Angels 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Oakland Coliseum" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section/Area</FormLabel>
                <FormControl>
                  <Input placeholder="Section 112 / Bleachers / Parking Lot" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Attendees */}
        <div>
          <FormLabel className="block mb-2">Attendees</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input 
              value={newAttendee}
              onChange={e => setNewAttendee(e.target.value)}
              placeholder="Friend or family name"
              className="flex-grow"
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAttendee();
                }
              }}
            />
            <Button type="button" onClick={handleAddAttendee} size="sm">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {form.watch('attendees')?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch('attendees').map((attendee, index) => (
                <div 
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm"
                >
                  <span>{attendee}</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveAttendee(index)}
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <FormMessage name={`attendees`} />
        </div>

        {/* Tags */}
        <div>
          <FormLabel className="block mb-2">Tags</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input 
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Add tags (e.g. no-hitter, walkoff)"
              className="flex-grow"
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag} size="sm">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {form.watch('tags')?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch('tags').map((tag, index) => (
                <div 
                  key={index}
                  className="bg-[#003831] text-[#EFB21E] px-3 py-1 rounded-full flex items-center text-sm"
                >
                  <span>#{tag}</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 text-[#EFB21E]/70 hover:text-[#EFB21E]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <FormMessage name={`tags`} />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-[#006341] hover:bg-[#003831]">
          Save Memory Details
        </Button>
      </form>
    </Form>
  );
};

export { OaklandMemoryForm };
export type { OaklandMemoryData };
