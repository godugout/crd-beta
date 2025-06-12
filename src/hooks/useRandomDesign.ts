
import { useState, useCallback } from 'react';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import { GeneratedDesign } from '@/lib/services/randomDesignGenerator';

interface UseRandomDesignProps {
  onTemplateChange?: (template: OaklandTemplate) => void;
  onMemoryDataChange?: (data: any) => void;
  onEffectsChange?: (effects: string[]) => void;
}

export const useRandomDesign = ({
  onTemplateChange,
  onMemoryDataChange,
  onEffectsChange
}: UseRandomDesignProps = {}) => {
  const [currentDesign, setCurrentDesign] = useState<GeneratedDesign | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const applyRandomDesign = useCallback(async (design: GeneratedDesign) => {
    setIsApplying(true);
    
    try {
      // Apply the template
      if (onTemplateChange) {
        onTemplateChange(design.template);
      }

      // Apply color scheme and style changes
      if (onMemoryDataChange) {
        onMemoryDataChange((prevData: any) => ({
          ...prevData,
          // Update styling based on color scheme
          colorScheme: design.colorScheme,
          svgOverlays: design.svgOverlays,
          canvasEffects: design.canvasEffects,
          inspiration: design.metadata.inspiration
        }));
      }

      // Apply effects
      if (onEffectsChange) {
        onEffectsChange(design.effects);
      }

      setCurrentDesign(design);
      
      // Small delay to let the changes settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Error applying random design:', error);
      throw error;
    } finally {
      setIsApplying(false);
    }
  }, [onTemplateChange, onMemoryDataChange, onEffectsChange]);

  const clearDesign = useCallback(() => {
    setCurrentDesign(null);
  }, []);

  return {
    currentDesign,
    isApplying,
    applyRandomDesign,
    clearDesign
  };
};
