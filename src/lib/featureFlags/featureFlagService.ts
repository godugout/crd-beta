import { 
  FeatureFlag,
  UserAttributes,
  EvaluationContext,
  EvaluationResult,
  FlagRule,
  RuleOperator,
  UserSegmentRule
} from './featureFlagTypes';

/**
 * Feature Flag Service
 * 
 * This service handles the evaluation of feature flags against user contexts
 * and provides methods for checking if features are enabled.
 */
class FeatureFlagService {
  private flags: Map<string, FeatureFlag> = new Map();
  private flagsLoaded: boolean = false;
  private overrides: Map<string, any> = new Map();
  private userAttributes: UserAttributes = {};
  private environment: string = 'development';
  private storageKey: string = 'feature_flags';
  private deviceHashKey: string = 'device_hash';

  constructor() {
    this.loadOverrides();
    this.generateDeviceHash();
  }

  /**
   * Initialize the feature flag service
   */
  public async initialize(options: {
    environment?: string;
    user?: UserAttributes;
    flags?: FeatureFlag[];
  } = {}): Promise<void> {
    // Set environment
    if (options.environment) {
      this.environment = options.environment;
    }

    // Set user attributes
    if (options.user) {
      this.setUser(options.user);
    }

    // Load flags from provided config or API
    if (options.flags) {
      this.loadFlags(options.flags);
    } else {
      await this.fetchFlags();
    }
  }

  /**
   * Load flags directly from configuration
   */
  public loadFlags(flags: FeatureFlag[]): void {
    this.flags.clear();
    flags.forEach(flag => {
      this.flags.set(flag.id, flag);
    });
    this.flagsLoaded = true;
    console.info(`Loaded ${flags.length} feature flags`);
  }

