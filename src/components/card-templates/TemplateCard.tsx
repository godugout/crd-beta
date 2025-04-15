
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { CardTemplate } from './TemplateLibrary';
import { cn } from '@/lib/utils';
import EffectsEngine from '../card-effects/EffectsEngine';

interface TemplateCardProps {
  template: CardTemplate;
  isSelected: boolean;
  onSelect: () => void;
  previewImage?: string | null;
  className?: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  previewImage,
  className = ''
}) => {
  // Determine which effects to apply based on template type
  const getTemplateEffects = (): string[] => {
    const effects: string[] = [];
    
    if (template.name.includes('Chrome') || template.name.includes('Optic')) {
      effects.push('Chrome');
    }
    
    if (template.name.includes('Prizm')) {
      effects.push('Refractor');
    }
    
    if (template.name.includes('Black Diamond')) {
      effects.push('Cracked Ice');
    }
    
    if (template.name.includes('Finest')) {
      effects.push('Superfractor');
    }
    
    if (template.name.includes('Gold')) {
      effects.push('Gold Foil');
    }
    
    if (template.name.includes('Vintage')) {
      effects.push('Vintage');
    }
    
    return effects;
  };
  
  const cardEffects = getTemplateEffects();
  const hasPreviewImage = !!previewImage;
  
  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer transition-all hover:shadow-md relative",
        isSelected ? "ring-2 ring-primary shadow-md" : "",
        className
      )}
      onClick={onSelect}
    >
      <CardContent className="p-0 aspect-[2.5/3.5] relative">
        {/* Template preview image */}
        <div className="w-full h-full relative overflow-hidden">
          {hasPreviewImage ? (
            <div className="absolute inset-0 bg-contain bg-center bg-no-repeat" style={{
              backgroundImage: `url(${previewImage})`,
              opacity: 0.6
            }} />
          ) : null}
          
          <img 
            src={template.previewUrl} 
            alt={template.name}
            className={cn(
              "w-full h-full object-cover transition-transform",
              isSelected ? "scale-105" : "",
              hasPreviewImage ? "mix-blend-overlay" : ""
            )}
          />
          
          {cardEffects.length > 0 && (
            <EffectsEngine 
              effects={cardEffects}
              intensity={0.7}
              isInteractive={true}
              disableAnimations={false}
            />
          )}
          
          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
              <CheckCircle className="h-4 w-4" />
            </div>
          )}
        </div>
        
        {/* Template info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm">{template.name}</h3>
            {template.style === "premium" && (
              <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">Premium</Badge>
            )}
          </div>
          <p className="text-xs opacity-90">{template.sport || "All Sports"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
