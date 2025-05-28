
import { useState, useCallback } from 'react';
import { Template, AIRecommendation } from '@/lib/types/templateTypes';
import { CardLayer } from '@/lib/types/cardTypes';

interface UseTemplateSystemProps {
  onApplyTemplate?: (template: Template, layers: CardLayer[], effects: string[]) => void;
}

export const useTemplateSystem = ({ onApplyTemplate }: UseTemplateSystemProps = {}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const openTemplateSelector = useCallback(() => {
    setIsTemplateModalOpen(true);
  }, []);

  const closeTemplateSelector = useCallback(() => {
    setIsTemplateModalOpen(false);
  }, []);

  const handleTemplateSelect = useCallback((template: Template) => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(false);
    
    // Apply template immediately if callback provided
    if (onApplyTemplate) {
      const layers: CardLayer[] = template.layers.map((templateLayer, index) => ({
        id: `layer-${Date.now()}-${index}`,
        type: templateLayer.type,
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
      }));
      
      onApplyTemplate(template, layers, template.effects);
    }
  }, [onApplyTemplate]);

  const handleAIRecommendations = useCallback((recommendations: AIRecommendation[]) => {
    setAiRecommendations(recommendations);
    setIsAnalyzing(false);
  }, []);

  const startAIAnalysis = useCallback(() => {
    setIsAnalyzing(true);
  }, []);

  const clearTemplate = useCallback(() => {
    setSelectedTemplate(null);
    setAiRecommendations([]);
  }, []);

  return {
    selectedTemplate,
    aiRecommendations,
    isTemplateModalOpen,
    isAnalyzing,
    openTemplateSelector,
    closeTemplateSelector,
    handleTemplateSelect,
    handleAIRecommendations,
    startAIAnalysis,
    clearTemplate
  };
};

export default useTemplateSystem;
