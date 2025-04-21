
/**
 * Creates a placeholder image when a texture fails to load
 * @param width Width of the placeholder image
 * @param height Height of the placeholder image
 * @param color Background color of the placeholder
 * @param text Text to display on the placeholder
 * @returns Data URL for the placeholder image
 */
export const createPlaceholderImage = (
  width = 512, 
  height = 512, 
  color = '#2a3042',
  text = 'Card Image'
): string => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Failed to get canvas context');
      return '';
    }
    
    // Fill background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // Draw border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    
    // Draw text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `${Math.floor(width / 20)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    
    // Add "Missing Image" text
    ctx.font = `${Math.floor(width / 30)}px sans-serif`;
    ctx.fillText('Missing Image', width / 2, height / 2 + 40);
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error creating placeholder image:', error);
    return '';
  }
};

/**
 * Creates a card back placeholder image
 */
export const createCardBackPlaceholder = (): string => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Failed to get canvas context');
      return '';
    }
    
    // Fill background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#1a2e44');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Draw pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 10; i++) {
      const offset = i * 50;
      ctx.beginPath();
      ctx.arc(256, 256, 50 + offset, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Draw center logo/text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CRD', 256, 256);
    
    ctx.font = '20px sans-serif';
    ctx.fillText('Card Back', 256, 300);
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error creating card back placeholder:', error);
    return '';
  }
};

export default createPlaceholderImage;
