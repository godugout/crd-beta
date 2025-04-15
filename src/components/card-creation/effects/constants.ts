
export const AVAILABLE_EFFECTS = [
  { name: 'Refractor', description: 'Adds a refractive, prismatic effect to the card' },
  { name: 'Holographic', description: 'Adds holographic patterns that shift with perspective' },
  { name: 'Glossy', description: 'Adds a glossy, reflective finish to the card' },
  { name: 'Matte', description: 'Gives the card a premium matte finish' },
  { name: 'Foil', description: 'Adds foil accents to the card' },
  { name: 'Shadow', description: 'Adds depth with shadow effects' }
];

export const getDefaultEffectSettings = (effectName: string): any => {
  switch (effectName) {
    case 'Refractor':
      return { intensity: 'medium', angle: 45 };
    case 'Holographic':
      return { pattern: 'lines', speed: 0.5 };
    case 'Glossy':
      return { level: 'medium', highlight: '#ffffff' };
    case 'Foil':
      return { color: 'rainbow', coverage: 0.5 };
    case 'Shadow':
      return { depth: 'medium', blur: 10, color: 'rgba(0,0,0,0.5)' };
    default:
      return {};
  }
};
