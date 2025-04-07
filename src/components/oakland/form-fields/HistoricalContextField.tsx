
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { OaklandMemoryFormValues } from '../OaklandMemoryForm';

interface HistoricalContextFieldProps {
  form: UseFormReturn<OaklandMemoryFormValues>;
}

const HistoricalContextField: React.FC<HistoricalContextFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="historicalContext"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Historical Context</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Add any historical context or significance about this moment in Oakland A's history..." 
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

export default HistoricalContextField;
