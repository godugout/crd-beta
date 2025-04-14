
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UniformTextureMapper, { SportType } from '@/components/uniforms/UniformTextureMapper';
import UniformGallery, { UniformPreset } from '@/components/uniforms/UniformGallery';
import { MaterialSimulation } from '@/hooks/card-effects/types';
import MaterialSimulator from '@/components/pbr/MaterialSimulator';
import MiniActionBar from '@/components/ui/MiniActionBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const UniformTextureDemo: React.FC = () => {
  const [generatedTexture, setGeneratedTexture] = useState<string | null>(null);
  // Define activeSport to be of type that accepts SportType and 'all'
  const [activeSport, setActiveSport] = useState<SportType | 'all'>('basketball');
  const [selectedUniform, setSelectedUniform] = useState<UniformPreset | null>(null);
  
  // Material simulation configuration
  const [material, setMaterial] = useState<MaterialSimulation>({
    type: 'mesh',  // Basketball jersey mesh by default
    baseColor: '#CE1141',
    roughness: 0.7,
    metalness: 0.1,
    weathering: 'new'
  });
  
  // Handle texture generation from mapper
  const handleTextureGenerated = (textureUrl: string) => {
    setGeneratedTexture(textureUrl);
    
    // Update material simulation properties
    setMaterial(prev => ({
      ...prev,
      textureUrl: textureUrl,
      baseColor: extractDominantColor(textureUrl)
    }));
  };
  
  // Handle uniform selection from gallery
  const handleUniformSelected = (uniform: UniformPreset) => {
    setSelectedUniform(uniform);
    setActiveSport(uniform.sport);
    setGeneratedTexture(uniform.textureUrl);
    
    // Update material simulation properties
    setMaterial(prev => ({
      ...prev,
      textureUrl: uniform.textureUrl,
      baseColor: extractDominantColor(uniform.textureUrl),
    }));
  };
  
  // Simple placeholder for extracting dominant color
  // In a real app, this would use a color extraction library
  const extractDominantColor = (textureUrl: string): string => {
    // This is a mock implementation
    if (textureUrl.includes('Bulls')) return '#CE1141';
    if (textureUrl.includes('Lakers')) return '#FDB927';
    if (textureUrl.includes('Nets')) return '#000000';
    return '#0C2340'; // Default
  };
  
  return (
    <PageLayout
      title="Uniform Texture Demo"
      description="Create and customize sport uniform textures for 3D figures"
    >
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Jersey/Uniform Texture Implementation</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Texture Creator */}
          <div className="lg:col-span-2 grid gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Uniform Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <UniformTextureMapper
                  onTextureGenerated={handleTextureGenerated}
                  initialSportType={activeSport === 'all' ? 'basketball' : activeSport}
                  initialTeam={selectedUniform?.team}
                  initialPlayerNumber="23"
                  initialPlayerName="JORDAN"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Uniform Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <UniformGallery
                  onSelectUniform={handleUniformSelected}
                  customTexture={generatedTexture || undefined}
                  sportType={activeSport}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column: Preview & Material Settings */}
          <div>
            <Tabs defaultValue="preview">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="preview">3D Preview</TabsTrigger>
                <TabsTrigger value="material">Material</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>
              
              <Card>
                <CardContent className="p-4">
                  <TabsContent value="preview">
                    <div className="flex flex-col items-center gap-4">
                      <h3 className="text-lg font-medium">3D Material Preview</h3>
                      
                      {/* 3D Material Preview */}
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                        {generatedTexture ? (
                          <div className="w-full h-full flex items-center justify-center perspective-800">
                            <div className="uniform-3d-container relative w-4/5 h-4/5 transform-style-3d rotate-y-15 rotate-x-5 transition-transform duration-300">
                              <img 
                                src={generatedTexture} 
                                alt="Uniform texture" 
                                className="w-full h-full object-cover rounded-lg shadow-xl"
                                style={{ transform: 'translateZ(20px)' }}
                              />
                              
                              <MaterialSimulator
                                material={material}
                                width={300}
                                height={300}
                                className="absolute inset-0 mix-blend-overlay"
                              />
                              
                              {/* Reflections and highlights */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none rounded-lg" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Create a uniform to see the preview
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500">
                        {selectedUniform?.name || "Custom Uniform"}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="material">
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-medium">Material Properties</h3>
                      
                      {/* Material controls */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Material Type</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['mesh', 'canvas', 'synthetic'].map(type => (
                              <Button
                                key={type}
                                variant={material.type === type ? "default" : "outline"} 
                                onClick={() => setMaterial(prev => ({ ...prev, type: type as any }))}
                                className="capitalize"
                                size="sm"
                              >
                                {type}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Condition</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['new', 'game-worn', 'vintage'].map(cond => (
                              <Button
                                key={cond}
                                variant={material.weathering === cond ? "default" : "outline"} 
                                onClick={() => setMaterial(prev => ({ ...prev, weathering: cond as any }))}
                                className="capitalize"
                                size="sm"
                              >
                                {cond}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {generatedTexture && (
                          <div>
                            <label className="block text-sm font-medium mb-1">Raw Texture</label>
                            <div className="border rounded-md overflow-hidden h-40">
                              <img 
                                src={generatedTexture} 
                                alt="Uniform texture" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="data">
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-medium">Texture Data</h3>
                      
                      <div className="rounded-md border bg-slate-50 p-4">
                        <pre className="text-xs overflow-auto max-h-[300px]">
                          {JSON.stringify({
                            texture: generatedTexture ? "Generated" : "None",
                            material: material,
                            sport: activeSport,
                            uniform: selectedUniform || "Custom"
                          }, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </div>
        
        {/* Implementation Progress */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Implementation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Completed Features</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Uniform texture mapper component</li>
                    <li>Sport type selection (basketball, baseball, football, etc.)</li>
                    <li>Team customization</li>
                    <li>Player name and number customization</li>
                    <li>Uniform gallery with professional team presets</li>
                    <li>Recent and favorites management</li>
                    <li>Fabric type simulation (mesh, canvas, synthetic)</li>
                    <li>Weathering effects (new, game-worn, vintage)</li>
                    <li>Basic material property visualization</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Upcoming Features</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Improved normal maps for stitching details</li>
                    <li>Enhanced cloth physics simulation</li>
                    <li>Advanced lighting response</li>
                    <li>Custom logo upload and placement</li>
                    <li>Additional uniform templates</li>
                    <li>Color extraction from source cards</li>
                    <li>Uniform draping on 3D figures</li>
                    <li>Team-specific font styles</li>
                    <li>Performance optimization for mobile devices</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <MiniActionBar />
      </div>
    </PageLayout>
  );
};

export default UniformTextureDemo;
