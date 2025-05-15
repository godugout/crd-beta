
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CardEffect, CardEffectSettings, EffectEngine, CardEffectsResult } from '@/lib/types/cardEffects';
import { useToast } from '@/hooks/use-toast-helper';

class EffectCompositorImpl {
  private rootElement: HTMLElement | null = null;
  
  compose(effects: CardEffect[]): CardEffectsResult {
    // Combine all effects into a single result
    const cssClasses = effects
      .filter(effect => effect.enabled)
      .map(effect => effect.className || `effect-${effect.id.toLowerCase()}`)
      .join(' ');
    
    // Gather effect data for each effect
    const effectData: Record<string, any> = {};
    effects.forEach(effect => {
      if (effect.enabled) {
        effectData[effect.id] = {
          ...effect.settings,
          enabled: true
        };
      }
    });
    
    return {
      cssClasses,
      effectData
    };
  }
  
  layerEffects(primary: CardEffect, secondary: CardEffect): CardEffect {
    // Create a new composite effect from two effects
    return {
      id: `${primary.id}-${secondary.id}`,
      name: `${primary.name} + ${secondary.name}`,
      enabled: true,
      settings: {
        ...primary.settings,
        ...secondary.settings,
        intensity: (primary.settings.intensity || 1) * 0.7 + (secondary.settings.intensity || 1) * 0.3
      },
      className: `${primary.className || ''} ${secondary.className || ''}`
    };
  }
  
  getHtmlElement(): HTMLElement | null {
    return this.rootElement;
  }
  
  setRootElement(element: HTMLElement | null) {
    this.rootElement = element;
  }
}

class WebGLRendererImpl implements THREE.WebGLRenderer {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.Camera | null = null;
  private shaderMaterials: Map<string, THREE.ShaderMaterial> = new Map();
  
