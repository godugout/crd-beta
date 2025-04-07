
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MemorabiliaTypeControlProps } from './types';
import { MemorabiliaType } from '../card-upload/cardDetection';

const MemorabiliaTypeControl: React.FC<MemorabiliaTypeControlProps> = ({
  selectedType,
  onChange,
  enabledTypes = ['card', 'ticket', 'program', 'autograph', 'face', 'unknown'],
  disabled = false
}) => {
  return (
    <div className="w-full">
      <Select 
        value={selectedType} 
        onValueChange={(value) => onChange(value as MemorabiliaType)} 
        disabled={disabled}
      >
        <SelectTrigger className="w-full capitalize">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {enabledTypes.map((type) => (
            <SelectItem key={type} value={type} className="capitalize">
              {type === 'unknown' ? 'Other' : type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MemorabiliaTypeControl;
