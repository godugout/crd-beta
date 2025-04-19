
// Fixed line 323 - use valid processing option properties
// This is a partial update fixing only the TypeScript error

const enhanceStadiumPhoto = async (imageData: ImageData | Blob): Promise<ImageData | Blob> => {
    const options = {
      brightnessFix: true, 
      contrastEnhance: true,
      dynamicRangeExpansion: true,
      // Fixed: Use a valid property name that exists in ProcessingOptions
      enhanceLighting: true // Instead of stadiumLightingFix
    };
    
    return processImage(imageData, options);
};
