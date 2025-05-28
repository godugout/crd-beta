
import React from 'react';
import { AIRecommendation } from '@/lib/types/templateTypes';
import { templateLibrary } from '@/lib/data/templateLibrary';

interface AITemplateAnalyzerProps {
  imageUrl: string;
  onRecommendations: (recommendations: AIRecommendation[]) => void;
}

export const AITemplateAnalyzer: React.FC<AITemplateAnalyzerProps> = ({
  imageUrl,
  onRecommendations
}) => {
  React.useEffect(() => {
    if (!imageUrl) return;

    // Simulate AI analysis - in a real app, this would call an AI service
    const analyzeImage = async () => {
      try {
        // Mock AI analysis results
        const mockRecommendations: AIRecommendation[] = [
          {
            templateId: 'baseball-chrome-modern',
            confidence: 0.92,
            reason: 'Detected baseball player in action pose with stadium background',
            metadata: {
              detectedSport: 'baseball',
              detectedTeam: 'Yankees',
              suggestedColors: ['#132448', '#C4CED4'],
              suggestedStyle: 'modern'
            }
          },
          {
            templateId: 'baseball-vintage-1950s',
            confidence: 0.78,
            reason: 'Classic baseball composition with traditional uniform style',
            metadata: {
              detectedSport: 'baseball',
              suggestedStyle: 'vintage'
            }
          },
          {
            templateId: 'baseball-rookie-modern',
            confidence: 0.65,
            reason: 'Young player appearance suggests rookie card template',
            metadata: {
              detectedSport: 'baseball',
              suggestedStyle: 'rookie'
            }
          }
        ];

        // Filter recommendations to only include existing templates
        const validRecommendations = mockRecommendations.filter(rec =>
          templateLibrary.some(template => template.id === rec.templateId)
        );

        onRecommendations(validRecommendations);
      } catch (error) {
        console.error('Error analyzing image:', error);
        onRecommendations([]);
      }
    };

    // Add delay to simulate AI processing
    const timer = setTimeout(analyzeImage, 1500);
    return () => clearTimeout(timer);
  }, [imageUrl, onRecommendations]);

  return null; // This is a utility component with no UI
};

export default AITemplateAnalyzer;
