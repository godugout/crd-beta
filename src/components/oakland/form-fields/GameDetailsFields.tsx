
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { OaklandMemoryFormValues } from '../OaklandMemoryForm';

interface GameDetailsFieldsProps {
  form: UseFormReturn<OaklandMemoryFormValues>;
}

const GameDetailsFields: React.FC<GameDetailsFieldsProps> = ({ form }) => {
  return (
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
  );
};

export default GameDetailsFields;
