
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export function useSceneDebugger(enabled: boolean = false) {
  const { scene } = useThree();
  
  useEffect(() => {
    if (!enabled) return;
    
    // Debug function to analyze scene
    const analyzeScene = () => {
      console.group('Scene Analysis');
      console.log('Total objects:', scene.children.length);
      
      const meshes = scene.children.filter(child => child instanceof THREE.Mesh);
      console.log('Meshes:', meshes.length);
      
      const cameras = scene.children.filter(child => child instanceof THREE.Camera);
      console.log('Cameras:', cameras.length);
      
      const lights = scene.children.filter(child => child instanceof THREE.Light);
      console.log('Lights:', lights.length);
      
      // List all scene objects
      console.log('Scene objects:');
      scene.traverse(object => {
        const type = object.type;
        const name = object.name || 'unnamed';
        const position = object.position.toArray().map(v => v.toFixed(2)).join(', ');
        console.log(`- ${type} "${name}" at (${position})`);
        
        // If it's a mesh, log material info
        if (object instanceof THREE.Mesh) {
          const material = object.material;
          console.log(`  Material: ${material.type}`);
        }
      });
      
      console.groupEnd();
    };
    
    // Run initial analysis
    analyzeScene();
    
    // Set up an interval to periodically analyze the scene
    const intervalId = setInterval(() => {
      analyzeScene();
    }, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [scene, enabled]);
  
  return {
    // Additional debug methods can be added here
    logSceneGraph: () => {
      if (!enabled) return;
      console.log('Scene graph:');
      scene.traverse(object => {
        console.log(`- ${object.type} (${object.uuid.substring(0, 8)})`);
      });
    }
  };
}
