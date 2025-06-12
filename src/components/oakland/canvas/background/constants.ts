
import { 
  Mountain, 
  Sunset, 
  Building, 
  Warehouse,
  Trees,
  Waves
} from 'lucide-react';

export const BACKGROUND_PRESETS = [
  { id: 'studio', name: 'Studio', icon: Building, description: 'Clean studio lighting' },
  { id: 'sunset', name: 'Sunset', icon: Sunset, description: 'Warm golden hour' },
  { id: 'warehouse', name: 'Warehouse', icon: Warehouse, description: 'Industrial space' },
  { id: 'forest', name: 'Forest', icon: Trees, description: 'Natural outdoor' },
  { id: 'city', name: 'City', icon: Building, description: 'Urban environment' },
  { id: 'ocean', name: 'Ocean', icon: Waves, description: 'Coastal scene' },
  { id: 'mountains', name: 'Mountains', icon: Mountain, description: 'Mountain vista' },
  { id: 'park', name: 'Park', icon: Trees, description: 'Baseball park' }
];

export const GRADIENT_PRESETS = [
  { name: 'Oakland Green', from: '#003831', to: '#EFB21E' },
  { name: 'Sunset', from: '#ff7e5f', to: '#feb47b' },
  { name: 'Ocean', from: '#00c6ff', to: '#0072ff' },
  { name: 'Forest', from: '#134e5e', to: '#71b280' },
  { name: 'Purple Sky', from: '#667eea', to: '#764ba2' },
  { name: 'Desert', from: '#f093fb', to: '#f5576c' }
];

export const SOLID_COLORS = [
  '#000000', 
  '#333333', 
  '#666666', 
  '#ffffff', 
  '#003831', 
  '#EFB21E'
];
