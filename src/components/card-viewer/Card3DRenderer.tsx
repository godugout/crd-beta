
import React, { useRef, useEffect } from 'react';
import { Card } from '@/lib/types';
import * as THREE from 'three';

interface Card3DRendererProps {
  card: Card;
  className?: string;
}

const Card3DRenderer: React.FC<Card3DRendererProps> = ({ card, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const cardMesh = useRef<THREE.Mesh | null>(null);

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
    
    containerRef.current.appendChild(renderer.current.domElement);
    
    // Position camera
    camera.current.position.z = 1.5;
    
    // Create card mesh
    const cardGeometry = new THREE.PlaneGeometry(1, 1.4); // Card aspect ratio
    
    // Load card texture
    const textureLoader = new THREE.TextureLoader();
    const cardTexture = textureLoader.load(
      card.imageUrl || '/placeholder-card.png', 
      () => {
        if (renderer.current) renderer.current.render(scene.current!, camera.current!);
      }
    );
    
    const cardMaterial = new THREE.MeshBasicMaterial({ 
      map: cardTexture,
      side: THREE.DoubleSide
    });
    
    cardMesh.current = new THREE.Mesh(cardGeometry, cardMaterial);
    scene.current.add(cardMesh.current);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (cardMesh.current) {
        cardMesh.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.3;
      }
      
      if (renderer.current && scene.current && camera.current) {
        renderer.current.render(scene.current, camera.current);
      }
    };
    
    animate();
    
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
      
      if (containerRef.current && renderer.current) {
        containerRef.current.removeChild(renderer.current.domElement);
      }
      
      if (cardMesh.current) {
        cardMesh.current.geometry.dispose();
        (cardMesh.current.material as THREE.MeshBasicMaterial).dispose();
      }
      
      if (renderer.current) {
        renderer.current.dispose();
      }
    };
  }, [card.imageUrl]);

  return (
    <div 
      ref={containerRef} 
      className={className || "w-full h-full min-h-[300px]"}
    />
  );
};

export default Card3DRenderer;