  initialize(canvas: HTMLCanvasElement): void {
    // Set up THREE.js renderer
    this.renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true,
      alpha: true
    });
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    this.camera.position.z = 5;
    
    // Create basic scene
    const geometry = new THREE.PlaneGeometry(2, 3);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    this.renderer.setSize(canvas.width, canvas.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
  
  applyShader(effect: CardEffect): void {
    if (!this.scene) return;
    
    // Create or update shader material based on effect
    let material = this.shaderMaterials.get(effect.id);
    
    if (!material) {
      // Create new shader material for this effect
      const shaderCode = this.getShaderForEffect(effect);
      
      material = new THREE.ShaderMaterial({
        vertexShader: shaderCode.vertexShader,
        fragmentShader: shaderCode.fragmentShader,
        uniforms: {
          time: { value: 0.0 },
          intensity: { value: effect.settings.intensity || 1.0 },
          speed: { value: effect.settings.speed || 1.0 },
          color: { value: new THREE.Color(effect.settings.color || '#ffffff') }
        },
        transparent: true
      });
      
      this.shaderMaterials.set(effect.id, material);
      
      // Create a mesh for this effect
      const geometry = new THREE.PlaneGeometry(2, 3);
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
    } else {
      // Update existing material uniforms
      material.uniforms.intensity.value = effect.settings.intensity || 1.0;
      material.uniforms.speed.value = effect.settings.speed || 1.0;
      if (effect.settings.color) {
        material.uniforms.color.value = new THREE.Color(effect.settings.color);
      }
    }
  }
  
  render(): void {
    if (!this.renderer || !this.scene || !this.camera) return;
    
    // Update time uniform for all shader materials
    const time = performance.now() * 0.001; // Convert to seconds
    this.shaderMaterials.forEach(material => {
      if (material.uniforms.time) {
        material.uniforms.time.value = time;
      }
    });
    
    this.renderer.render(this.scene, this.camera);
  }
  
  dispose(): void {
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // Dispose all materials and geometries
    this.shaderMaterials.forEach(material => {
      material.dispose();
    });
    this.shaderMaterials.clear();
  }
  
  private getShaderForEffect(effect: CardEffect): { vertexShader: string, fragmentShader: string } {
    // Return appropriate shader code based on effect type
    switch (effect.id) {
      case 'holographic':
        return {
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
            uniform float speed;
            uniform vec3 color;
            varying vec2 vUv;
            
            void main() {
              // Holographic rainbow effect
              float hue = vUv.x * 3.0 + vUv.y * 2.0 + time * speed;
              
              // Create rainbow color
              vec3 rainbow;
              float h = mod(hue, 1.0);
              float s = 0.8;
              float v = 0.9;
              
              // HSV to RGB conversion
              vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
              vec3 p = abs(fract(vec3(h) + K.xyz) * 6.0 - K.www);
              rainbow = v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
              
              // Apply intensity
              rainbow = mix(vec3(1.0), rainbow, intensity);
              
              // Create shimmer effect
              float shimmer = sin(vUv.y * 40.0 + time * 3.0) * 0.5 + 0.5;
              shimmer *= sin(vUv.x * 30.0 - time * 2.0) * 0.5 + 0.5;
              
              // Final color with opacity
              gl_FragColor = vec4(rainbow * color, shimmer * intensity * 0.7);
            }
          `
        };
      
      case 'prismatic':
        return {
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
            uniform float speed;
            uniform vec3 color;
            varying vec2 vUv;
            
            // Refraction function
            vec3 refract(vec2 p, float time) {
              float angle = atan(p.y - 0.5, p.x - 0.5);
              float dist = length(p - 0.5);
              
              // Refraction patterns
              float r = sin(dist * 10.0 - time * speed) * 0.5 + 0.5;
              float g = sin(dist * 8.0 - time * speed * 1.2 + 2.0) * 0.5 + 0.5;
              float b = sin(dist * 6.0 - time * speed * 0.8 + 4.0) * 0.5 + 0.5;
              
              return vec3(r, g, b);
            }
            
            void main() {
              // Generate refraction pattern
              vec3 refracted = refract(vUv, time);
              
              // Mix with base color
              vec3 finalColor = mix(color, refracted, intensity);
              
              // Add shimmer effect
              float shimmer = sin(vUv.y * 30.0 + time * 2.0) * 0.5 + 0.5;
              
              gl_FragColor = vec4(finalColor, shimmer * intensity * 0.8);
            }
          `
        };
      
      case 'metallic':
        return {
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            
            void main() {
              vUv = uv;
              vNormal = normal;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform float intensity;
            uniform float speed;
            uniform vec3 color;
            varying vec2 vUv;
            varying vec3 vNormal;
            
            void main() {
              // Simulate light reflection on metallic surface
              vec3 lightDir = normalize(vec3(sin(time * speed * 0.5), cos(time * speed * 0.5), 1.0));
              float diffuse = max(0.0, dot(vNormal, lightDir));
              
              // Metallic sheen
              float specular = pow(diffuse, 20.0) * intensity;
              vec3 base = mix(color * 0.7, vec3(1.0), 0.2);
              vec3 highlight = mix(base, vec3(1.0), specular);
              
              // Metallic texture
              float pattern = sin(vUv.x * 50.0) * sin(vUv.y * 50.0) * 0.05;
              
              gl_FragColor = vec4(highlight + pattern, 1.0);
            }
          `
        };
        
      default:
        // Default simple shader
        return {
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
            uniform vec3 color;
            varying vec2 vUv;
            
            void main() {
              gl_FragColor = vec4(color * intensity, 0.5);
            }
          `
        };
    }
  }
}

class PreviewGeneratorImpl {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  
  constructor() {
    // Create offscreen canvas for thumbnails
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }
  
  async generateThumbnail(effect: CardEffect, size: { width: number; height: number }): Promise<string> {
    if (!this.canvas || !this.ctx) {
      throw new Error("Preview generator not properly initialized");
    }
    
    // Set canvas size
    this.canvas.width = size.width;
    this.canvas.height = size.height;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, size.width, size.height);
    
    // Draw a simple preview based on effect type
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, size.width, size.height);
    
    // Draw effect visual signature
    switch (effect.id) {
      case 'holographic':
        this.drawHolographicPreview(effect.settings);
        break;
      case 'prismatic':
        this.drawPrismaticPreview(effect.settings);
        break;
      case 'metallic':
        this.drawMetallicPreview(effect.settings);
        break;
      default:
        // Draw generic preview
        this.ctx.fillStyle = effect.settings.color || '#7B68EE';
        this.ctx.fillRect(10, 10, size.width - 20, size.height - 20);
    }
    
    // Convert canvas to data URL
    return this.canvas.toDataURL('image/png');
  }
  
  generatePreview(card: any, effects: CardEffect[]): React.ReactNode {
    // This would return a React component that shows a preview
    // In a real implementation, you would return a Component
    return null;
  }
  
  private drawHolographicPreview(settings: CardEffectSettings): void {
    if (!this.ctx || !this.canvas) return;
    
    const { width, height } = this.canvas;
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    
    // Add rainbow colors
    gradient.addColorStop(0, 'rgba(255, 0, 255, 0.7)');
    gradient.addColorStop(0.2, 'rgba(0, 255, 255, 0.7)');
    gradient.addColorStop(0.4, 'rgba(0, 255, 0, 0.7)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 0, 0.7)');
    gradient.addColorStop(0.8, 'rgba(255, 0, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 0, 255, 0.7)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    
    // Add shimmer lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < height; i += 5) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(width, i);
      this.ctx.stroke();
    }
  }
  
  private drawPrismaticPreview(settings: CardEffectSettings): void {
    if (!this.ctx || !this.canvas) return;
    
    const { width, height } = this.canvas;
    
    // Create radial gradient
    const gradient = this.ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, width / 2
    );
    
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
    gradient.addColorStop(0.33, 'rgba(0, 255, 0, 0.7)');
    gradient.addColorStop(0.66, 'rgba(0, 0, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0.7)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    
    // Add prism effect
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < Math.max(width, height); i += 20) {
      this.ctx.beginPath();
      this.ctx.arc(width / 2, height / 2, i, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }
  
  private drawMetallicPreview(settings: CardEffectSettings): void {
    if (!this.ctx || !this.canvas) return;
    
    const { width, height } = this.canvas;
    
    // Metallic base color
    this.ctx.fillStyle = settings.color || '#CCCCCC';
    this.ctx.fillRect(0, 0, width, height);
    
    // Add metallic shine
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    
    // Add texture
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < width; i += 5) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, height);
      this.ctx.stroke();
    }
  }
}

