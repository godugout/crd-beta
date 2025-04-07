import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Add imageUrl to OaklandMemoryData type
export interface OaklandMemoryData {
  title: string;
  description: string;
  date: Date | null;
  memoryType: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  attendees?: string[];
  tags?: string[];
  imageUrl?: string; // Add this field
}

interface OaklandMemoryFormProps {
  onSubmit: (data: OaklandMemoryData) => void;
  initialData?: Partial<OaklandMemoryData>;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.date().nullable(),
  memoryType: z.enum(['game', 'tailgate', 'memorabilia', 'other']),
  opponent: z.string().optional(),
  score: z.string().optional(),
  location: z.string().optional(),
  section: z.string().optional(),
  attendees: z.string().transform(value => value.split(',').map(s => s.trim()).filter(s => s.length > 0)),
  tags: z.string().transform(value => value.split(',').map(s => s.trim()).filter(s => s.length > 0)),
});

const OaklandMemoryForm: React.FC<OaklandMemoryFormProps> = ({ onSubmit, initialData }) => {
  const form = useForm<OaklandMemoryData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData?.date || null,
      memoryType: initialData?.memoryType || "game",
      opponent: initialData?.opponent || "",
      score: initialData?.score || "",
      location: initialData?.location || "",
      section: initialData?.section || "",
      attendees: initialData?.attendees || [],
      tags: initialData?.tags || [],
    },
  });

  const { watch } = form;
  const memoryType = watch("memoryType");
  const [attendeeInputs, setAttendeeInputs] = useState(initialData?.attendees || ['']);
  const [tagInputs, setTagInputs] = useState(initialData?.tags || ['']);

  const handleAddAttendee = () => {
    setAttendeeInputs([...attendeeInputs, '']);
  };

  const handleRemoveAttendee = (index: number) => {
    const newInputs = [...attendeeInputs];
    newInputs.splice(index, 1);
    setAttendeeInputs(newInputs);
  };

  const handleAttendeeChange = (index: number, value: string) => {
    const newInputs = [...attendeeInputs];
    newInputs[index] = value;
    setAttendeeInputs(newInputs);
    form.setValue("attendees", newInputs);
  };

  const handleAddTag = () => {
    setTagInputs([...tagInputs, '']);
  };

  const handleRemoveTag = (index: number) => {
    const newInputs = [...tagInputs];
    newInputs.splice(index, 1);
    setTagInputs(newInputs);
  };

  const handleTagChange = (index: number, value: string) => {
    const newInputs = [...tagInputs];
    newInputs[index] = value;
    setTagInputs(newInputs);
    form.setValue("tags", newInputs);
  };

  const onSubmitHandler = (values: OaklandMemoryData) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="My favorite A's memory" {...field} />
              </FormControl>
              <FormMessage />
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
                <Textarea
                  placeholder="Share the details of your memory..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
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
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memoryType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memory Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="game">Game</SelectItem>
                  <SelectItem value="tailgate">Tailgate</SelectItem>
                  <SelectItem value="memorabilia">Memorabilia</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {memoryType === 'game' && (
          <>
            <FormField
              control={form.control}
              name="opponent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opponent</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New York Yankees" {...field} />
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
                  <FormLabel>Score</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A's 5, Yankees 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Oakland Coliseum" {...field} />
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
              <FormLabel>Section</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Section 102" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Attendees</FormLabel>
          {attendeeInputs.map((input, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <FormField
                control={form.control}
                name={`attendees[${index}]`}
                render={() => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Name"
                        value={input}
                        onChange={(e) => handleAttendeeChange(index, e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button variant="ghost" size="sm" onClick={() => handleRemoveAttendee(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={handleAddAttendee}>
            <Plus className="h-4 w-4 mr-2" />
            Add Attendee
          </Button>
        </div>

        <div>
          <FormLabel>Tags</FormLabel>
          {tagInputs.map((input, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <FormField
                control={form.control}
                name={`tags[${index}]`}
                render={() => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Tag"
                        value={input}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button variant="ghost" size="sm" onClick={() => handleRemoveTag(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default OaklandMemoryForm;
