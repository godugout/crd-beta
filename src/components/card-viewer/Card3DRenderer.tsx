
import React, { useRef, useEffect } from 'react';
import { Card } from '@/lib/types';
import * as THREE from 'three';
import { useCardLighting, LIGHTING_PRESETS } from '@/hooks/useCardLighting';

interface Card3DRendererProps {
  card: Card;
  className?: string;
  isFlipped?: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
  lightingPreset?: keyof typeof LIGHTING_PRESETS;
}

const Card3DRenderer: React.FC<Card3DRendererProps> = ({ 
  card, 
  className,
  isFlipped = false,
  activeEffects = [],
  effectIntensities = {},
  lightingPreset = 'display_case'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const cardMesh = useRef<THREE.Mesh | null>(null);
  const ambientLight = useRef<THREE.AmbientLight | null>(null);
  const directionalLight = useRef<THREE.DirectionalLight | null>(null);
  
  const { lightingSettings, updateLightPosition } = useCardLighting(lightingPreset);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    scene.current = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    renderer.current = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    
    renderer.current.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    
    renderer.current.shadowMap.enabled = true;
    renderer.current.shadowMap.type = THREE.PCFSoftShadowMap;
    
    containerRef.current.appendChild(renderer.current.domElement);
    
    // Position camera
    camera.current.position.z = 5;
    
    // Create lighting
    ambientLight.current = new THREE.AmbientLight(
      lightingSettings.ambientLight.color,
      lightingSettings.ambientLight.intensity
    );
    scene.current.add(ambientLight.current);
    
    directionalLight.current = new THREE.DirectionalLight(
      lightingSettings.primaryLight.color,
      lightingSettings.primaryLight.intensity
    );
    directionalLight.current.position.set(
      lightingSettings.primaryLight.x,
      lightingSettings.primaryLight.y,
      lightingSettings.primaryLight.z
    );
    directionalLight.current.castShadow = lightingSettings.primaryLight.castShadow;
    scene.current.add(directionalLight.current);
    
    // Create card mesh
    const cardGeometry = new THREE.PlaneGeometry(3, 4.2); // Card aspect ratio
    
    // Load card texture
    const textureLoader = new THREE.TextureLoader();
    const cardTexture = textureLoader.load(
      card.imageUrl || '/placeholder-card.png', 
      () => {
        if (renderer.current) renderer.current.render(scene.current!, camera.current!);
      }
    );
    
    // Create material with shader support for effects
    const cardMaterial = new THREE.MeshPhysicalMaterial({ 
      map: cardTexture,
      side: THREE.DoubleSide,
      metalness: 0.2,
      roughness: 0.8,
      reflectivity: 0.5
    });
    
    // Apply effect settings based on activeEffects
    if (activeEffects.includes('Holographic')) {
      cardMaterial.metalness = 0.8;
      cardMaterial.roughness = 0.2;
      cardMaterial.iridescence = 1.0;
      cardMaterial.iridescenceIOR = 1.3;
    }
    
    if (activeEffects.includes('Chrome')) {
      cardMaterial.metalness = 1.0;
      cardMaterial.roughness = 0.1;
      cardMaterial.clearcoat = 1.0;
    }
    
    cardMesh.current = new THREE.Mesh(cardGeometry, cardMaterial);
    cardMesh.current.castShadow = true;
    cardMesh.current.receiveShadow = true;
    scene.current.add(cardMesh.current);
    
    // Ground plane to receive shadows
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -2;
    groundMesh.receiveShadow = true;
    scene.current.add(groundMesh);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (cardMesh.current) {
        // Apply flipping effect if needed
        if (isFlipped) {
          cardMesh.current.rotation.y = Math.PI;
        } else {
          cardMesh.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
        }
      }
      
      if (renderer.current && scene.current && camera.current) {
        renderer.current.render(scene.current, camera.current);
      }
    };
    
    animate();
    
    // Mouse interaction for lighting
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      updateLightPosition(x, y);
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera.current || !renderer.current) return;
      
      camera.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.current.updateProjectionMatrix();
      
      renderer.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      
      if (containerRef.current && renderer.current) {
        containerRef.current.removeChild(renderer.current.domElement);
      }
      
      if (cardMesh.current) {
        cardMesh.current.geometry.dispose();
        (cardMesh.current.material as THREE.MeshPhysicalMaterial).dispose();
      }
      
      if (renderer.current) {
        renderer.current.dispose();
      }
    };
  }, [card.imageUrl, isFlipped, lightingSettings, updateLightPosition]);

  // Update lights when lighting settings change
  useEffect(() => {
    if (!scene.current) return;
    
    if (ambientLight.current) {
      ambientLight.current.intensity = lightingSettings.ambientLight.intensity;
      ambientLight.current.color.set(lightingSettings.ambientLight.color);
    }
    
    if (directionalLight.current) {
      directionalLight.current.intensity = lightingSettings.primaryLight.intensity;
      directionalLight.current.color.set(lightingSettings.primaryLight.color);
      directionalLight.current.position.set(
        lightingSettings.primaryLight.x,
        lightingSettings.primaryLight.y,
        lightingSettings.primaryLight.z
      );
      directionalLight.current.castShadow = lightingSettings.primaryLight.castShadow;
    }
  }, [lightingSettings]);

  return (
    <div 
      ref={containerRef} 
      className={className || "w-full h-full min-h-[300px]"}
    />
  );
};

export default Card3DRenderer;