// Main Effect Engine implementation
class CardEffectEngineImpl implements EffectEngine {
  effects: Map<string, CardEffect> = new Map();
  compositor: EffectCompositorImpl;
  renderer: WebGLRendererImpl;
  preview: PreviewGeneratorImpl;
  presets: Map<string, CardEffect[]> = new Map();
  private animationFrame: number | null = null;
  
  constructor() {
    this.compositor = new EffectCompositorImpl();
    this.renderer = new WebGLRendererImpl();
    this.preview = new PreviewGeneratorImpl();
    
    // Initialize with default effects
    this.initializeDefaultEffects();
  }
  
  private initializeDefaultEffects(): void {
    // Add built-in effects
    const holographic: CardEffect = {
      id: 'holographic',
      name: 'Holographic',
      enabled: false,
      settings: {
        intensity: 1.0,
        speed: 1.0,
        pattern: 'rainbow',
        color: '#ffffff',
        animationEnabled: true
      }
    };
    
    const prismatic: CardEffect = {
      id: 'prismatic',
      name: 'Prismatic',
      enabled: false,
      settings: {
        intensity: 0.8,
        speed: 0.7,
        pattern: 'radial',
        color: '#00ffff',
        animationEnabled: true
      }
    };
    
    const metallic: CardEffect = {
      id: 'metallic',
      name: 'Metallic',
      enabled: false,
      settings: {
        intensity: 0.9,
        speed: 0.5,
        color: '#c0c0c0',
        animationEnabled: true
      }
    };
    
    this.addEffect(holographic);
    this.addEffect(prismatic);
    this.addEffect(metallic);
    
    // Create default presets
    this.createPreset('Premium', [holographic, prismatic]);
    this.createPreset('Vintage', [metallic]);
  }
  
  addEffect(effect: CardEffect): void {
    this.effects.set(effect.id, effect);
  }
  
  removeEffect(id: string): void {
    this.effects.delete(id);
  }
  
