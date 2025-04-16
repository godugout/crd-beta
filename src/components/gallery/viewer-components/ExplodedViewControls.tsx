
import React, { useState } from 'react';
import { Layers, X, Eye, EyeOff, Grid3X3, Film, Grid2X2, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LayerInfo, LayerGroup } from '@/lib/types/layerTypes';

interface ExplodedViewControlsProps {
  isActive: boolean;
  layers: LayerInfo[];
  layerGroups: LayerGroup[];
  explosionDistance: number;
  explosionType: 'vertical' | 'radial' | 'custom';
  selectedLayerId: string | null;
  visibleLayerIds: string[];
  specialView: 'normal' | 'cross-section' | 'wireframe' | 'xray' | 'timeline';
  onExplosionDistanceChange: (value: number) => void;
  onExplosionTypeChange: (type: 'vertical' | 'radial' | 'custom') => void;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerSelect: (layerId: string | null) => void;
  onSpecialViewChange: (view: 'normal' | 'cross-section' | 'wireframe' | 'xray' | 'timeline') => void;
  onClose: () => void;
}

const ExplodedViewControls: React.FC<ExplodedViewControlsProps> = ({
  isActive,
  layers,
  layerGroups,
  explosionDistance,
  explosionType,
  selectedLayerId,
  visibleLayerIds,
  specialView,
  onExplosionDistanceChange,
  onExplosionTypeChange,
  onLayerVisibilityToggle,
  onLayerSelect,
  onSpecialViewChange,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = useState('layers');

  if (!isActive) return null;

  return (
    <Card className="w-80 bg-gray-900/80 backdrop-blur-md border-gray-800 text-white">
      <CardHeader className="border-b border-gray-800 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center">
            <Layers className="mr-2 h-5 w-5" />
            Exploded View
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-gray-400 text-xs">
          Analyze card layers and components
        </CardDescription>
      </CardHeader>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="bg-gray-800 w-full">
            <TabsTrigger value="layers" className="flex-1">
              Layers
            </TabsTrigger>
            <TabsTrigger value="controls" className="flex-1">
              Controls
            </TabsTrigger>
            <TabsTrigger value="views" className="flex-1">
              Views
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-4">
          <TabsContent value="layers" className="mt-0">
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-gray-400 mb-2 block">Layer Groups</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 pb-2">
                  {layerGroups.map(group => (
                    <div key={group.id} className="bg-gray-800/50 rounded-md p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{group.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost" 
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  group.layerIds.forEach(id => onLayerVisibilityToggle(id));
                                }}
                              >
                                {group.layerIds.every(id => visibleLayerIds.includes(id)) ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {group.layerIds.every(id => visibleLayerIds.includes(id)) 
                                ? "Hide all layers in group" 
                                : "Show all layers in group"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-400 mb-2 block">Individual Layers</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 pb-2">
                  {layers.map(layer => (
                    <div 
                      key={layer.id} 
                      className={`bg-gray-800/50 rounded-md p-2 border ${
                        selectedLayerId === layer.id ? 'border-blue-500' : 'border-transparent'
                      } cursor-pointer`}
                      onClick={() => onLayerSelect(layer.id === selectedLayerId ? null : layer.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{layer.name}</span>
                        <Button
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLayerVisibilityToggle(layer.id);
                          }}
                        >
                          {visibleLayerIds.includes(layer.id) ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="controls" className="mt-0">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="explosion-distance">Explosion Distance</Label>
                  <span className="text-xs text-gray-400">{explosionDistance.toFixed(1)}</span>
                </div>
                <Slider
                  id="explosion-distance"
                  min={0}
                  max={5}
                  step={0.1}
                  value={[explosionDistance]}
                  onValueChange={(values) => onExplosionDistanceChange(values[0])}
                />
              </div>

              <div className="space-y-2">
                <Label className="block mb-2">Explosion Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={explosionType === 'vertical' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onExplosionTypeChange('vertical')}
                    className="w-full text-xs"
                  >
                    Vertical
                  </Button>
                  <Button
                    variant={explosionType === 'radial' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onExplosionTypeChange('radial')}
                    className="w-full text-xs"
                  >
                    Radial
                  </Button>
                  <Button
                    variant={explosionType === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onExplosionTypeChange('custom')}
                    className="w-full text-xs"
                  >
                    Custom
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <Label className="block mb-2">Animation</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="explosion-animation" />
                  <Label htmlFor="explosion-animation">Enable animation</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="views" className="mt-0">
            <div className="space-y-3">
              <Button
                variant={specialView === 'normal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSpecialViewChange('normal')}
                className="w-full justify-start text-sm"
              >
                <Layers className="h-4 w-4 mr-2" />
                Normal View
              </Button>
              <Button
                variant={specialView === 'cross-section' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSpecialViewChange('cross-section')}
                className="w-full justify-start text-sm"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Cross-Section
              </Button>
              <Button
                variant={specialView === 'wireframe' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSpecialViewChange('wireframe')}
                className="w-full justify-start text-sm"
              >
                <Grid2X2 className="h-4 w-4 mr-2" />
                Wireframe
              </Button>
              <Button
                variant={specialView === 'xray' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSpecialViewChange('xray')}
                className="w-full justify-start text-sm"
              >
                <Box className="h-4 w-4 mr-2" />
                X-Ray View
              </Button>
              <Button
                variant={specialView === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSpecialViewChange('timeline')}
                className="w-full justify-start text-sm"
              >
                <Film className="h-4 w-4 mr-2" />
                Timeline View
              </Button>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default ExplodedViewControls;
