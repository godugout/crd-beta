
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye, Shuffle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OaklandCardTemplate, OAKLAND_CARD_TEMPLATES } from '@/lib/data/oaklandCardTemplates';
import { useCardLighting } from '@/hooks/useCardLighting';
import OaklandCardTemplateSelector from './OaklandCardTemplateSelector';
import OaklandCard3DViewer from './OaklandCard3DViewer';
import OaklandCardPreview from './OaklandCardPreview';
import ViewerSettings from '@/components/gallery/viewer-components/ViewerSettings';

interface CardData {
  title: string;
  subtitle: string;
  description: string;
  player?: string;
  team: string;
  year?: string;
  tags: string[];
}

const OaklandCardCreator: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<OaklandCardTemplate | null>(null);
  const [cardData, setCardData] = useState<CardData>({
    title: 'Oakland A\'s',
    subtitle: 'Baseball Card',
    description: 'An authentic Oakland Athletics trading card',
    team: 'Oakland Athletics',
    tags: []
  });
  const [view3D, setView3D] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showStudioSettings, setShowStudioSettings] = useState(false);

  // Lighting controls
  const {
    lightingSettings,
    lightingPreset,
    applyPreset,
    updateLightingSetting
  } = useCardLighting('studio');

  const handleRandomTemplate = () => {
    const randomTemplate = OAKLAND_CARD_TEMPLATES[Math.floor(Math.random() * OAKLAND_CARD_TEMPLATES.length)];
    setSelectedTemplate(randomTemplate);
    toast.success(`Applied ${randomTemplate.name} template! 🎲`);
  };

  const handleSaveCard = () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }

    // Here you would typically save to your card system
    console.log('Saving card:', { template: selectedTemplate, data: cardData });
    toast.success('Oakland A\'s card saved successfully! ⚾');
  };

  const handlePreviewToggle = () => {
    setView3D(!view3D);
  };

  const handleLightingPresetChange = (preset: string) => {
    applyPreset(preset as any);
    toast.success(`Applied ${preset} lighting preset`);
  };

  const handleLightingSettingUpdate = (key: string, value: any) => {
    const keys = key.split('.');
    if (keys.length === 2) {
      updateLightingSetting({
        [keys[0]]: {
          ...(lightingSettings[keys[0] as keyof typeof lightingSettings] || {}),
          [keys[1]]: value
        }
      });
    } else {
      updateLightingSetting({ [key]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 relative">
      {/* Header */}
      <header className="border-b border-green-600/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to OAK.FAN
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Oakland A's Card Creator</h1>
              <p className="text-yellow-400 text-sm">Design authentic Oakland Athletics trading cards</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleRandomTemplate}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Random
            </Button>
            <Button 
              onClick={handlePreviewToggle}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              {view3D ? '2D' : '3D'} View
            </Button>
            {view3D && (
              <Button 
                onClick={() => setShowStudioSettings(!showStudioSettings)}
                variant="outline"
                size="sm"
                className={`border-gray-600 text-gray-300 hover:bg-gray-700 ${showStudioSettings ? 'bg-gray-700' : ''}`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Studio
              </Button>
            )}
            <Button 
              onClick={handleSaveCard}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Card
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Template Selection */}
          <div className="lg:col-span-1 h-full overflow-hidden">
            <Card className="bg-gray-900/80 border-gray-700 h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-white">Select Template</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <OaklandCardTemplateSelector
                  onSelectTemplate={setSelectedTemplate}
                  selectedTemplateId={selectedTemplate?.id}
                />
              </CardContent>
            </Card>
          </div>

          {/* Card Customization */}
          <div className="lg:col-span-1 h-full overflow-hidden">
            <Card className="bg-gray-900/80 border-gray-700 h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-white">Card Details</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Card Title</Label>
                  <Input
                    id="title"
                    value={cardData.title}
                    onChange={(e) => setCardData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter card title"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle" className="text-white">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={cardData.subtitle}
                    onChange={(e) => setCardData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter subtitle"
                  />
                </div>

                <div>
                  <Label htmlFor="player" className="text-white">Player Name (Optional)</Label>
                  <Input
                    id="player"
                    value={cardData.player || ''}
                    onChange={(e) => setCardData(prev => ({ ...prev, player: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter player name"
                  />
                </div>

                <div>
                  <Label htmlFor="year" className="text-white">Year (Optional)</Label>
                  <Input
                    id="year"
                    value={cardData.year || ''}
                    onChange={(e) => setCardData(prev => ({ ...prev, year: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter year"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={cardData.description}
                    onChange={(e) => setCardData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter card description"
                    rows={3}
                  />
                </div>

                {/* Template Info */}
                {selectedTemplate && (
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Template: {selectedTemplate.name}</h4>
                    <p className="text-gray-300 text-sm mb-2">{selectedTemplate.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTemplate.metadata.tags.map(tag => (
                        <span key={tag} className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Card Preview - Full Height */}
          <div className="lg:col-span-1 h-full">
            <Card className="bg-gray-900/80 border-gray-700 h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-white flex items-center justify-between">
                  Card Preview
                  {selectedTemplate && view3D && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAutoRotate(!autoRotate)}
                      className="text-gray-400 hover:text-white"
                    >
                      {autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {selectedTemplate ? (
                  <div className="flex-1 flex flex-col">
                    {view3D ? (
                      <div className="flex-1 min-h-0">
                        <OaklandCard3DViewer
                          template={selectedTemplate}
                          title={cardData.title}
                          subtitle={cardData.subtitle}
                          autoRotate={autoRotate}
                          environment={lightingPreset}
                          lightingSettings={lightingSettings}
                          className="h-full"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-64 max-w-full">
                          <OaklandCardPreview
                            template={selectedTemplate}
                            title={cardData.title}
                            subtitle={cardData.subtitle}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center text-gray-400 text-sm mt-4 flex-shrink-0">
                      Perfect 2.5" × 3.5" trading card proportions
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <div className="text-6xl mb-4">⚾</div>
                      <h3 className="text-xl text-white mb-2">Select a Template</h3>
                      <p className="text-gray-400">Choose an Oakland A's template to start creating your card</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Studio Settings Panel */}
      {view3D && (
        <ViewerSettings
          settings={lightingSettings}
          onUpdateSettings={handleLightingSettingUpdate}
          onApplyPreset={handleLightingPresetChange}
          isOpen={showStudioSettings}
          onClose={() => setShowStudioSettings(false)}
        />
      )}
    </div>
  );
};

export default OaklandCardCreator;
