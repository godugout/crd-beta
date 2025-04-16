
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ModelLoader from './ModelLoader';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface BaseballModelProps {
  modelUrl?: string;
  scale?: number;
}

const BaseballModel: React.FC<BaseballModelProps> = ({ 
  modelUrl,
  scale = 1
}) => {
  const [localModelUrl, setLocalModelUrl] = useState<string | null>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.name.endsWith('.obj')) {
      toast.error('Please upload an OBJ file');
      return;
    }
    
    // Create local URL for the uploaded file
    const objectUrl = URL.createObjectURL(file);
    setLocalModelUrl(objectUrl);
  };

  return (
    <div className="w-full h-full relative">
      <input
        type="file"
        id="model-upload"
        accept=".obj"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => document.getElementById('model-upload')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Model
        </Button>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          {(localModelUrl || modelUrl) ? (
            <ModelLoader url={localModelUrl || modelUrl || ''} scale={scale} />
          ) : (
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="gray" />
            </mesh>
          )}
        </Suspense>
        <OrbitControls 
          enablePan={false}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default BaseballModel;
