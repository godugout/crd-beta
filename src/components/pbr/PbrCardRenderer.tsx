
import React, { useEffect, useRef, useState } from 'react';
import { createPbrScene } from './pbrEngine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PbrControls from './PbrControls';
import { PbrSettings } from './types';

const PbrCardRenderer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<PbrSettings>({
    roughness: 0.2,
    metalness: 0.8,
    exposure: 1.0,
    envMapIntensity: 1.0,
    reflectionStrength: 0.5,
  });
  const [activeTab, setActiveTab] = useState('preview');
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const { cleanup } = createPbrScene(canvasRef.current, containerRef.current, settings);
    
    return () => {
      cleanup();
    };
  }, [settings]);
  
  const handleSettingsChange = (newSettings: Partial<PbrSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">PBR Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="pt-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <div 
              ref={containerRef} 
              className="relative w-full h-[500px] flex items-center justify-center perspective-800"
            >
              <canvas 
                ref={canvasRef} 
                className="w-full h-full"
              />
              
              {/* CSS backdrop-filter for card surface interactions */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent backdrop-blur-[1px] opacity-30" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="pt-4">
          <PbrControls settings={settings} onChange={handleSettingsChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PbrCardRenderer;
