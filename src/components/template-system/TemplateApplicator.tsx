
import React from 'react';
import { Template } from '@/lib/types/templateTypes';
import { CardLayer } from '@/lib/types/cardTypes';

interface TemplateApplicatorProps {
  template: Template;
  existingLayers?: CardLayer[];
  userImage?: string | null;
  onApplyTemplate: (layers: CardLayer[], effects: string[]) => void;
}

export const TemplateApplicator: React.FC<TemplateApplicatorProps> = ({
  template,
  existingLayers = [],
  userImage,
  onApplyTemplate
}) => {
  React.useEffect(() => {
    const applyTemplate = () => {
      const newLayers: CardLayer[] = template.layers.map((templateLayer, index) => {
        // Map template layer types to card layer types
        const mapLayerType = (type: string): 'image' | 'text' | 'shape' | 'effect' => {
          switch (type) {
            case 'border':
              return 'shape';
            case 'image':
            case 'text':
            case 'shape':
            case 'effect':
              return type as 'image' | 'text' | 'shape' | 'effect';
            default:
              return 'shape';
          }
        };

        const baseLayer: CardLayer = {
          id: `layer-${Date.now()}-${index}`,
          type: mapLayerType(templateLayer.type),
          content: templateLayer.placeholder?.text || '',
          position: {
            x: templateLayer.defaultPosition.x,
            y: templateLayer.defaultPosition.y,
            z: index
          },
          size: templateLayer.defaultSize,
          rotation: 0,
          opacity: 1,
          zIndex: index,
          visible: true,
          locked: false,
          textStyle: templateLayer.style ? {
            fontSize: templateLayer.style.fontSize,
            fontFamily: templateLayer.style.fontFamily,
            color: templateLayer.style.color,
            textAlign: 'left'
          } : undefined,
          color: templateLayer.style?.backgroundColor,
          style: templateLayer.style
        };

        // Smart content mapping
        if (templateLayer.type === 'image' && userImage && 
            (templateLayer.name.toLowerCase().includes('player') || 
             templateLayer.name.toLowerCase().includes('photo') ||
             templateLayer.name.toLowerCase().includes('action'))) {
          baseLayer.content = userImage;
          baseLayer.imageUrl = userImage;
        }

        // Map existing content if applicable
        if (existingLayers.length > 0) {
          const matchingLayer = existingLayers.find(layer => 
            layer.type === baseLayer.type && 
            layer.content && 
            layer.content !== ''
          );
          
          if (matchingLayer && templateLayer.type === 'text') {
            baseLayer.content = matchingLayer.content;
          }
        }

        return baseLayer;
      });

      onApplyTemplate(newLayers, template.effects);
    };

    applyTemplate();
  }, [template, existingLayers, userImage, onApplyTemplate]);

  return null; // This is a utility component with no UI
};

export default TemplateApplicator;
