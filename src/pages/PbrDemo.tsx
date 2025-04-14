
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PbrCardRenderer from '@/components/pbr/PbrCardRenderer';
import MaterialSimulator from '@/components/pbr/MaterialSimulator';
import { MaterialSimulation } from '@/hooks/card-effects/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import MiniActionBar from '@/components/ui/MiniActionBar';

const PbrDemo = () => {
  const [material, setMaterial] = useState<MaterialSimulation>({
    type: 'canvas',
    baseColor: '#CE1141', // Bulls red
    roughness: 0.7,
    metalness: 0.1,
    weathering: 'new'
  });
  
  // Sample textures for testing
  const sampleTextures = [
    {
      name: 'Bulls Jersey',
      url: '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
      color: '#CE1141'
    },
    {
      name: 'Lakers Jersey',
      url: '/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png',
      color: '#FDB927'
    },
    {
      name: 'Nets Jersey',
      url: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
      color: '#000000'
    }
  ];

  return (
    <PageLayout
      title="PBR Demo"
      description="Physically Based Rendering demonstration"
    >
      <div className="container mx-auto pt-8 px-4 pb-20">
        <h1 className="text-3xl font-bold mb-6">Material & PBR Simulation</h1>
        
        <p className="text-gray-600 mb-8">
          This demo showcases physically based rendering (PBR) for sports uniforms and jerseys, 
          allowing you to see how different material properties affect the appearance of the fabric.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Material Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Material Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['canvas', 'mesh', 'synthetic'].map(type => (
                      <Button
                        key={type}
                        variant={material.type === type ? "default" : "outline"} 
                        onClick={() => setMaterial(prev => ({ ...prev, type: type as any }))}
                        className="capitalize"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Weathering</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['new', 'game-worn', 'vintage'].map(cond => (
                      <Button
                        key={cond}
                        variant={material.weathering === cond ? "default" : "outline"} 
                        onClick={() => setMaterial(prev => ({ ...prev, weathering: cond as any }))}
                        className="capitalize"
                      >
                        {cond}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Roughness: {material.roughness?.toFixed(2)}</Label>
                  <Slider 
                    value={[material.roughness || 0.5]} 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    onValueChange={(value) => setMaterial(prev => ({ ...prev, roughness: value[0] }))}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Smooth</span>
                    <span>Rough</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Metalness: {material.metalness?.toFixed(2)}</Label>
                  <Slider 
                    value={[material.metalness || 0]} 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    onValueChange={(value) => setMaterial(prev => ({ ...prev, metalness: value[0] }))}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Non-metallic</span>
                    <span>Metallic</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Sample Textures</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {sampleTextures.map((texture, index) => (
                      <button
                        key={index}
                        className={`border rounded-md overflow-hidden h-20 ${material.textureUrl === texture.url ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setMaterial(prev => ({ 
                          ...prev, 
                          textureUrl: texture.url,
                          baseColor: texture.color
                        }))}
                      >
                        <img 
                          src={texture.url} 
                          alt={texture.name} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Material Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="2d">
                <TabsList className="mb-4">
                  <TabsTrigger value="2d">2D Preview</TabsTrigger>
                  <TabsTrigger value="3d">3D Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="2d">
                  <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-lg p-8">
                    <div className="flex items-center justify-center">
                      <div className="aspect-square w-full max-w-[300px] perspective-800">
                        <MaterialSimulator
                          material={material}
                          width={300}
                          height={300}
                          className="rounded-md border shadow-xl transform-style-3d rotate-y-15 rotate-x-5"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      This 2D preview shows how the material properties affect the appearance of the fabric.
                      The canvas allows for detailed visualization of fabric texture, weathering effects, and lighting.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="3d">
                  <div className="h-[300px]">
                    <PbrCardRenderer />
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      The 3D preview shows how the material would look on a three-dimensional object.
                      This allows for better visualization of how light interacts with the material from different angles.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Technical Implementation Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Material Properties</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>
                  Our material system simulates different types of sports uniform fabrics:
                </p>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li><strong>Mesh:</strong> Used in basketball jerseys, features perforated fabric pattern</li>
                  <li><strong>Canvas/Cotton:</strong> Traditional baseball jerseys with woven texture</li>
                  <li><strong>Synthetic:</strong> Modern performance fabrics with smooth surface and sheen</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Weathering Effects</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>
                  We simulate different conditions of uniform wear:
                </p>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li><strong>New:</strong> Fresh off the production line, vibrant colors, clean fabric</li>
                  <li><strong>Game-Worn:</strong> Shows signs of use like scuffs and wear patterns</li>
                  <li><strong>Vintage:</strong> Aged appearance with fading, yellowing, and fabric deterioration</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>PBR Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>
                  Our physically-based rendering approach includes:
                </p>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li><strong>Normal maps:</strong> Simulates stitching and fabric textures</li>
                  <li><strong>Roughness:</strong> Controls how diffuse vs. sharp highlights appear</li>
                  <li><strong>Metalness:</strong> Affects reflectivity and specularity of the fabric</li>
                  <li><strong>Environment mapping:</strong> Simulates light reflection from surroundings</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <MiniActionBar />
      </div>
    </PageLayout>
  );
};

export default PbrDemo;
