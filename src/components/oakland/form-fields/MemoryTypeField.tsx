
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { OaklandMemoryFormValues } from '../OaklandMemoryForm';

// Memory type options
const memoryTypes = [
  { value: 'game', label: 'Game Day' },
  { value: 'tailgate', label: 'Tailgate Party' },
  { value: 'memorabilia', label: 'Memorabilia' },
  { value: 'historical', label: 'Historical Moment' },
  { value: 'fan_experience', label: 'Fan Experience' },
  { value: 'stats', label: 'Stats & Analysis' },
];

interface MemoryTypeFieldProps {
  form: UseFormReturn<OaklandMemoryFormValues>;
}

const MemoryTypeField: React.FC<MemoryTypeFieldProps> = ({ form }) => {
  return (
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
  );
};

export default MemoryTypeField;
