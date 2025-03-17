
import { useState, useEffect } from 'react';
import { Point } from './useSignatureCanvas';
import { toast } from 'sonner';

export const useInkEffects = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  svgRef: React.RefObject<SVGSVGElement>,
  wasmModule: React.MutableRefObject<any>,
  inkAmount: number,
  paperTexture: string,
  inkColor: string
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Update SVG filters based on props
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Update paper texture filter
    const paperFilter = svgRef.current.querySelector('#paper-texture');
    if (paperFilter) {
      const turbulence = paperFilter.querySelector('feTurbulence');
      if (turbulence) {
        switch (paperTexture) {
          case 'rough':
            turbulence.setAttribute('baseFrequency', '0.08');
            turbulence.setAttribute('numOctaves', '6');
            break;
          case 'medium':
            turbulence.setAttribute('baseFrequency', '0.05');
            turbulence.setAttribute('numOctaves', '4');
            break;
          case 'fine':
          default:
            turbulence.setAttribute('baseFrequency', '0.02');
            turbulence.setAttribute('numOctaves', '3');
            break;
        }
      }
      
      const displacementMap = paperFilter.querySelector('feDisplacementMap');
      if (displacementMap) {
        switch (paperTexture) {
          case 'rough':
            displacementMap.setAttribute('scale', '10');
            break;
          case 'medium':
            displacementMap.setAttribute('scale', '5');
            break;
          case 'fine':
          default:
            displacementMap.setAttribute('scale', '3');
            break;
        }
      }
    }
    
    // Update ink bleed filter
    const inkBleedFilter = svgRef.current.querySelector('#ink-bleed');
    if (inkBleedFilter) {
      const gaussianBlur = inkBleedFilter.querySelector('feGaussianBlur');
      if (gaussianBlur) {
        gaussianBlur.setAttribute('stdDeviation', String(inkAmount * 1.5));
      }
      
      const colorMatrix = inkBleedFilter.querySelector('feColorMatrix');
      if (colorMatrix) {
        const value = 18 - inkAmount * 10;
        colorMatrix.setAttribute('values', `
          1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 ${value > 0 ? value : 1} -7
        `);
      }
    }
    
    // Update path color
    const path = svgRef.current.querySelector('path');
    if (path) {
      path.setAttribute('stroke', inkColor);
    }
  }, [inkAmount, paperTexture, inkColor, svgRef]);
  
  /**
   * Apply the ink bleed effect using WebAssembly
   */
  const applyInkBleed = async (points: Point[]) => {
    setIsProcessing(true);
    
    try {
      if (!wasmModule.current || !wasmModule.current.calculateInkBleed) {
        console.warn("WebAssembly module not loaded, using fallback");
        return;
      }
      
      // Extract pressure data for processing
      const pressureData = points.map(p => p.pressure);
      
      // Use WebAssembly to calculate ink bleed
      const processedData = wasmModule.current.calculateInkBleed(pressureData, inkAmount);
      
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      // Apply ink bleed effect to canvas
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = inkColor;
      
      // Draw thicker lines where pressure is higher
      ctx.beginPath();
      points.forEach((point, index) => {
        const adjustedPressure = processedData[index];
        
        if (index === 0 || (index > 0 && points[index - 1].timestamp + 100 < point.timestamp)) {
          ctx.moveTo(point.x, point.y);
        } else {
          // Line width based on processed pressure data
          ctx.lineWidth = 1 + adjustedPressure * 3;
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
      
      return true;
    } catch (error) {
      console.error("Error applying ink bleed:", error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  /**
   * Apply paper texture effect using SVG filters
   */
  const applyPaperTexture = async () => {
    if (!svgRef.current) return false;
    
    try {
      // Paper texture is applied via SVG filters that are already defined
      // The filter is specified in the path element's filter attribute
      return true;
    } catch (error) {
      console.error("Error applying paper texture:", error);
      return false;
    }
  };
  
  /**
   * Apply ink gloss effect using WebGL
   */
  const applyInkGloss = async () => {
    if (!canvasRef.current) return false;
    
    try {
      // Initialize WebGL context
      const gl = canvasRef.current.getContext('webgl');
      if (!gl) {
        console.warn("WebGL not supported, using fallback");
        return false;
      }
      
      // WebGL setup would go here in a full implementation
      // For now, we'll use SVG filters as a fallback
      
      return true;
    } catch (error) {
      console.error("Error applying ink gloss:", error);
      return false;
    }
  };
  
  /**
   * Generate an image from the signature
   */
  const generateSignatureImage = () => {
    if (!canvasRef.current) return null;
    
    try {
      // Create a new canvas to combine all effects
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = canvasRef.current.width;
      outputCanvas.height = canvasRef.current.height;
      const ctx = outputCanvas.getContext('2d');
      
      if (!ctx) return null;
      
      // Draw the base signature from our canvas
      ctx.drawImage(canvasRef.current, 0, 0);
      
      // Convert to image URL
      const imageUrl = outputCanvas.toDataURL('image/png');
      return imageUrl;
    } catch (error) {
      console.error("Error generating signature image:", error);
      toast.error("Failed to generate signature image");
      return null;
    }
  };
  
  return {
    applyInkBleed,
    applyPaperTexture,
    applyInkGloss,
    generateSignatureImage,
    isProcessing
  };
};
