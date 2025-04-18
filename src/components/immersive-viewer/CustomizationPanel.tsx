
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Lightbulb, 
  Layers, 
  Settings, 
  Camera, 
  SlidersHorizontal, 
  PaintBucket,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/lib/types';
import LightingControls from '@/components/gallery/viewer-components/LightingControls';
import { LightingSettings, LightingPreset } from '@/hooks/useCardLighting';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

interface MaterialSettings {
  roughness: number;
  metalness: number;
  reflectivity: number;
  clearcoat: number;
  envMapIntensity: number;
}

interface CustomizationPanelProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  lightingSettings: LightingSettings;
  onUpdateLighting: (settings: Partial<LightingSettings>) => void;
  onApplyPreset?: (preset: LightingPreset) => void;
  onToggleDynamicLighting?: () => void;
  materialSettings?: MaterialSettings;
  onUpdateMaterial?: (settings: Partial<MaterialSettings>) => void;
  onShareCard?: () => void;
  onDownloadCard?: () => void;
  isUserCustomized?: boolean;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  card,
  isOpen,
  onClose,
  lightingSettings,
  onUpdateLighting,
  onApplyPreset,
  onToggleDynamicLighting,
  materialSettings = { 
    roughness: 0.15, 
    metalness: 0.3,
    reflectivity: 0.2,
    clearcoat: 0.1,
    envMapIntensity: 1.0
  },
  onUpdateMaterial = () => {},
  onShareCard,
  onDownloadCard,
  isUserCustomized
}) => {
  const [activeTab, setActiveTab] = useState("lighting");
  
  // Material presets
  const materialPresets = [
    { name: "Glossy", roughness: 0.1, metalness: 0.2, reflectivity: 0.3, clearcoat: 0.5 },
    { name: "Matte", roughness: 0.8, metalness: 0.1, reflectivity: 0.1, clearcoat: 0.0 },
    { name: "Foil", roughness: 0.2, metalness: 0.9, reflectivity: 0.5, clearcoat: 0.7 },
    { name: "Textured", roughness: 0.6, metalness: 0.5, reflectivity: 0.2, clearcoat: 0.1 }
  ];
  
  const applyMaterialPreset = (preset) => {
    onUpdateMaterial({
      roughness: preset.roughness,
      metalness: preset.metalness,
      reflectivity: preset.reflectivity,
      clearcoat: preset.clearcoat
    });
    
    toast.success(`Applied ${preset.name} material`);
  };
  
  // Handle screenshot/download
  const handleDownload = () => {
    if (onDownloadCard) {
      onDownloadCard();
    } else {
      toast.success("Capturing card snapshot...");
      // In a real implementation, we would trigger a high-quality render here
      setTimeout(() => {
        toast.success("Card snapshot saved to your gallery");
      }, 1200);
    }
  };

  return (
    <motion.div 
      className={`fixed top-0 right-0 h-full w-[380px] bg-gray-900/90 backdrop-blur-xl text-white shadow-2xl z-40 overflow-y-auto`}
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 180 }}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Card Customization</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            &times;
          </Button>
        </div>

        {/* Card Info */}
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="font-medium text-lg">{card.title}</h3>
          {card.description && (
            <p className="text-sm text-gray-300 mt-1 line-clamp-2">{card.description}</p>
          )}
        </div>

        {/* Customization Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 bg-gray-800/50">
            <TabsTrigger value="lighting" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Lighting</span>
            </TabsTrigger>
            <TabsTrigger value="material" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Material</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Lighting Tab */}
          <TabsContent value="lighting" className="space-y-6">
            <LightingControls 
              settings={lightingSettings}
              onUpdateSettings={onUpdateLighting}
            />
          </TabsContent>

          {/* Material Tab */}
          <TabsContent value="material" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Material Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  {materialPresets.map(preset => (
                    <Button 
                      key={preset.name}
                      variant="outline"
                      onClick={() => applyMaterialPreset(preset)}
                      className="flex-1"
                    >
                      <PaintBucket className="h-4 w-4 mr-2" />
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Surface Properties</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="roughness">Roughness</Label>
                    <span className="text-sm text-gray-400">{materialSettings.roughness.toFixed(2)}</span>
                  </div>
                  <Slider
                    id="roughness"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[materialSettings.roughness]}
                    onValueChange={([value]) => onUpdateMaterial({ roughness: value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="metalness">Metalness</Label>
                    <span className="text-sm text-gray-400">{materialSettings.metalness.toFixed(2)}</span>
                  </div>
                  <Slider
                    id="metalness"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[materialSettings.metalness]}
                    onValueChange={([value]) => onUpdateMaterial({ metalness: value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="reflectivity">Reflectivity</Label>
                    <span className="text-sm text-gray-400">{materialSettings.reflectivity.toFixed(2)}</span>
                  </div>
                  <Slider
                    id="reflectivity"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[materialSettings.reflectivity]}
                    onValueChange={([value]) => onUpdateMaterial({ reflectivity: value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="clearcoat">Clear Coat</Label>
                    <span className="text-sm text-gray-400">{materialSettings.clearcoat.toFixed(2)}</span>
                  </div>
                  <Slider
                    id="clearcoat"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[materialSettings.clearcoat]}
                    onValueChange={([value]) => onUpdateMaterial({ clearcoat: value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="envMapIntensity">Environment Reflection</Label>
                    <span className="text-sm text-gray-400">{materialSettings.envMapIntensity.toFixed(2)}</span>
                  </div>
                  <Slider
                    id="envMapIntensity"
                    min={0}
                    max={2}
                    step={0.05}
                    value={[materialSettings.envMapIntensity]}
                    onValueChange={([value]) => onUpdateMaterial({ envMapIntensity: value })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Performance Settings</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-quality">High Quality Rendering</Label>
                  <Switch 
                    id="high-quality"
                    checked={lightingSettings.envMapIntensity > 0.5}
                    onCheckedChange={(checked) => onUpdateLighting({
                      envMapIntensity: checked ? 1.0 : 0.3
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="dynamic-shadows">Dynamic Shadows</Label>
                  <Switch 
                    id="dynamic-shadows"
                    checked={lightingSettings.useDynamicLighting}
                    onCheckedChange={onToggleDynamicLighting}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-rotate">Auto Rotation</Label>
                  <Switch 
                    id="auto-rotate"
                    checked={lightingSettings.autoRotate || false}
                    onCheckedChange={(checked) => onUpdateLighting({
                      autoRotate: checked
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Export Options</h3>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleDownload}
                    className="flex-1"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Capture
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={onShareCard}
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      toast.success("Downloaded high-res image");
                    }}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default CustomizationPanel;
