
/**
 * Adapter utilities for Fabric.js API compatibility
 * This helps handle differences between Fabric.js versions
 */

import { fabric } from 'fabric';

/**
 * Creates a fabric Image from a URL with proper error handling
 * @param url The image URL
 * @param options Options for loading the image
 * @returns Promise that resolves to a fabric.Image object
 */
export const createFabricImageFromUrl = (url: string, options: any = {}): Promise<fabric.Image> => {
  return new Promise((resolve, reject) => {
    // Use fromURL with proper callback handling
    fabric.Image.fromURL(
      url, 
      (img: fabric.Image) => {
        if (img) {
          resolve(img);
        } else {
          reject(new Error('Failed to create image from URL'));
        }
      },
      {
        crossOrigin: 'anonymous',
        ...options
      }
    );
  });
};

/**
 * Creates a fabric Image from an HTML element with proper error handling
 * @param element The HTML image element
 * @param options Options for creating the image
 * @returns Promise that resolves to a fabric.Image object
 */
export const createFabricImageFromElement = (
  element: HTMLImageElement, 
  options: any = {}
): Promise<fabric.Image> => {
  return new Promise((resolve, reject) => {
    try {
      // If the image isn't fully loaded, wait for it
      if (!element.complete) {
        element.onload = () => {
          createFabricImageFromUrl(element.src, options)
            .then(resolve)
            .catch(reject);
        };
        element.onerror = () => reject(new Error('Image failed to load'));
      } else {
        // Image is already loaded, use the URL approach
        createFabricImageFromUrl(element.src, options)
          .then(resolve)
          .catch(reject);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Safely creates an image from either URL or element
 * @param source URL string or HTML image element
 * @param options Options for creating the image
 * @returns Promise that resolves to a fabric.Image object
 */
export const createFabricImage = (
  source: string | HTMLImageElement,
  options: any = {}
): Promise<fabric.Image> => {
  if (typeof source === 'string') {
    return createFabricImageFromUrl(source, options);
  } else {
    return createFabricImageFromElement(source, options);
  }
};

/**
 * Debugging helper for fabric.js
 */
export const logFabricInfo = (canvas: fabric.Canvas | null) => {
  if (!canvas) {
    console.log('Fabric canvas not initialized');
    return;
  }
  
  console.log('Fabric canvas info:', {
    width: canvas.getWidth(),
    height: canvas.getHeight(),
    objects: canvas.getObjects().length,
    version: fabric.version
  });
  
  // Log each object
  canvas.getObjects().forEach((obj, idx) => {
    console.log(`Object ${idx}:`, {
      type: obj.type,
      visible: obj.visible,
      left: obj.left,
      top: obj.top
    });
  });
};
