
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

interface ModelLoaderProps {
  url: string;
  scale?: number;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ url, scale = 1 }) => {
  const obj = useLoader(OBJLoader, url);
  
  return (
    <primitive 
      object={obj} 
      scale={[scale, scale, scale]}
      position={[0, 0, 0]}
    />
  );
};

export default ModelLoader;
