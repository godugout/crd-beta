
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { OaklandMemoryFormValues } from '../OaklandMemoryForm';

interface PersonalSignificanceFieldProps {
  form: UseFormReturn<OaklandMemoryFormValues>;
}

const PersonalSignificanceField: React.FC<PersonalSignificanceFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="personalSignificance"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Personal Significance</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="What made this memory special to you?" 
              className="h-20"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PersonalSignificanceField;
