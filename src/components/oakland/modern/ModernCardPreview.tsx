
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { OaklandCardTemplate } from '@/lib/data/oaklandCardTemplates';
import { LightingSettings } from '@/hooks/useCardLighting';
import OaklandCardPreview from '../OaklandCardPreview';
import OaklandCard3DViewer from '../OaklandCard3DViewer';

interface CardData {
  title: string;
  subtitle: string;
  description: string;
  player?: string;
  team: string;
  year?: string;
  tags: string[];
}

interface ModernCardPreviewProps {
  template: OaklandCardTemplate | null;
  cardData: CardData;
  view3D: boolean;
  lightingSettings: LightingSettings;
  lightingPreset: string;
  onDataChange: (data: CardData) => void;
}

const mapLightingPresetToEnvironment = (preset: string): 'studio' | 'sunset' | 'warehouse' | 'forest' | 'apartment' | 'city' | 'dawn' | 'lobby' | 'night' | 'park' => {
  switch (preset) {
    case 'natural': return 'park';
    case 'dramatic': return 'night';
    case 'gallery': return 'lobby';
    case 'display_case': return 'apartment';
    default: return 'studio';
  }
};

const ModernCardPreview: React.FC<ModernCardPreviewProps> = ({
  template,
  cardData,
  view3D,
  lightingSettings,
  lightingPreset,
  onDataChange
}) => {
  const [zoom, setZoom] = React.useState(1);
  const [fullscreen, setFullscreen] = React.useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  if (!template) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-12 text-center border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">⚾</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose a Template</h3>
          <p className="text-gray-500 max-w-md">
            Select an Oakland A's template from the sidebar to start creating your memory card
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Preview Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
          <span className="text-sm text-gray-500">
            {template.name} • {view3D ? '3D' : '2D'} View
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 min-w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFullscreen(true)}
            className="ml-2"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <div 
          className="transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          {view3D ? (
            <div className="w-96 h-[560px]">
              <OaklandCard3DViewer
                template={template}
                title={cardData.title}
                subtitle={cardData.subtitle}
                autoRotate={true}
                environment={mapLightingPresetToEnvironment(lightingPreset)}
                lightingSettings={lightingSettings}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="w-64">
              <OaklandCardPreview
                template={template}
                title={cardData.title}
                subtitle={cardData.subtitle}
              />
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500">
          Perfect 2.5" × 3.5" trading card proportions • Print-ready quality
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl max-h-4xl p-8">
            <Button
              variant="outline"
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 z-10 bg-white"
            >
              ✕
            </Button>
            <div className="w-full h-full flex items-center justify-center">
              {view3D ? (
                <OaklandCard3DViewer
                  template={template}
                  title={cardData.title}
                  subtitle={cardData.subtitle}
                  autoRotate={true}
                  environment={mapLightingPresetToEnvironment(lightingPreset)}
                  lightingSettings={lightingSettings}
                  className="w-full h-full max-w-2xl max-h-3xl"
                />
              ) : (
                <div className="max-w-lg">
                  <OaklandCardPreview
                    template={template}
                    title={cardData.title}
                    subtitle={cardData.subtitle}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernCardPreview;
