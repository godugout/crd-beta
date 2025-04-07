
import React, { useState } from 'react';
import { FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';

interface AttendeeFieldProps {
  attendees: string[];
  onAttendeeChange: (attendees: string[]) => void;
}

const AttendeeField: React.FC<AttendeeFieldProps> = ({ attendees, onAttendeeChange }) => {
  const [newAttendee, setNewAttendee] = useState<string>('');

  // Add attendee to list
  const handleAddAttendee = () => {
    if (newAttendee.trim() === '') return;
    
    onAttendeeChange([...attendees, newAttendee]);
    setNewAttendee('');
  };

  // Remove attendee from list
  const handleRemoveAttendee = (index: number) => {
    onAttendeeChange(attendees.filter((_, i) => i !== index));
  };

  return (
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
      
      {attendees?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {attendees.map((attendee, index) => (
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
      <FormMessage />
    </div>
  );
};

export default AttendeeField;
