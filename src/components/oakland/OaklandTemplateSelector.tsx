
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { OaklandTemplateType, oaklandTemplates } from './OaklandCardTemplates';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OaklandTemplateSelectorProps {
  selectedTemplate: OaklandTemplateType;
  onChange: (template: OaklandTemplateType) => void;
  className?: string;
}

const OaklandTemplateSelector: React.FC<OaklandTemplateSelectorProps> = ({
  selectedTemplate,
  onChange,
  className
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-medium text-gray-900">Select Memory Template</h3>
      <RadioGroup 
        value={selectedTemplate}
        onValueChange={(value) => onChange(value as OaklandTemplateType)}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
      >
        {(Object.keys(oaklandTemplates) as OaklandTemplateType[]).map((templateKey) => {
          const template = oaklandTemplates[templateKey];
          
          return (
            <div key={templateKey} className="relative">
              <RadioGroupItem
                value={templateKey}
                id={`template-${templateKey}`}
                className="sr-only"
              />
              <Label
                htmlFor={`template-${templateKey}`}
                className="cursor-pointer"
              >
                <Card className={cn(
                  "overflow-hidden border-2 transition-all",
                  selectedTemplate === templateKey ? "ring-2 ring-[#EFB21E] border-[#EFB21E]" : "hover:border-[#006341]"
                )}>
                  <div className={cn(
                    "aspect-[2.5/3.5] p-2 flex flex-col items-center justify-center text-center",
                    templateKey === 'classic' && "bg-gradient-to-br from-[#003831] to-[#006341]",
                    templateKey === 'moneyball' && "bg-gradient-to-r from-[#003831] via-[#004C35] to-[#003831]",
                    templateKey === 'dynasty' && "bg-gradient-to-b from-[#003831] to-[#006341]",
                    templateKey === 'coliseum' && "bg-[#003831]",
                    templateKey === 'tailgate' && "bg-[#004C35]",
                  )}>
                    <div className="text-[#EFB21E] mb-2">
                      {template.icon}
                    </div>
                    <div className="text-xs font-medium text-white">{template.name}</div>
                    <div className="text-[10px] text-white/70 mt-1">{template.years}</div>
                  </div>
                </Card>
                <div className="mt-1 text-xs text-center text-gray-600">
                  {template.name}
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default OaklandTemplateSelector;
