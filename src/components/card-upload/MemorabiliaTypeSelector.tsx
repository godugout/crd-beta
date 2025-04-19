
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Ticket,
  FileText,
  User,
  PenTool,
  CreditCard,
  HelpCircle,
  Users
} from 'lucide-react';
import { MemorabiliaType } from './cardDetection';

interface MemorabiliaTypeSelectorProps {
  value: MemorabiliaType;
  onChange: (value: MemorabiliaType) => void;
  className?: string;
  enabledTypes?: MemorabiliaType[];
}

const MemorabiliaTypeSelector: React.FC<MemorabiliaTypeSelectorProps> = ({
  value,
  onChange,
  className,
  enabledTypes = ['card', 'ticket', 'program', 'autograph', 'face', 'group', 'unknown']
}) => {
  
  // Array of all available memorabilia types
  const memorabiliaTypes: {
    value: MemorabiliaType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: 'card',
      label: 'Baseball Card',
      icon: <CreditCard className="h-4 w-4 mr-2" />
    },
    {
      value: 'ticket',
      label: 'Ticket Stub',
      icon: <Ticket className="h-4 w-4 mr-2" />
    },
    {
      value: 'program',
      label: 'Program/Scorecard',
      icon: <FileText className="h-4 w-4 mr-2" />
    },
    {
      value: 'autograph',
      label: 'Autographed Item',
      icon: <PenTool className="h-4 w-4 mr-2" />
    },
    {
      value: 'face',
      label: 'Person',
      icon: <User className="h-4 w-4 mr-2" />
    },
    {
      value: 'group',
      label: 'Group Photo',
      icon: <Users className="h-4 w-4 mr-2" />
    },
    {
      value: 'unknown',
      label: 'Unknown Item',
      icon: <HelpCircle className="h-4 w-4 mr-2" />
    }
  ];

  // Filter types by enabled list
  const filteredTypes = memorabiliaTypes.filter(type => 
    enabledTypes.includes(type.value)
  );

  const handleChange = (newValue: string) => {
    onChange(newValue as MemorabiliaType);
  };

  return (
    <Select
      value={value}
      onValueChange={handleChange}
    >
      <SelectTrigger className={`${className || ''}`}>
        <SelectValue placeholder="Select memorabilia type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {filteredTypes.map((type) => (
            <SelectItem 
              key={type.value} 
              value={type.value}
              className="flex items-center"
            >
              <div className="flex items-center">
                {type.icon}
                <span>{type.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default MemorabiliaTypeSelector;
