
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CardEffect, CardEffectSettings } from '@/lib/types/cardEffects';
import { WebGLRenderer, EffectCompositor, PreviewGenerator, EffectEngine } from '@/lib/types/cardEffects';
import useToast from '@/hooks/use-toast-helper';

export const useCardEffectsEngine = (): EffectEngine => {
  const [effects, setEffects] = useState<Map<string, CardEffect>>(new Map());
  const { error, success } = useToast();
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Implementation of WebGLRenderer interface that uses THREE.js
  class WebGLRendererImpl implements WebGLRenderer {
    private threeRenderer: THREE.WebGLRenderer | null = null;
    private scene: THREE.Scene | null = null;
    private camera: THREE.Camera | null = null;
    private material: THREE.ShaderMaterial | null = null;
    
    initialize(canvas: HTMLCanvasElement): void {
      this.threeRenderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true 
      });
      
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      this.camera.position.z = 1;
      
      // Create a plane that fills the view
      const geometry = new THREE.PlaneGeometry(2, 2);
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0.0 },
          intensity: { value: 1.0 },
          speed: { value: 1.0 },
          colorTint: { value: new THREE.Color(1, 1, 1) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform float intensity;
          varying vec2 vUv;
          void main() {
            gl_FragColor = vec4(vUv.x * intensity, vUv.y * intensity, sin(time) * 0.5 + 0.5, 1.0);
          }
        `,
        transparent: true
      });
      
      const mesh = new THREE.Mesh(geometry, this.material);
      this.scene?.add(mesh);
      
      rendererRef.current = this.threeRenderer;
      canvasRef.current = canvas;
      
      this.resize();
      window.addEventListener('resize', this.resize.bind(this));
    }
    
    private resize() {
      if (!this.threeRenderer || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      if (canvas.width !== width || canvas.height !== height) {
        this.threeRenderer.setSize(width, height, false);
      }
    }
    
    applyShader(effect: CardEffect): void {
      if (!this.material) return;
      
      // Update shader uniforms based on effect settings
      if (effect.settings.intensity !== undefined) {
        this.material.uniforms.intensity.value = effect.settings.intensity;
      }
      
      if (effect.settings.speed !== undefined) {
        this.material.uniforms.speed.value = effect.settings.speed;
      }
      
      if (effect.settings.color !== undefined) {
        this.material.uniforms.colorTint.value = new THREE.Color(effect.settings.color);
      }
    }
    
    render(): void {
      if (!this.threeRenderer || !this.scene || !this.camera) return;
      
      // Update time uniform
      if (this.material) {
        this.material.uniforms.time.value = performance.now() / 1000;
      }
      
      this.threeRenderer.render(this.scene, this.camera);
    }
    
    dispose(): void {
      window.removeEventListener('resize', this.resize);
      
      this.material?.dispose();
      this.threeRenderer?.dispose();
      
      this.material = null;
      this.scene = null;
      this.camera = null;
      this.threeRenderer = null;
    }
  }
  
  // Create implementations of the required interfaces
  const webGLRenderer: WebGLRenderer = new WebGLRendererImpl();
  
  // Effect compositor implementation
  const compositor: EffectCompositor = {
    compose(effects: CardEffect[]): any {
      const cssClasses = effects
        .filter(effect => effect.enabled)
        .map(effect => effect.className || `effect-${effect.name.toLowerCase().replace(/\s+/g, '-')}`)
        .join(' ');
        
      const effectData: Record<string, any> = {};
      effects.forEach(effect => {
        if (effect.enabled) {
          effectData[effect.id] = effect.settings;
        }
      });
      
      return {
        cssClasses,
        effectData
      };
    },
    
    layerEffects(primary: CardEffect, secondary: CardEffect): CardEffect {
      return {
        ...primary,
        id: `${primary.id}-${secondary.id}`,
        name: `${primary.name} + ${secondary.name}`,
        className: `${primary.className || ''} ${secondary.className || ''}`.trim(),
        settings: {
          ...primary.settings,
          ...secondary.settings
        }
      };
    },
    
    getHtmlElement(): HTMLElement | null {
      return document.getElementById('effects-container');
    }
  };
  
  // Preview generator implementation
  const preview: PreviewGenerator = {
    async generateThumbnail(effect: CardEffect, size: { width: number; height: number }): Promise<string> {
      // Placeholder implementation that would be completed with actual rendering
      return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
    },
    
    generatePreview(card: any, effects: CardEffect[]): React.ReactNode {
      // This would be implemented with actual card preview rendering
      return null;
    }
  };
  
  // Add an effect
  const addEffect = (effect: CardEffect): void => {
    setEffects(prev => {
      const newEffects = new Map(prev);
      newEffects.set(effect.id, effect);
      return newEffects;
    });
    
    success(
      "Effect added", 
      `${effect.name} has been added to the card.`
    );
  };
  
  // Remove an effect
  const removeEffect = (id: string): void => {
    setEffects(prev => {
      const newEffects = new Map(prev);
      const effect = newEffects.get(id);
      if (effect) {
        newEffects.delete(id);
        success(
          "Effect removed", 
          `${effect.name} has been removed from the card.`
        );
      }
      return newEffects;
    });
  };
  
  // Apply effects to a card element
  const applyEffects = (cardElement: HTMLElement, cardEffects: CardEffect[]): void => {
    try {
      const { cssClasses, effectData } = compositor.compose(cardEffects);
      
      // Apply CSS classes
      cardElement.className = `card ${cssClasses}`;
      
      // Store effect data as a data attribute
      cardElement.dataset.effects = JSON.stringify(effectData);
      
    } catch (e) {
      console.error('Error applying effects:', e);
      error(
        "Effect application failed", 
        "There was an error applying effects to the card."
      );
    }
  };
  
  // Update effect settings
  const updateSettings = (id: string, settings: Partial<CardEffectSettings>): void => {
    setEffects(prev => {
      const newEffects = new Map(prev);
      const effect = newEffects.get(id);
      
      if (effect) {
        newEffects.set(id, {
          ...effect,
          settings: {
            ...effect.settings,
            ...settings
          }
        });
        
        success(
          "Settings updated", 
          `${effect.name} settings have been updated.`
        );
      }
      
      return newEffects;
    });
  };
  
  // Get effect by ID
  const getEffectById = (id: string): CardEffect | undefined => {
    return effects.get(id);
  };
  
  // Create a preset
  const createPreset = (name: string, presetEffects: CardEffect[]): string => {
    const presetId = `preset-${Date.now()}`;
    
    // In a real implementation, this would save to localStorage or a database
    localStorage.setItem(presetId, JSON.stringify({
      id: presetId,
      name,
      effects: presetEffects
    }));
    
    success(
      "Preset created", 
      `${name} preset has been created.`
    );
    
    return presetId;
  };
  
  // Load a preset
  const loadPreset = (presetId: string): CardEffect[] => {
    // In a real implementation, this would load from localStorage or a database
    const presetStr = localStorage.getItem(presetId);
    
    if (presetStr) {
      try {
        const preset = JSON.parse(presetStr);
        const presetEffects: CardEffect[] = preset.effects;
        
        success(
          "Preset loaded", 
          `${preset.name} preset has been loaded.`
        );
        
        return presetEffects;
      } catch (e) {
        error(
          "Error loading preset", 
          "The preset could not be loaded."
        );
      }
    }
    
    return [];
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      webGLRenderer.dispose();
    };
  }, []);
  
  // Return the effect engine
  return {
    effects,
    compositor,
    renderer: webGLRenderer,
    preview,
    addEffect,
    removeEffect,
    applyEffects,
    updateSettings,
    getEffectById,
    createPreset,
    loadPreset
  };
};

export default useCardEffectsEngine;
