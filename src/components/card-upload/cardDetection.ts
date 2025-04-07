import * as ort from 'onnxruntime-web';
import { CropBoxProps, EnhancedCropBoxProps } from '../CropBox';
import { v4 as uuidv4 } from 'uuid';

// Define the types for the metadata
interface Metadata {
  labels: string[];
  confidenceThreshold: number;
  iouThreshold: number;
}

let metadata: Metadata | null = null;

// Load the ONNX model and metadata
const loadModel = async (): Promise<ort.InferenceSession> => {
  try {
    const modelUrl = '/models/yolov8n-face.onnx';
    const session = await ort.InferenceSession.create(modelUrl, {
      executionProviders: ['webgl'],
      graphOptimizationLevel: 'all',
    });
    return session;
  } catch (error) {
    console.error('Failed to load ONNX model:', error);
    throw error;
  }
};

const loadMetadata = async (): Promise<Metadata> => {
  try {
    const metadataUrl = '/models/metadata.json';
    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return {
      labels: data.labels || [],
      confidenceThreshold: data.confidenceThreshold || 0.7,
      iouThreshold: data.iouThreshold || 0.7,
    };
  } catch (error) {
    console.error('Failed to load metadata:', error);
    // Provide default values to allow the app to function
    return {
      labels: [],
      confidenceThreshold: 0.7,
      iouThreshold: 0.7,
    };
  }
};

// Preprocess the image
const preprocessImage = (image: HTMLImageElement): ort.Tensor => {
  const modelInputWidth = 640;
  const modelInputHeight = 640;

  // Resize the image to the model input size
  const resizedImage = document.createElement('canvas');
  resizedImage.width = modelInputWidth;
  resizedImage.height = modelInputHeight;
  const ctx = resizedImage.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get context from the resized image canvas');
  }
  ctx.drawImage(image, 0, 0, modelInputWidth, modelInputHeight);

  // Get the image data from the resized image
  const imageData = ctx.getImageData(0, 0, modelInputWidth, modelInputHeight);
  const data = imageData.data;

  // Normalize the image data and convert to float32 array
  const float32Data = new Float32Array(modelInputWidth * modelInputHeight * 3);
  for (let i = 0; i < data.length; i += 4) {
    float32Data[i / 4 * 3] = data[i] / 255.0;       // Red
    float32Data[i / 4 * 3 + 1] = data[i + 1] / 255.0; // Green
    float32Data[i / 4 * 3 + 2] = data[i + 2] / 255.0; // Blue
  }

  // Create the tensor
  const inputTensor = new ort.Tensor('float32', float32Data, [1, 3, modelInputHeight, modelInputWidth]);
  return inputTensor;
};

// Postprocess the model output
const postprocessOutput = (
  outputTensor: ort.Tensor,
  imageWidth: number,
  imageHeight: number
): EnhancedCropBoxProps[] => {
  if (!metadata) {
    console.warn('Metadata not loaded, using default values.');
    return [];
  }

  const modelInputWidth = 640;
  const modelInputHeight = 640;
  const confidenceThreshold = metadata.confidenceThreshold;
  const iouThreshold = metadata.iouThreshold;
  const labels = metadata.labels;

  const outputData = outputTensor.data as Float32Array;
  const numRows = outputTensor.dims[1];

  const boxes: {
    box: { x1: number; y1: number; x2: number; y2: number; };
    classProbabilities: number[];
  }[] = [];

  for (let i = 0; i < numRows; i++) {
    const classProbabilities = outputData.slice(i * 85 + 4, i * 85 + 84);
    const maxProbability = Math.max(...classProbabilities);

    if (maxProbability > confidenceThreshold) {
      const x = outputData[i * 85];
      const y = outputData[i * 85 + 1];
      const w = outputData[i * 85 + 2];
      const h = outputData[i * 85 + 3];

      const x1 = (x - w / 2) * imageWidth / modelInputWidth;
      const y1 = (y - h / 2) * imageHeight / modelInputHeight;
      const x2 = (x + w / 2) * imageWidth / modelInputWidth;
      const y2 = (y + h / 2) * imageHeight / modelInputHeight;

      boxes.push({
        box: { x1, y1, x2, y2 },
        classProbabilities: Array.from(classProbabilities)
      });
    }
  }

  // Apply Non-Maximum Suppression (NMS)
  const selectedBoxes = nms(boxes, iouThreshold);

  // Convert selected boxes to CropBoxProps
  const cropBoxes: EnhancedCropBoxProps[] = selectedBoxes.map(box => {
    const classIndex = box.classProbabilities.indexOf(Math.max(...box.classProbabilities));
    const label = labels[classIndex] || 'unknown';
    const confidence = box.classProbabilities[classIndex];

    const width = box.box.x2 - box.box.x1;
    const height = box.box.y2 - box.box.y1;

    return {
      id: Math.floor(Math.random() * 10000),
      x: box.box.x1,
      y: box.box.y1,
      width: width,
      height: height,
      rotation: 0,
      color: '#00FF00',
      memorabiliaType: label as MemorabiliaType,
      confidence: confidence
    };
  });

  return cropBoxes;
};