  applyEffects(cardElement: HTMLElement, effects: CardEffect[]): void {
    // Set this element as the root for the compositor
    this.compositor.setRootElement(cardElement);
    
    // Apply CSS classes from effect compositor
    const result = this.compositor.compose(effects);
    cardElement.className = `${cardElement.className} ${result.cssClasses}`.trim();
    
    // Set data attributes for effect parameters
    Object.entries(result.effectData).forEach(([key, value]) => {
      cardElement.setAttribute(`data-effect-${key}`, JSON.stringify(value));
    });
    
    // Start the animation loop if any effect has animation enabled
    const hasAnimations = effects.some(
      effect => effect.enabled && effect.settings.animationEnabled
    );
    
    if (hasAnimations) {
      this.startAnimationLoop(cardElement);
    } else {
      this.stopAnimationLoop();
    }
  }
  
  updateSettings(id: string, settings: Partial<CardEffectSettings>): void {
    const effect = this.effects.get(id);
    if (effect) {
      this.effects.set(id, {
        ...effect,
        settings: {
          ...effect.settings,
          ...settings
        }
      });
    }
  }
  
  getEffectById(id: string): CardEffect | undefined {
    return this.effects.get(id);
  }
  
  createPreset(name: string, effects: CardEffect[]): string {
    const id = `preset-${name.toLowerCase().replace(/\s+/g, '-')}`;
    this.presets.set(id, [...effects]);
    return id;
  }
  
  loadPreset(presetId: string): CardEffect[] {
    return this.presets.get(presetId) || [];
  }
  
  private startAnimationLoop(element: HTMLElement): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    const animate = () => {
      // Render WebGL effects if initialized
      this.renderer.render();
      
      // Animation for CSS-based effects
      this.updateCssAnimations(element);
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    this.animationFrame = requestAnimationFrame(animate);
  }
  
  private stopAnimationLoop(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  private updateCssAnimations(element: HTMLElement): void {
    // This would update CSS variables for animations
    const time = performance.now() * 0.001;
    element.style.setProperty('--effect-time', time.toString());
    element.style.setProperty('--effect-sin-time', Math.sin(time).toString());
    element.style.setProperty('--effect-cos-time', Math.cos(time).toString());
  }
}

// React hook to use the card effect engine
export function useCardEffectsEngine() {
  const [engine] = useState<CardEffectEngineImpl>(() => new CardEffectEngineImpl());
  const [activeEffects, setActiveEffects] = useState<CardEffect[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const toast = useToast();
  
  // Initialize WebGL renderer when canvas is available
  useEffect(() => {
    if (canvasRef.current) {
      try {
        engine.renderer.initialize(canvasRef.current);
        console.log("WebGL renderer initialized successfully");
      } catch (error) {
        console.error("Failed to initialize WebGL renderer:", error);
        toast.error("Failed to initialize effects", "WebGL rendering is not available on this device");
      }
    }
    
    return () => {
      engine.renderer.dispose();
    };
  }, [engine, toast]);
  
  // Apply effects to card element when active effects change
  useEffect(() => {
    if (cardRef.current && activeEffects.length > 0) {
      engine.applyEffects(cardRef.current, activeEffects);
    }
  }, [engine, activeEffects]);
  
  const toggleEffect = (id: string) => {
    const effect = engine.getEffectById(id);
    if (!effect) return;
    
    const isActive = activeEffects.some(e => e.id === id);
    
    if (isActive) {
      setActiveEffects(activeEffects.filter(e => e.id !== id));
    } else {
      const updatedEffect = { ...effect, enabled: true };
      setActiveEffects([...activeEffects, updatedEffect]);
    }
  };
  
  const updateEffectSettings = (id: string, settings: Partial<CardEffectSettings>) => {
    // Update in engine
    engine.updateSettings(id, settings);
    
    // Update active effects if this effect is active
    setActiveEffects(prev => 
      prev.map(effect => 
        effect.id === id ? { ...effect, settings: { ...effect.settings, ...settings } } : effect
      )
    );
  };
  
  const applyPreset = (presetId: string) => {
    const presetEffects = engine.loadPreset(presetId);
    if (presetEffects.length > 0) {
      // Enable all effects in the preset
      setActiveEffects(presetEffects.map(effect => ({ ...effect, enabled: true })));
      toast.success("Preset Applied", `Applied ${presetEffects.length} effects`);
    } else {
      toast.warning("Invalid Preset", "The selected preset could not be found");
    }
  };
  
  return {
    engine,
    activeEffects,
    setActiveEffects,
    toggleEffect,
    updateEffectSettings,
    applyPreset,
    canvasRef,
    cardRef
  };
}
