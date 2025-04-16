
/**
 * Feature Flag Service
 * Manages feature flags throughout the application
 */

// Default feature flags for the application
const DEFAULT_FLAGS = {
  // Core features
  'enable-trading': true,
  'enable-collections': true,
  
  // Premium features
  'premium-effects': true,       // Set to true for beta period
  'premium-templates': true,     // Set to true for beta period
  'premium-ar-features': true,   // Set to true for beta period
  'premium-analytics': true,     // Set to true for beta period
  
  // Experimental features
  'experimental-card-trainer': true,
  'experimental-3d-viewer': true,
  
  // Development features
  'debug-mode': false,
  'show-performance-metrics': false,
};

// Store for runtime flag values
let runtimeFlags = { ...DEFAULT_FLAGS };

// Store for flag overrides saved to localStorage
let flagOverrides: Record<string, any> = {};

// Initialize overrides from localStorage
const initializeOverrides = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const savedOverrides = localStorage.getItem('flag_overrides');
    if (savedOverrides) {
      flagOverrides = JSON.parse(savedOverrides);
      runtimeFlags = { ...runtimeFlags, ...flagOverrides };
    }
  } catch (error) {
    console.error('Error loading flag overrides:', error);
  }
};

// Initialize overrides on module load
initializeOverrides();

/**
 * Feature flag service with methods for checking, setting, and removing flags
 */
const featureFlagService = {
  /**
   * Check if a feature flag is enabled
   * @param flagId - The identifier of the feature flag
   * @param defaultValue - Default value if the flag doesn't exist
   * @returns Whether the feature is enabled
   */
  isEnabled: (flagId: string, defaultValue = false): boolean => {
    if (flagId in runtimeFlags) {
      return Boolean(runtimeFlags[flagId]);
    }
    return defaultValue;
  },
  
  /**
   * Get the value of a feature flag
   * @param flagId - The identifier of the feature flag
   * @param defaultValue - Default value if the flag doesn't exist
   * @returns The value of the feature flag
   */
  getValue: <T>(flagId: string, defaultValue: T): T => {
    if (flagId in runtimeFlags) {
      return runtimeFlags[flagId] as T;
    }
    return defaultValue;
  },
  
  /**
   * Set a local override for a feature flag
   * @param flagId - The identifier of the feature flag
   * @param value - The new value for the flag
   */
  setOverride: <T>(flagId: string, value: T): void => {
    flagOverrides[flagId] = value;
    runtimeFlags[flagId] = value;
    
    try {
      localStorage.setItem('flag_overrides', JSON.stringify(flagOverrides));
    } catch (error) {
      console.error('Error saving flag override:', error);
    }
    
    // Dispatch an event to notify listeners
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('featureflag:changed', { 
        detail: { flagId, value } 
      });
      window.dispatchEvent(event);
    }
  },
  
  /**
   * Remove a local override for a feature flag
   * @param flagId - The identifier of the feature flag
   */
  removeOverride: (flagId: string): void => {
    delete flagOverrides[flagId];
    runtimeFlags[flagId] = flagId in DEFAULT_FLAGS ? DEFAULT_FLAGS[flagId] : undefined;
    
    try {
      localStorage.setItem('flag_overrides', JSON.stringify(flagOverrides));
    } catch (error) {
      console.error('Error removing flag override:', error);
    }
    
    // Dispatch an event to notify listeners
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('featureflag:changed', { 
        detail: { flagId, value: runtimeFlags[flagId] } 
      });
      window.dispatchEvent(event);
    }
  },
  
  /**
   * Get all feature flags
   */
  getAllFlags: (): Record<string, any> => {
    return { ...runtimeFlags };
  }
};

export default featureFlagService;
