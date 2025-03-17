
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SignatureControlsProps {
  inkAmount: number;
  setInkAmount: (value: number) => void;
  paperTexture: string;
  setPaperTexture: (value: string) => void;
  inkColor: string;
  setInkColor: (value: string) => void;
}

const SignatureControls: React.FC<SignatureControlsProps> = ({
  inkAmount,
  setInkAmount,
  paperTexture,
  setPaperTexture,
  inkColor,
  setInkColor
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium mb-4">Signature Settings</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="ink-amount">Ink Amount</Label>
            <span className="text-xs text-gray-500">{(inkAmount * 100).toFixed(0)}%</span>
          </div>
          <Slider
            id="ink-amount"
            min={0.2}
            max={1}
            step={0.05}
            value={[inkAmount]}
            onValueChange={values => setInkAmount(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Paper Texture</Label>
          <RadioGroup
            value={paperTexture}
            onValueChange={setPaperTexture}
            className="flex space-x-2"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="fine" id="fine" />
              <Label htmlFor="fine" className="text-xs cursor-pointer">Fine</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="text-xs cursor-pointer">Medium</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="rough" id="rough" />
              <Label htmlFor="rough" className="text-xs cursor-pointer">Rough</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ink-color">Ink Color</Label>
          <div className="flex space-x-2">
            <input
              type="color"
              id="ink-color"
              value={inkColor}
              onChange={e => setInkColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <div className="flex-1 flex space-x-2">
              {['#000000', '#000080', '#800000', '#0000FF', '#008000'].map(color => (
                <button
                  key={color}
                  onClick={() => setInkColor(color)}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureControls;
