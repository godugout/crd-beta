
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Users, ImageIcon, CameraIcon } from 'lucide-react';
import { GroupUploadType } from '../hooks/useUploadHandling';

interface UploadTypeSelectorProps {
  uploadType: GroupUploadType;
  onUploadTypeChange: (value: GroupUploadType) => void;
}

const UploadTypeSelector: React.FC<UploadTypeSelectorProps> = ({ 
  uploadType, 
  onUploadTypeChange 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">What type of photos are you uploading?</h3>
      <RadioGroup 
        defaultValue="group" 
        value={uploadType}
        onValueChange={(value) => onUploadTypeChange(value as GroupUploadType)}
        className="flex flex-col space-y-3"
      >
        <div className="flex items-center space-x-3 p-3 rounded-md border hover:bg-gray-50">
          <RadioGroupItem value="group" id="group" />
          <Label htmlFor="group" className="flex items-center cursor-pointer">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            Group Photos
            <span className="ml-2 text-sm text-gray-500">(Face detection enabled)</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-3 rounded-md border hover:bg-gray-50">
          <RadioGroupItem value="memorabilia" id="memorabilia" />
          <Label htmlFor="memorabilia" className="flex items-center cursor-pointer">
            <ImageIcon className="h-5 w-5 mr-2 text-blue-600" />
            Memorabilia
            <span className="ml-2 text-sm text-gray-500">(Cards, tickets, programs)</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-3 rounded-md border hover:bg-gray-50">
          <RadioGroupItem value="mixed" id="mixed" />
          <Label htmlFor="mixed" className="flex items-center cursor-pointer">
            <CameraIcon className="h-5 w-5 mr-2 text-purple-600" />
            Mixed Content
            <span className="ml-2 text-sm text-gray-500">(All detection types enabled)</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UploadTypeSelector;
