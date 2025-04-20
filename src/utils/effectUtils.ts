
/**
 * Converts card effect names to CSS filter combinations
 */
export const convertEffectsToCSS = (
  effects: string[],
  intensities: Record<string, number> = {},
  qualityFactor: number = 1.0
): string => {
  const filters: string[] = [];
  
  // Apply effects based on their type
  effects.forEach(effect => {
    const effectName = effect.toLowerCase();
    const intensity = (intensities[effect] || 1.0) * qualityFactor;
    
    switch (effectName) {
      case 'shimmer':
      case 'foil':
        // Simpler shimmer effect with CSS only
        filters.push(`brightness(${1 + 0.15 * intensity})`);
        filters.push(`contrast(${1 + 0.1 * intensity})`);
        break;
      
      case 'holographic':
        // Simplified holographic effect
        filters.push(`saturate(${1.2 + 0.4 * intensity})`);
        filters.push(`brightness(${1 + 0.2 * intensity})`);
        filters.push(`contrast(${1 + 0.15 * intensity})`);
        break;
      
      case 'refractor':
      case 'prizm':
        // Simplified refractor effect
        filters.push(`saturate(${1.3 + 0.3 * intensity})`);
        filters.push(`contrast(${1.1 + 0.1 * intensity})`);
        filters.push(`brightness(${1.1 + 0.1 * intensity})`);
        break;
      
      case 'gold foil':
        // Gold effect
        filters.push(`sepia(${0.6 * intensity})`);
        filters.push(`saturate(${1.5 * intensity})`);
        filters.push(`brightness(${1.1 * intensity})`);
        break;
      
      case 'chrome':
        // Chrome effect
        filters.push(`contrast(${1.15 * intensity})`);
        filters.push(`brightness(${1.05 * intensity})`);
        filters.push(`grayscale(${0.2 * intensity})`);
        break;
      
      case 'vintage':
        // Vintage effect
        filters.push(`sepia(${0.4 * intensity})`);
        filters.push(`contrast(${1 + 0.1 * intensity})`);
        filters.push(`saturate(${0.9 * intensity})`);
        break;
        
      default:
        // No specific effect
        break;
    }
  });
  
  return filters.join(' ');
};

/**
 * Get appropriate lighting preset based on device capabilities
 */
export const getOptimizedLightingPreset = (
  preset: string,
  devicePerformance: 'high' | 'medium' | 'low' = 'medium'
): string => {
  // Fallback to simpler lighting on lower performance devices
  if (devicePerformance === 'low') {
    return 'basic';
  }
  
  // Map complex presets to simpler alternatives on medium performance
  if (devicePerformance === 'medium') {
    const simplifiedMap: Record<string, string> = {
      'studio': 'studio',
      'natural': 'sunset',
      'dramatic': 'studio',
      'display_case': 'sunset',
      'spotlight': 'sunset'
    };
    
    return simplifiedMap[preset.toLowerCase()] || 'studio';
  }
  
  // Return original preset for high performance devices
  return preset;
};
