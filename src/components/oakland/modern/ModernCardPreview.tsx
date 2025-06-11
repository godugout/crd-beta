
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Sparkles, Star, Trophy } from 'lucide-react';
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
        <Card className="p-16 text-center border-2 border-dashed border-gray-300 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
          <div className="space-y-6">
            <div className="relative">
              <div className="text-8xl mb-6 relative">
                <span className="absolute inset-0 bg-gradient-to-r from-[#003831] to-[#EFB21E] bg-clip-text text-transparent blur-sm">⚾</span>
                <span className="relative bg-gradient-to-r from-[#003831] to-[#EFB21E] bg-clip-text text-transparent">⚾</span>
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-[#EFB21E] animate-pulse" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">Choose Your Template</h3>
              <p className="text-gray-500 max-w-md leading-relaxed">
                Select an Oakland A's template from the sidebar to start creating your authentic memory card
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-4">
              <div className="w-2 h-2 bg-[#003831] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-[#EFB21E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-[#2F5233] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Preview Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">Preview</h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-[#003831] to-[#2F5233] text-[#EFB21E] border-0">
              {template.name}
            </Badge>
            <Badge variant="outline" className="border-gray-300 text-gray-600">
              {view3D ? '3D' : '2D'} View
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0 hover:bg-gray-100">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-12 text-center font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0 hover:bg-gray-100">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFullscreen(true)}
            className="border-gray-300 hover:border-[#003831] hover:bg-[#003831]/5 transition-all duration-200"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Enhanced Preview Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl border border-gray-200/60 overflow-hidden shadow-inner relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #003831 2px, transparent 2px), radial-gradient(circle at 75% 75%, #EFB21E 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div 
          className="transition-transform duration-300 relative z-10"
          style={{ transform: `scale(${zoom})` }}
        >
          {view3D ? (
            <div className="w-96 h-[560px] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent rounded-2xl shadow-2xl" />
              <OaklandCard3DViewer
                template={template}
                title={cardData.title}
                subtitle={cardData.subtitle}
                autoRotate={true}
                environment={mapLightingPresetToEnvironment(lightingPreset)}
                lightingSettings={lightingSettings}
                className="w-full h-full relative z-10"
              />
            </div>
          ) : (
            <div className="w-72 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#003831]/20 to-[#EFB21E]/20 rounded-3xl blur-lg" />
              <div className="relative">
                <OaklandCardPreview
                  template={template}
                  title={cardData.title}
                  subtitle={cardData.subtitle}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl px-6 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Trophy className="h-4 w-4 text-[#EFB21E]" />
            <span className="font-medium">Perfect 2.5" × 3.5" trading card proportions</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="h-4 w-4 text-[#003831]" />
            <span className="font-medium">Print-ready quality</span>
          </div>
        </div>
      </div>

      {/* Enhanced Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm">
          <div className="relative w-full h-full max-w-6xl max-h-6xl p-8">
            <Button
              variant="outline"
              onClick={() => setFullscreen(false)}
              className="absolute top-8 right-8 z-10 bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white"
            >
              ✕
            </Button>
            <div className="w-full h-full flex items-center justify-center">
              {view3D ? (
                <div className="relative">
                  <div className="absolute -inset-8 bg-gradient-to-r from-[#003831]/30 to-[#EFB21E]/30 rounded-3xl blur-2xl" />
                  <OaklandCard3DViewer
                    template={template}
                    title={cardData.title}
                    subtitle={cardData.subtitle}
                    autoRotate={true}
                    environment={mapLightingPresetToEnvironment(lightingPreset)}
                    lightingSettings={lightingSettings}
                    className="w-full h-full max-w-3xl max-h-4xl relative z-10"
                  />
                </div>
              ) : (
                <div className="max-w-2xl relative">
                  <div className="absolute -inset-8 bg-gradient-to-r from-[#003831]/30 to-[#EFB21E]/30 rounded-3xl blur-2xl" />
                  <div className="relative">
                    <OaklandCardPreview
                      template={template}
                      title={cardData.title}
                      subtitle={cardData.subtitle}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'outline'; className?: string }> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    variant === 'outline' 
      ? 'border border-gray-200 text-gray-600 bg-white' 
      : 'bg-gray-100 text-gray-800'
  } ${className}`}>
    {children}
  </span>
);

export default ModernCardPreview;
