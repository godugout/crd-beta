
import { CardEffectSettings } from '@/lib/types/cardTypes';

/**
 * Apply a card effect to an HTML element
 */
export const applyCardEffect = (
  element: HTMLElement, 
  effectId: string, 
  settings: CardEffectSettings = {}
): void => {
  // Simple implementation for now
  element.classList.add(`effect-${effectId}`);
  
  // Add data attributes for effect settings
  Object.entries(settings).forEach(([key, value]) => {
    element.dataset[`effect${key.charAt(0).toUpperCase() + key.slice(1)}`] = String(value);
  });
  
  // Set CSS variables for the effect
  if (settings.intensity !== undefined) {
    element.style.setProperty(`--${effectId}-intensity`, String(settings.intensity));
  }
  
  if (settings.speed !== undefined) {
    element.style.setProperty(`--motion-speed`, String(settings.speed));
  }
};

/**
 * Remove a card effect from an HTML element
 */
export const removeCardEffect = (element: HTMLElement, effectId: string): void => {
  element.classList.remove(`effect-${effectId}`);
  
  // Clean up CSS variables
  element.style.removeProperty(`--${effectId}-intensity`);
  
  // Remove data attributes
  Array.from(element.attributes)
    .filter(attr => attr.name.startsWith('data-effect'))
    .forEach(attr => element.removeAttribute(attr.name));
};
