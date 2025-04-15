
import { EnhancedCropBoxProps, MemorabiliaType } from '../types/detectionTypes';
import { calculateCardDimensions } from './dimensionsUtil';

export async function applyCrop(
  cropBox: EnhancedCropBoxProps,
  canvas: HTMLCanvasElement | null,
  originalFile: File,
  image: HTMLImageElement,
  enhancementType?: MemorabiliaType
): Promise<{ file: File; url: string } | null> {
  if (!canvas) {
    console.error('Canvas is null');
    return null;
  }
  
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return null;
    }
    
    let width = cropBox.width;
    let height = cropBox.height;
    
    if (enhancementType === 'card') {
      const cardDimensions = calculateCardDimensions(width, height);
      width = cardDimensions.width;
      height = cardDimensions.height;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const cropCenterX = width / 2;
    const cropCenterY = height / 2;
    
    ctx.save();
    ctx.translate(cropCenterX, cropCenterY);
    
    if (cropBox.rotation) {
      ctx.rotate((cropBox.rotation * Math.PI) / 180);
    }
    
    ctx.drawImage(
      image,
      cropBox.x,
      cropBox.y,
      width,
      height,
      -width / 2,
      -height / 2,
      width,
      height
    );
    
    ctx.restore();
    
    if (enhancementType) {
      applyEnhancement(ctx, canvas.width, canvas.height, enhancementType);
    }
    
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          return null;
        }
        resolve(blob);
      }, 'image/png', 0.95);
    });
    
    let filename = originalFile.name;
    if (enhancementType === 'card') {
      const baseName = originalFile.name.split('.').slice(0, -1).join('.');
      filename = `${baseName}-extracted-card-${Date.now()}.png`;
    }
    
    const url = URL.createObjectURL(blob);
    const file = new File([blob], filename, { type: 'image/png' });
    
    return { file, url };
  } catch (error) {
    console.error('Error applying crop:', error);
    return null;
  }
}

function applyEnhancement(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  type: MemorabiliaType
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  if (type === 'card') {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));
      data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * 1.2 + 128));
      data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * 1.2 + 128));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}
