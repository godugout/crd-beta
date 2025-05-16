
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { MaterialSimulation } from '@/hooks/card-effects/types';

interface MaterialSimulatorProps {
  simulation: MaterialSimulation;
  width?: number;
  height?: number;
  className?: string;
  onRender?: (texture: any) => void;
}

const MaterialSimulator: React.FC<MaterialSimulatorProps> = ({
  simulation,
  width = 300,
  height = 300,
  className = '',
  onRender
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    
    containerRef.current.appendChild(renderer.domElement);
    
    // Create material based on simulation properties
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    
    let material: THREE.Material;
    
    if (simulation.texture) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(simulation.texture);
      
      material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: simulation.roughness,
        metalness: simulation.metalness,
        color: simulation.color || '#FFFFFF'
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: simulation.color || '#FFFFFF',
        roughness: simulation.roughness,
        metalness: simulation.metalness
      });
    }
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-5, -5, -5);
    scene.add(light2);
    
    // Handle weathering if applicable
    if (simulation.weathering !== undefined) {
      (material as THREE.MeshStandardMaterial).displacementScale = simulation.weathering / 50;
      
      if (simulation.weathering > 0) {
        const weatheringTexture = new THREE.TextureLoader().load('/textures/weathering.jpg');
        (material as THREE.MeshStandardMaterial).displacementMap = weatheringTexture;
      }
    }
    
    // Animation loop
    let frameId: number;
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      sphere.rotation.x += 0.005;
      sphere.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Call onRender callback if provided
    if (onRender && rendererRef.current) {
      onRender(rendererRef.current.domElement);
    }
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [simulation, width, height, onRender]);
  
  return (
    <div ref={containerRef} className={className} style={{ width, height }} />
  );
};

export default MaterialSimulator;
