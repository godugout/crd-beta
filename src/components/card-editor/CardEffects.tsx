
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface CardEffectsProps {
  selectedEffects: string[];
  onEffectsChange: (effects: string[]) => void;
  imageUrl: string;
}

const AVAILABLE_EFFECTS = [
  { id: 'shadow', label: 'Drop Shadow', description: 'Add depth with a subtle shadow' },
  { id: 'glow', label: 'Glow Border', description: 'Add a glowing border effect' },
  { id: 'shine', label: 'Shine Effect', description: 'Add a dynamic shine animation' },
  { id: 'texture', label: 'Card Texture', description: 'Add a subtle texture overlay' },
  { id: 'signature', label: 'Signature Overlay', description: 'Add a signature effect' }
];

const CardEffects: React.FC<CardEffectsProps> = ({
  selectedEffects,
  onEffectsChange,
  imageUrl
}) => {
  const toggleEffect = (effectId: string) => {
    if (selectedEffects.includes(effectId)) {
      onEffectsChange(selectedEffects.filter(id => id !== effectId));
    } else {
      onEffectsChange([...selectedEffects, effectId]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Special Effects</h3>
        <p className="text-gray-500 text-sm">
          Enhance your CRD with special effects to make it stand out
        </p>
        
        <div className="space-y-3 mt-4">
          {AVAILABLE_EFFECTS.map((effect) => (
            <div key={effect.id} className="flex items-start space-x-2">
              <Checkbox 
                id={`effect-${effect.id}`}
                checked={selectedEffects.includes(effect.id)}
                onCheckedChange={() => toggleEffect(effect.id)}
              />
              <div>
                <Label htmlFor={`effect-${effect.id}`} className="font-medium cursor-pointer">
                  {effect.label}
                </Label>
                <p className="text-sm text-gray-500">{effect.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="text-base font-semibold block mb-4">Preview</Label>
        {imageUrl ? (
          <div className={`aspect-[2.5/3.5] max-w-xs mx-auto border-2 border-litmus-green overflow-hidden rounded-lg 
            ${selectedEffects.includes('shadow') ? 'shadow-lg' : ''}
            ${selectedEffects.includes('glow') ? 'shadow-glow' : ''}
          `}>
            <img
              src={imageUrl}
              alt="Card preview"
              className={`w-full h-full object-cover
                ${selectedEffects.includes('texture') ? 'after:content-[""] after:absolute after:inset-0 after:bg-texture-overlay' : ''}
                ${selectedEffects.includes('shine') ? 'shimmer-effect' : ''}
              `}
            />
          </div>
        ) : (
          <div className="aspect-[2.5/3.5] max-w-xs mx-auto border border-dashed rounded-lg flex items-center justify-center bg-gray-50">
            <p className="text-gray-400">Upload an image to preview effects</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardEffects;
