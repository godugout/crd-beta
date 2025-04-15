
import React from 'react';
import { PbrSettings } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PbrControlsProps {
  settings: PbrSettings;
  onChange: (settings: Partial<PbrSettings>) => void;
}

const PbrControls: React.FC<PbrControlsProps> = ({ settings, onChange }) => {
  const handleSliderChange = (key: keyof PbrSettings) => {
    return (value: number[]) => {
      onChange({ [key]: value[0] });
    };
  };

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="materials">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="materials" className="flex-1">
              Material Properties
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex-1">
              Card Effects
            </TabsTrigger>
            <TabsTrigger value="lighting" className="flex-1">
              Lighting
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="materials">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="roughness">Roughness: {settings.roughness.toFixed(2)}</Label>
                </div>
                <Slider
                  id="roughness"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.roughness]}
                  onValueChange={handleSliderChange('roughness')}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metalness">Metalness: {settings.metalness.toFixed(2)}</Label>
                </div>
                <Slider
                  id="metalness"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.metalness]}
                  onValueChange={handleSliderChange('metalness')}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reflectionStrength">Reflection: {settings.reflectionStrength.toFixed(2)}</Label>
                </div>
                <Slider
                  id="reflectionStrength"
                  min={0}
                  max={2}
                  step={0.01}
                  value={[settings.reflectionStrength]}
                  onValueChange={handleSliderChange('reflectionStrength')}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="effects">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="holographicEffect">Holographic: {Math.round(settings.holographicEffect * 100)}%</Label>
                </div>
                <Slider
                  id="holographicEffect"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.holographicEffect]}
                  onValueChange={handleSliderChange('holographicEffect')}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="chromeEffect">Chrome: {Math.round(settings.chromeEffect * 100)}%</Label>
                </div>
                <Slider
                  id="chromeEffect"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.chromeEffect]}
                  onValueChange={handleSliderChange('chromeEffect')}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vintageEffect">Vintage: {Math.round(settings.vintageEffect * 100)}%</Label>
                </div>
                <Slider
                  id="vintageEffect"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.vintageEffect]}
                  onValueChange={handleSliderChange('vintageEffect')}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="lighting">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="exposure">Exposure: {settings.exposure.toFixed(2)}</Label>
                </div>
                <Slider
                  id="exposure"
                  min={0.5}
                  max={2}
                  step={0.01}
                  value={[settings.exposure]}
                  onValueChange={handleSliderChange('exposure')}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="envMapIntensity">Environment: {settings.envMapIntensity.toFixed(2)}</Label>
                </div>
                <Slider
                  id="envMapIntensity"
                  min={0}
                  max={3}
                  step={0.01}
                  value={[settings.envMapIntensity]}
                  onValueChange={handleSliderChange('envMapIntensity')}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PbrControls;
