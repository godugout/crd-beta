
import { useState, useEffect } from 'react';
import featureFlagService from '@/lib/featureFlags/featureFlagService';

/**
 * Hook for working with feature flags in React components
 * 
 * @param flagId - The identifier of the feature flag
 * @param defaultValue - The default value to use if the flag is not found
 * @returns An object with the feature flag state and setter functions
 */
export function useFeatureFlag<T>(flagId: string, defaultValue: T) {
  // Get the initial value
  const [value, setValue] = useState<T>(() => 
    featureFlagService.getValue<T>(flagId, defaultValue)
  );
  
  const [enabled, setEnabled] = useState<boolean>(() => 
    featureFlagService.isEnabled(flagId, false)
  );
  
  // Check if there's a local override
  const [isOverridden, setIsOverridden] = useState<boolean>(false);

  // Initialize flags and check for overrides
  useEffect(() => {
    // Re-evaluate when the component mounts, in case the feature flag service
    // was initialized after the component was created
    const checkFlag = () => {
      const newValue = featureFlagService.getValue<T>(flagId, defaultValue);
      const newEnabled = featureFlagService.isEnabled(flagId, false);
      
      setValue(newValue);
      setEnabled(newEnabled);
      
      // Check if there's an override
      const savedOverrides = localStorage.getItem('flag_overrides');
      if (savedOverrides) {
        try {
          const overrides = JSON.parse(savedOverrides);
          setIsOverridden(flagId in overrides);
        } catch (error) {
          console.error('Error parsing flag overrides:', error);
        }
      }
    };
    
    checkFlag();
    
    // Listen for flag change events
    // This would be implemented with a proper event system
    // For now, we'll just update when the component mounts
    
    return () => {
      // Cleanup event listeners if needed
    };
  }, [flagId, defaultValue]);

  /**
   * Set a local override for this feature flag
   */
  const setOverride = (newValue: T) => {
    featureFlagService.setOverride(flagId, newValue);
    setValue(newValue);
    setEnabled(typeof newValue === 'boolean' ? newValue : true);
    setIsOverridden(true);
  };

  /**
   * Remove the local override for this feature flag
   */
  const removeOverride = () => {
    featureFlagService.removeOverride(flagId);
    const newValue = featureFlagService.getValue<T>(flagId, defaultValue);
    const newEnabled = featureFlagService.isEnabled(flagId, false);
    
    setValue(newValue);
    setEnabled(newEnabled);
    setIsOverridden(false);
  };

  return {
    value,
    enabled,
    isOverridden,
    setOverride,
    removeOverride
  };
}

/**
 * Simplified hook to check if a feature is enabled
 * 
 * @param flagId - The identifier of the feature flag
 * @param defaultEnabled - The default status if the flag is not defined
 * @returns Whether the feature is enabled
 */
export function useFeatureEnabled(flagId: string, defaultEnabled: boolean = false): boolean {
  const { enabled } = useFeatureFlag(flagId, defaultEnabled);
  return enabled;
}

export default useFeatureFlag;
