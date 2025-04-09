
import React from 'react';
import { Check } from 'lucide-react';

interface CardTypeSelectorProps {
  types: string[];
  selected: string;
  onSelect: (type: string) => void;
}

const TypeOption = ({ type, selected, onSelect }: { type: string; selected: boolean; onSelect: () => void }) => {
  let label = '';
  let description = '';
  
  switch (type) {
    case 'card':
      label = 'Baseball Card';
      description = 'Standard trading card';
      break;
    case 'ticket':
      label = 'Ticket';
      description = 'Game/event ticket or stub';
      break;
    case 'program':
      label = 'Program';
      description = 'Game program or scorecard';
      break;
    case 'autograph':
      label = 'Autographed';
      description = 'Item with signature';
      break;
    default:
      label = type.charAt(0).toUpperCase() + type.slice(1);
      description = 'Generic item';
  }
  
  return (
    <div 
      className={`p-2 rounded-lg cursor-pointer border ${selected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-sm">{label}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
        {selected && <Check className="h-4 w-4 text-primary" />}
      </div>
    </div>
  );
};

const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({ types, selected, onSelect }) => {
  return (
    <div className="space-y-2">
      {types.map(type => (
        <TypeOption
          key={type}
          type={type}
          selected={selected === type}
          onSelect={() => onSelect(type)}
        />
      ))}
    </div>
  );
};

export default CardTypeSelector;