// Non-Maximum Suppression (NMS)
const nms = (
  boxes: {
    box: { x1: number; y1: number; x2: number; y2: number; };
    classProbabilities: number[];
  }[],
  iouThreshold: number
): {
  box: { x1: number; y1: number; x2: number; y2: number; };
  classProbabilities: number[];
}[] => {
  const selectedBoxes: {
    box: { x1: number; y1: number; x2: number; y2: number; };
    classProbabilities: number[];
  }[] = [];

  const sortedBoxes = boxes.sort((a, b) => Math.max(...b.classProbabilities) - Math.max(...a.classProbabilities));

  while (sortedBoxes.length > 0) {
    const bestBox = sortedBoxes.shift()!;
    selectedBoxes.push(bestBox);

    // Filter out boxes that overlap too much with the best box
    for (let i = sortedBoxes.length - 1; i >= 0; i--) {
      if (iou(bestBox.box, sortedBoxes[i].box) > iouThreshold) {
        sortedBoxes.splice(i, 1);
      }
    }
  }

  return selectedBoxes;
};

// Intersection over Union (IoU)
const iou = (box1: { x1: number; y1: number; x2: number; y2: number; }, box2: { x1: number; y1: number; x2: number; y2: number; }): number => {
  const intersectionX1 = Math.max(box1.x1, box2.x1);
  const intersectionY1 = Math.max(box1.y1, box2.y1);
  const intersectionX2 = Math.min(box1.x2, box2.x2);
  const intersectionY2 = Math.min(box1.y2, box2.y2);

  const intersectionWidth = Math.max(0, intersectionX2 - intersectionX1);
  const intersectionHeight = Math.max(0, intersectionY2 - intersectionY1);

  const intersectionArea = intersectionWidth * intersectionHeight;

  const box1Area = (box1.x2 - box1.x1) * (box1.y2 - box1.y1);
  const box2Area = (box2.x2 - box2.x1) * (box2.y2 - box2.y1);

  const unionArea = box1Area + box2Area - intersectionArea;

  return intersectionArea / unionArea;
};

export type MemorabiliaType = 'card' | 'ticket' | 'program' | 'autograph' | 'face' | 'unknown';

/**
 * Applies crop to an image based on cropbox dimensions
 */