  /**
   * Fetch flags from API or storage
   */
  public async fetchFlags(): Promise<void> {
    try {
      // Try to load from localStorage first
      const cachedFlags = localStorage.getItem(this.storageKey);
      
      if (cachedFlags) {
        const parsedFlags: FeatureFlag[] = JSON.parse(cachedFlags);
        this.loadFlags(parsedFlags);
        console.info(`Loaded ${parsedFlags.length} feature flags from cache`);
      }

      // In real implementation, this would fetch from API
      // For demo, we'll use mock flags
      const mockFlags: FeatureFlag[] = [
        {
          id: 'offline-sync',
          name: 'Enhanced Offline Sync',
          description: 'Enable enhanced offline synchronization capabilities',
          enabled: true,
          defaultValue: true,
          environments: {
            development: true,
            staging: true,
            production: false
          },
          rolloutPercentage: 100,
          tags: ['offline', 'sync', 'beta'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'api-docs',
          name: 'API Documentation',
          description: 'Enable in-app API documentation viewer',
          enabled: true,
          defaultValue: true,
          environments: {
            development: true,
            staging: true,
            production: false
          },
          tags: ['documentation', 'developer'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'feature-flags-ui',
          name: 'Feature Flags UI',
          description: 'Enable UI for managing feature flags',
          enabled: false,
          defaultValue: false,
          environments: {
            development: true,
            staging: false,
            production: false
          },
          tags: ['admin', 'developer'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      // Update cached flags
      this.loadFlags(mockFlags);
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.flags.values())));
    } catch (error) {
      console.error('Failed to fetch feature flags:', error);
      this.flagsLoaded = true; // Mark as loaded anyway to prevent constant retries
    }
  }

  /**
   * Set user attributes for targeting
   */
  public setUser(attributes: UserAttributes): void {
    this.userAttributes = { ...attributes };
    console.debug('Updated user attributes for feature flag targeting', 
      { userId: attributes.id, email: attributes.email });
  }

  /**
   * Check if a feature is enabled
   */
  public isEnabled<T = boolean>(
    flagId: string, 
    defaultValue: T | boolean = false
  ): boolean {
    const result = this.evaluate<T | boolean>(flagId, defaultValue as T);
    return result.enabled && (
      typeof result.value === 'boolean' ? result.value : true
    );
  }

  /**
   * Get the value of a feature flag
   */
  public getValue<T>(
    flagId: string,
    defaultValue: T
  ): T {
    const result = this.evaluate<T>(flagId, defaultValue);
    return result.value as T;
  }

  /**
   * Evaluate a feature flag with full context and details
   */
  public evaluate<T>(
    flagId: string, 
    defaultValue: T
  ): EvaluationResult<T> {
    // Check if we have local override
    if (this.overrides.has(flagId)) {
      const overrideValue = this.overrides.get(flagId);
      return {
        flagId,
        enabled: true,
        value: overrideValue,
        reason: 'OVERRIDE',
        timestamp: new Date().toISOString()
      };
    }

    // If flags not loaded yet, return default
    if (!this.flagsLoaded) {
      console.warn(`Feature flags not loaded yet, returning default for ${flagId}`);
      return {
        flagId,
        enabled: typeof defaultValue === 'boolean' ? defaultValue : true,
        value: defaultValue,
        reason: 'DEFAULT',
        timestamp: new Date().toISOString()
      };
    }

    // Get the flag
    const flag = this.flags.get(flagId);
    
    // If flag doesn't exist, return default
    if (!flag) {
      return {
        flagId,
        enabled: typeof defaultValue === 'boolean' ? defaultValue : true,
        value: defaultValue,
        reason: 'DEFAULT',
        timestamp: new Date().toISOString()
      };
    }

    // Check if flag is enabled at all
    if (!flag.enabled) {
      return {
        flagId,
        enabled: false,
        value: flag.defaultValue as T,
        reason: 'DISABLED',
        timestamp: new Date().toISOString()
      };
    }
    
    // Check environment restrictions
    if (flag.environments && !flag.environments[this.environment]) {
      return {
        flagId,
        enabled: false,
        value: flag.defaultValue as T,
        reason: 'DISABLED',
        timestamp: new Date().toISOString()
      };
    }

    // Build evaluation context
    const context: EvaluationContext = {
      user: this.userAttributes,
      environment: this.environment,
      device: this.getDeviceInfo()
    };

    // Check date restrictions
    const now = new Date().toISOString();
    if (flag.startDate && now < flag.startDate) {
      return {
        flagId,
        enabled: false,
        value: flag.defaultValue as T,
        reason: 'DISABLED',
        timestamp: now
      };
    }
    
    if (flag.endDate && now > flag.endDate) {
      return {
        flagId,
        enabled: false,
        value: flag.defaultValue as T,
        reason: 'DISABLED',
        timestamp: now
      };
    }

    // Check user segment targeting
    if (flag.segment && Object.keys(context.user || {}).length > 0) {
      const segmentMatch = this.evaluateSegment(flag.segment, context);
      if (!segmentMatch) {
        return {
          flagId,
          enabled: false,
          value: flag.defaultValue as T,
          reason: 'TARGETING_MATCH',
          timestamp: now
        };
      }
    }

    // Check individual rules
    if (flag.rules && flag.rules.length > 0) {
      for (const rule of flag.rules) {
        if (this.evaluateRule(rule, context)) {
          return {
            flagId,
            enabled: true,
            value: flag.value !== undefined ? flag.value as T : flag.defaultValue as T,
            reason: 'RULE_MATCH',
            timestamp: now
          };
        }
      }
    }

    // Check for variants (A/B tests)
    if (flag.variants && flag.variants.length > 0) {
      const variant = this.selectVariant(flagId, flag.variants);
      if (variant) {
        return {
          flagId,
          enabled: true,
          value: variant.value as T,
          variant: variant.name,
          reason: 'VARIANT_ASSIGNMENT',
          timestamp: now
        };
      }
    }

    // Check percentage rollout
    if (flag.rolloutPercentage !== undefined) {
      const hash = this.getStableHash(flagId);
      const percentage = Math.abs(hash) % 100;
      
      if (percentage < flag.rolloutPercentage) {
        return {
          flagId,
          enabled: true,
          value: flag.value !== undefined ? flag.value as T : flag.defaultValue as T,
          reason: 'PERCENTAGE_ROLLOUT',
          timestamp: now
        };
      } else {
        return {
          flagId,
          enabled: false,
          value: flag.defaultValue as T,
          reason: 'PERCENTAGE_ROLLOUT',
          timestamp: now
        };
      }
    }

    // Default case - flag is enabled with its value
    return {
      flagId,
      enabled: true,
      value: flag.value !== undefined ? flag.value as T : flag.defaultValue as T,
      reason: 'DEFAULT',
      timestamp: now
    };
  }

  /**
   * Evaluate a user segment rule
   */
  private evaluateSegment(segment: UserSegmentRule, context: EvaluationContext): boolean {
    if (!segment.conditions || segment.conditions.length === 0) {
      return true;
    }

    if (segment.operator === 'and') {
      return segment.conditions.every(rule => this.evaluateRule(rule, context));
    } else {
      return segment.conditions.some(rule => this.evaluateRule(rule, context));
    }
  }

  /**
   * Evaluate a single targeting rule
   */
  private evaluateRule(rule: FlagRule, context: EvaluationContext): boolean {
    const path = rule.attribute.split('.');
    let value = context;
    
    // Navigate the path to get the value
    for (const segment of path) {
      if (value === undefined || value === null) return false;
      value = value[segment];
    }
    
    // Special operators for checking existence
    if (rule.operator === 'is_defined') {
      return value !== undefined && value !== null;
    }
    
    if (rule.operator === 'is_undefined') {
      return value === undefined || value === null;
    }
    
    // If value doesn't exist, rule fails
    if (value === undefined || value === null) {
      return false;
    }
    
    // Process the remaining operators
    switch (rule.operator) {
      case 'eq':
        return value === rule.value;
      case 'neq':
        return value !== rule.value;
      case 'gt':
        return value > rule.value;
      case 'gte':
        return value >= rule.value;
      case 'lt':
        return value < rule.value;
      case 'lte':
        return value <= rule.value;
      case 'contains':
        return String(value).includes(String(rule.value));
      case 'not_contains':
        return !String(value).includes(String(rule.value));
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(value);
      case 'not_in':
        return Array.isArray(rule.value) && !rule.value.includes(value);
      case 'matches':
        try {
          const regex = new RegExp(rule.value);
          return regex.test(String(value));
        } catch {
          return false;
        }
      default:
        return false;
    }
  }

  /**
   * Select a variant for A/B testing based on a stable hash
   */
  private selectVariant(flagId: string, variants: Array<{id: string; name: string; value: any; weight: number}>) {
    // Get a deterministic hash value between 0-100 for this user+flag
    const hash = this.getStableHash(flagId);
    const value = Math.abs(hash) % 100;
    
    // Calculate the variant based on weights
    let sum = 0;
    for (const variant of variants) {
      sum += variant.weight;
      if (value < sum) {
        return variant;
      }
    }
    
    // Default to first variant if something went wrong with weights
    return variants[0];
  }

  /**
   * Set a local override for a feature flag
   */
  public setOverride(flagId: string, value: any): void {
    this.overrides.set(flagId, value);
    this.saveOverrides();
    console.debug(`Override set for flag: ${flagId}`, { value });
  }

  /**
   * Remove a local override for a feature flag
   */
  public removeOverride(flagId: string): void {
    this.overrides.delete(flagId);
    this.saveOverrides();
    console.debug(`Override removed for flag: ${flagId}`);
  }

  /**
   * Reset all local overrides
   */
  public resetOverrides(): void {
    this.overrides.clear();
    localStorage.removeItem('flag_overrides');
    console.debug('All flag overrides reset');
  }

  /**
   * Save overrides to localStorage
   */
  private saveOverrides(): void {
    try {
      localStorage.setItem(
        'flag_overrides', 
        JSON.stringify(Object.fromEntries(this.overrides))
      );
    } catch (error) {
      console.error('Failed to save flag overrides:', error);
    }
  }

  /**
   * Load overrides from localStorage
   */
  private loadOverrides(): void {
    try {
      const savedOverrides = localStorage.getItem('flag_overrides');
      if (savedOverrides) {
        const parsed = JSON.parse(savedOverrides);
        this.overrides = new Map(Object.entries(parsed));
        console.debug(`Loaded ${this.overrides.size} feature flag overrides`);
      }
    } catch (error) {
      console.error('Failed to load flag overrides:', error);
    }
  }

  /**
   * Get device information for targeting
   */
  private getDeviceInfo() {
    const device = {
      type: this.getDeviceType(),
      browser: this.getBrowserInfo(),
      os: this.getOSInfo(),
      hash: localStorage.getItem(this.deviceHashKey) || ''
    };
    return device;
  }

  /**
   * Generate a stable hash for this device
   */
  private generateDeviceHash(): void {
    // Check if we already have a hash
    const existingHash = localStorage.getItem(this.deviceHashKey);
    if (existingHash) {
      return;
    }
    
    // Generate a random hash
    const hash = Math.random().toString(36).substring(2, 15);
    localStorage.setItem(this.deviceHashKey, hash);
  }

  /**
   * Get a stable hash value for consistent flag evaluation
   */
  private getStableHash(flagId: string): number {
    const userId = this.userAttributes.id || '';
    const deviceId = localStorage.getItem(this.deviceHashKey) || '';
    const input = `${userId}-${deviceId}-${flagId}`;
    
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * Get the device type
   */
  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return 'mobile';
    } else if (/Android/.test(userAgent)) {
      if (/Mobile/.test(userAgent)) {
        return 'mobile';
      } else {
        return 'tablet';
      }
    } else if (/Tablet|iPad/.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  /**
   * Get browser information
   */
  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    
    if (/Chrome/.test(userAgent)) {
      return 'chrome';
    } else if (/Firefox/.test(userAgent)) {
      return 'firefox';
    } else if (/Safari/.test(userAgent)) {
      return 'safari';
    } else if (/MSIE|Trident/.test(userAgent)) {
      return 'ie';
    } else if (/Edge/.test(userAgent)) {
      return 'edge';
    } else {
      return 'unknown';
    }
  }

  /**
   * Get operating system information
   */
  private getOSInfo(): string {
    const userAgent = navigator.userAgent;
    
    if (/Windows/.test(userAgent)) {
      return 'windows';
    } else if (/Mac OS X/.test(userAgent)) {
      return 'macos';
    } else if (/Linux/.test(userAgent)) {
      return 'linux';
    } else if (/Android/.test(userAgent)) {
      return 'android';
    } else if (/iOS|iPhone|iPad|iPod/.test(userAgent)) {
      return 'ios';
    } else {
      return 'unknown';
    }
  }
}

// Export singleton instance
export const featureFlagService = new FeatureFlagService();
export default featureFlagService;
