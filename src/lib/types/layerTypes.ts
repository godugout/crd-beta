
// Layer types for card exploded view
export interface LayerInfo {
  id: string;
  name: string;
  type: 'image' | 'text' | 'graphic' | 'foil' | 'texture' | 'border' | 'custom';
  description?: string;
  position: number; // Position in the layer stack (0 = back, higher = front)
  opacity: number;
  visible: boolean;
  annotations?: Annotation[];
  color?: string;
  texture?: string;
  material?: Material;
}

export interface LayerGroup {
  id: string;
  name: string;
  layerIds: string[];
  isExpanded?: boolean;
}

export interface Annotation {
  id: string;
  title: string;
  description: string;
  position: { x: number; y: number; z: number };
  icon?: string;
}

export interface Material {
  name: string;
  reflectivity?: number;
  roughness?: number;
  metalness?: number;
  transparency?: number;
  color?: string;
}

export interface ExplodedViewSettings {
  active: boolean;
  explosionDistance: number;
  explosionType: 'vertical' | 'radial' | 'custom';
  selectedLayerId: string | null;
  visibleLayerIds: string[];
  specialView: 'normal' | 'cross-section' | 'wireframe' | 'xray' | 'timeline';
  animated: boolean;
  annotationsVisible: boolean;
}
