
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UniformTextureMapper, { SportType } from '@/components/uniforms/UniformTextureMapper';
import UniformGallery, { UniformPreset } from '@/components/uniforms/UniformGallery';
import { MaterialSimulation } from '@/hooks/card-effects/types';
import MaterialSimulator from '@/components/pbr/MaterialSimulator';

const UniformTextureDemo: React.FC = () => {
  const [generatedTexture, setGeneratedTexture] = useState<string | null>(null);
  // Define activeSport to be of type that accepts SportType and 'all'
  const [activeSport, setActiveSport] = useState<SportType | 'all'>('basketball');
  const [selectedUniform, setSelectedUniform] = useState<UniformPreset | null>(null);
  
  // Material simulation configuration
  const [material, setMaterial] = useState<MaterialSimulation>({
    type: 'canvas',  // Bulls red by default
    baseColor: '#CE1141',
    roughness: 0.7,
    metalness: 0.1
  });
  
  // Handle texture generation from mapper
  const handleTextureGenerated = (textureUrl: string) => {
    setGeneratedTexture(textureUrl);
    
    // Update material simulation properties
    setMaterial(prev => ({
      ...prev,
      type: 'canvas',  // Canvas material for fabric
      baseColor: extractDominantColor(textureUrl),
      textureUrl: textureUrl,
      roughness: 0.7,
      metalness: 0.1
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
      type: 'canvas',
      baseColor: extractDominantColor(uniform.textureUrl),
      textureUrl: uniform.textureUrl,
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
                  initialSportType={activeSport}
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
                <TabsTrigger value="texture">Material</TabsTrigger>
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
                  
                  <TabsContent value="texture">
                    <div className="flex flex-col items-center gap-4">
                      <h3 className="text-lg font-medium">Material Texture</h3>
                      
                      {/* Raw texture display */}
                      <div className="w-full aspect-square rounded-lg overflow-hidden border">
                        {generatedTexture ? (
                          <img 
                            src={generatedTexture} 
                            alt="Uniform texture" 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            No texture generated
                          </div>
                        )}
                      </div>
                      
                      <div className="w-full">
                        <p className="text-sm font-medium mb-1">Material Type</p>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {['canvas', 'mesh', 'synthetic'].map(type => (
                            <button
                              key={type}
                              className={`py-1 px-3 text-sm rounded-md ${material.type === type ? 'bg-primary text-white' : 'bg-gray-100'}`}
                              onClick={() => setMaterial(prev => ({ ...prev, type: type as any }))}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
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
      </div>
    </PageLayout>
  );
};

export default UniformTextureDemo;