export const applyCrop = async (
  image: HTMLImageElement,
  cropBox: { 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
    rotation: number; 
    memorabiliaType?: MemorabiliaType 
  },
  canvasRef: React.RefObject<HTMLCanvasElement>,
  autoEnhance: boolean = false
): Promise<{ url: string; file: File }> => {
  if (!canvasRef.current) {
    throw new Error("Canvas reference not available");
  }

  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Set canvas size to the crop dimensions
  canvas.width = cropBox.width;
  canvas.height = cropBox.height;
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Save the current context state
  ctx.save();
  
  // If there's rotation, we need to handle it
  if (cropBox.rotation && cropBox.rotation !== 0) {
    // Translate to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    // Rotate by the negative of the crop box rotation (to straighten the card)
    ctx.rotate(-cropBox.rotation * Math.PI / 180);
    // Draw the image centered and cropped
    ctx.drawImage(
      image,
      cropBox.x - canvas.width / 2 + cropBox.width / 2,
      cropBox.y - canvas.height / 2 + cropBox.height / 2,
      cropBox.width,
      cropBox.height,
      -cropBox.width / 2,
      -cropBox.height / 2,
      cropBox.width,
      cropBox.height
    );
  } else {
    // No rotation, just draw the cropped region
    ctx.drawImage(
      image,
      cropBox.x,
      cropBox.y,
      cropBox.width,
      cropBox.height,
      0,
      0,
      cropBox.width,
      cropBox.height
    );
  }
  
  // Restore the context state
  ctx.restore();
  
  // Apply auto-enhancement if requested
  if (autoEnhance) {
    applyEnhancement(ctx, cropBox, canvas.width, canvas.height);
  }
  
  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.95);
  });
  
  // Create a file from the blob
  const fileName = `cropped-${cropBox.memorabiliaType || 'image'}-${Date.now()}.jpg`;
  const file = new File([blob], fileName, { type: 'image/jpeg' });
  
  // Create URL for preview
  const url = URL.createObjectURL(blob);
  
  return { url, file };
};

/**
 * Apply enhancement filters based on memorabilia type
 */
function applyEnhancement(
  ctx: CanvasRenderingContext2D, 
  cropBox: { memorabiliaType?: MemorabiliaType }, 
  width: number, 
  height: number
) {
  // Get image data to manipulate
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  switch (cropBox.memorabiliaType) {
    case 'card':
      // Enhance card images - increase contrast and saturation
      for (let i = 0; i < data.length; i += 4) {
        // Increase contrast
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));
        data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * 1.2 + 128));
        data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * 1.2 + 128));
      }
      break;
      
    case 'autograph':
      // Enhance autographs by increasing contrast and darkening lines
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i+1] + data[i+2]) / 3;
        if (avg < 100) {
          // Darken dark areas (signatures)
          data[i] = data[i] * 0.7;
          data[i+1] = data[i+1] * 0.7;
          data[i+2] = data[i+2] * 0.7;
        } else {
          // Lighten light areas (background)
          data[i] = Math.min(255, data[i] * 1.1);
          data[i+1] = Math.min(255, data[i+1] * 1.1);
          data[i+2] = Math.min(255, data[i+2] * 1.1);
        }
      }
      break;
      
    case 'face':
      // Subtle enhancement for faces - soften and slightly brighten
      for (let i = 0; i < data.length; i += 4) {
        // Slightly brighter
        data[i] = Math.min(255, data[i] * 1.05);
        data[i+1] = Math.min(255, data[i+1] * 1.05);
        data[i+2] = Math.min(255, data[i+2] * 1.05);
      }
      break;
      
    default:
      // Default enhancement - minor contrast adjustment
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.1 + 128));
        data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * 1.1 + 128));
        data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * 1.1 + 128));
      }
      break;
  }
  
  // Put modified image data back on canvas
  ctx.putImageData(imageData, 0, 0);
}

// Detect cards in the image
export const detectCardsInImage = async (image: HTMLImageElement): Promise<EnhancedCropBoxProps[]> => {
  try {
    // Load the model and metadata if not already loaded
    if (!metadata) {
      metadata = await loadMetadata();
    }
    const session = await loadModel();

    // Preprocess the image
    const inputTensor = preprocessImage(image);

    // Run the inference session
    const outputMap = await session.run({ images: inputTensor });
    const outputTensor = outputMap.output0;

    // Postprocess the output
    const cropBoxes = postprocessOutput(outputTensor, image.width, image.height);
    return cropBoxes;
  } catch (error) {
    console.error('Error detecting cards in image:', error);
    return [];
  }
};
