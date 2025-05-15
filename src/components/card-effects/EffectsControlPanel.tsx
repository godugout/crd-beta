
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CardEffect, CardEffectSettings } from '@/lib/types/cardEffects';
import { Save, RefreshCw, Sparkles, Download, Upload } from 'lucide-react';

interface EffectsControlPanelProps {
  availableEffects: CardEffect[];
  activeEffects: CardEffect[];
  onToggleEffect: (effectId: string) => void;
  onUpdateEffectSettings: (effectId: string, settings: Partial<CardEffectSettings>) => void;
  onSavePreset: () => void;
  onLoadPreset: (presetId: string) => void;
  presets: { id: string; name: string }[];
}

const EffectsControlPanel: React.FC<EffectsControlPanelProps> = ({
  availableEffects,
  activeEffects,
  onToggleEffect,
  onUpdateEffectSettings,
  onSavePreset,
  onLoadPreset,
  presets
}) => {
  const [presetName, setPresetName] = React.useState('');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Visual Effects
        </CardTitle>
        <CardDescription>
          Apply and customize visual effects for your card
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="effects">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="active">Active ({activeEffects.length})</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="effects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableEffects.map(effect => {
                const isActive = activeEffects.some(e => e.id === effect.id);
                
                return (
                  <div 
                    key={effect.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => onToggleEffect(effect.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{effect.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {getEffectDescription(effect.id)}
                        </p>
                      </div>
                      <Switch checked={isActive} onCheckedChange={() => onToggleEffect(effect.id)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            {activeEffects.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No active effects</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Switch to the Effects tab to add some visual effects
                </p>
              </div>
            ) : (
              activeEffects.map(effect => (
                <div key={effect.id} className="border rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{effect.name}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onToggleEffect(effect.id)}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Intensity Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Intensity</Label>
                        <span className="text-xs text-muted-foreground">
                          {effect.settings.intensity?.toFixed(1) || 1.0}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[effect.settings.intensity || 1.0]}
                        min={0.1}
                        max={2.0}
                        step={0.1}
                        onValueChange={([value]) => {
                          onUpdateEffectSettings(effect.id, { intensity: value });
                        }}
                      />
                    </div>
                    
                    {/* Speed Slider */}
                    {effect.settings.speed !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Speed</Label>
                          <span className="text-xs text-muted-foreground">
                            {effect.settings.speed?.toFixed(1) || 1.0}
                          </span>
                        </div>
                        <Slider
                          defaultValue={[effect.settings.speed || 1.0]}
                          min={0.1}
                          max={2.0}
                          step={0.1}
                          onValueChange={([value]) => {
                            onUpdateEffectSettings(effect.id, { speed: value });
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Color Picker */}
                    {effect.settings.color !== undefined && (
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={effect.settings.color || '#ffffff'}
                            className="w-12 h-8 p-1"
                            onChange={(e) => {
                              onUpdateEffectSettings(effect.id, { color: e.target.value });
                            }}
                          />
                          <Input
                            type="text"
                            value={effect.settings.color || '#ffffff'}
                            onChange={(e) => {
                              onUpdateEffectSettings(effect.id, { color: e.target.value });
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Animation Toggle */}
                    <div className="flex items-center justify-between">
                      <Label>Animation</Label>
                      <Switch 
                        checked={effect.settings.animationEnabled || false}
                        onCheckedChange={(checked) => {
                          onUpdateEffectSettings(effect.id, { animationEnabled: checked });
                        }}
                      />
                    </div>
                    
                    {/* Pattern Select (if applicable) */}
                    {effect.settings.pattern !== undefined && (
                      <div className="space-y-2">
                        <Label>Pattern</Label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={effect.settings.pattern || 'default'}
                          onChange={(e) => {
                            onUpdateEffectSettings(effect.id, { pattern: e.target.value });
                          }}
                        >
                          <option value="rainbow">Rainbow</option>
                          <option value="linear">Linear</option>
                          <option value="radial">Radial</option>
                          <option value="angular">Angular</option>
                        </select>
                      </div>
                    )}
                    
                    {/* Reset Button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => {
                        // Reset to default settings
                        const defaultEffect = availableEffects.find(e => e.id === effect.id);
                        if (defaultEffect) {
                          onUpdateEffectSettings(effect.id, defaultEffect.settings);
                        }
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset to Default
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="presets" className="space-y-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Save Current Effects</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Preset name"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    disabled={!presetName.trim() || activeEffects.length === 0}
                    onClick={() => {
                      onSavePreset();
                      setPresetName('');
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">Load Preset</h3>
                {presets.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map(preset => (
                      <Button
                        key={preset.id}
                        variant="outline"
                        className="justify-start"
                        onClick={() => onLoadPreset(preset.id)}
                      >
                        <Sparkles className="h-4 w-4 mr-2 text-primary" />
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No saved presets. Create one by adding effects and saving them.
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export Presets
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Presets
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          {activeEffects.length} effect{activeEffects.length !== 1 ? 's' : ''} active
        </div>
        <Button size="sm" variant="default" disabled={activeEffects.length === 0}>
          Apply to Card
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper function to get descriptions
function getEffectDescription(effectId: string): string {
  switch (effectId) {
    case 'holographic':
      return 'Rainbow holographic effect with dynamic light refraction';
    case 'prismatic':
      return 'Color-separating prismatic light refraction effect';
    case 'metallic':
      return 'Realistic metallic surface with reflections';
    case 'particle':
      return 'Dynamic particle system for animated effects';
    case 'glow':
      return 'Edge glow effect with customizable colors';
    case 'distortion':
      return 'Wavy distortion effect for dynamic cards';
    default:
      return 'Visual effect for cards';
  }
}

export default EffectsControlPanel;
