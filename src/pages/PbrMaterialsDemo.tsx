
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PbrCardRenderer from '@/components/pbr/PbrCardRenderer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PbrMaterialsDemo = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Advanced Material Properties</h1>
        <p className="text-gray-500 mb-8">
          Explore physically-based rendering materials for stunning 3D card effects
        </p>
        
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>PBR Material Preview</CardTitle>
              <CardDescription>
                Adjust material properties to see real-time changes in the card appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PbrCardRenderer />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About PBR Materials</CardTitle>
              <CardDescription>
                Understanding physically-based rendering for trading cards
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                Physically-Based Rendering (PBR) is a method of shading and rendering that provides a more accurate representation of how light interacts with surfaces. It's widely used in games, film, and visualization to create realistic materials.
              </p>
              
              <div>
                <h4 className="font-medium mb-1">Key PBR Properties:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Metalness</strong> - Defines whether a material is metal or non-metal</li>
                  <li><strong>Roughness</strong> - Controls how rough or smooth the surface appears</li>
                  <li><strong>Reflections</strong> - How the material reflects the environment</li>
                  <li><strong>Exposure</strong> - The overall brightness of the scene</li>
                </ul>
              </div>
              
              <p>
                By adjusting these properties, you can create a wide range of materials from matte paper to glossy foil effects.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PbrMaterialsDemo;
