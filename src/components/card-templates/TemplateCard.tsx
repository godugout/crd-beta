
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { CardTemplate } from './TemplateTypes';

interface TemplateCardProps {
  template: CardTemplate;
  isSelected?: boolean;
  onSelect: (template: CardTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected = false,
  onSelect,
}) => {
  return (
    <Card className={`
      overflow-hidden cursor-pointer transition-shadow hover:shadow-md
      ${isSelected ? 'ring-2 ring-primary' : ''}
    `}>
      <div 
        className="relative aspect-[2.5/3.5] bg-muted"
        onClick={() => onSelect(template)}
      >
        <img 
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-full object-cover"
        />
        
        {template.isOfficial && (
          <Badge className="absolute top-2 right-2 bg-blue-500">
            Official
          </Badge>
        )}
        
        {isSelected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="bg-primary rounded-full p-2">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-base">{template.name}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {template.description}
        </p>
        
        <Button 
          variant={isSelected ? "default" : "outline"} 
          size="sm"
          className="w-full"
          onClick={() => onSelect(template)}
        >
          {isSelected ? 'Selected' : 'Use Template'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
