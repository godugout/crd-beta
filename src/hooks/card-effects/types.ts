
export interface MaterialSimulation {
  /**
   * Type of material to simulate
   */
  type: 'canvas' | 'mesh' | 'synthetic';
  
  /**
   * Base color of the material
   */
  baseColor?: string;
  
  /**
   * URL to a texture image
   */
  textureUrl?: string;
  
  /**
   * Roughness of the material (0-1)
   * 0 = mirror-like, 1 = completely diffuse
   */
  roughness?: number;
  
  /**
   * Metalness of the material (0-1)
   * 0 = non-metal, 1 = metal
   */
  metalness?: number;
  
  /**
   * Weathering effect to apply
   */
  weathering?: 'new' | 'game-worn' | 'vintage';
  
  /**
   * Team colors for auto-extraction
   */
  teamColors?: string[];
}
