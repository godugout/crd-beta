
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { CardTemplate } from '@/components/card-templates/TemplateTypes';

interface TemplateCardProps {
  template: CardTemplate;
  isSelected?: boolean;
  onSelect: (template: CardTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template,
  isSelected = false,
  onSelect
}) => {
  const handleSelect = () => {
    onSelect(template);
  };
  
  return (
    <Card className={`overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="relative aspect-[2.5/3.5] w-full bg-muted">
        <img 
          src={template.thumbnail || '/placeholder-card.png'} 
          alt={template.name}
          className="w-full h-full object-cover"
        />
        
        {template.isOfficial && (
          <Badge className="absolute top-2 right-2">Official</Badge>
        )}
        
        {isSelected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-base">{template.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">{template.description}</p>
        
        <Button 
          onClick={handleSelect}
          variant={isSelected ? "default" : "outline"}
          className="w-full"
        >
          {isSelected ? 'Selected' : 'Use Template'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
