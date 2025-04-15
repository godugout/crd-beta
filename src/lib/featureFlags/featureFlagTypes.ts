
/**
 * Feature flag system type definitions
 * 
 * This system allows for:
 * - Simple on/off flags
 * - Percentage-based rollouts
 * - User segment targeting
 * - A/B testing
 * - Time-based activation
 */

export type FlagValue = boolean | string | number | object;

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  defaultValue: FlagValue;
  value?: FlagValue;
  rolloutPercentage?: number;
  rules?: FlagRule[];
  segment?: UserSegmentRule;
  variants?: FlagVariant[];
  startDate?: string;
  endDate?: string;
  environments?: Record<string, boolean>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FlagVariant {
  id: string;
  name: string;
  value: FlagValue;
  weight: number;
}

export type RuleOperator = 
  | 'eq' // equals
  | 'neq' // not equals
  | 'gt' // greater than
  | 'gte' // greater than or equal
  | 'lt' // less than
  | 'lte' // less than or equal
  | 'contains' // string contains
  | 'not_contains' // string does not contain
  | 'in' // value in array
  | 'not_in' // value not in array
  | 'matches' // regex match
  | 'is_defined' // attribute exists
  | 'is_undefined'; // attribute doesn't exist

export interface FlagRule {
  attribute: string;
  operator: RuleOperator;
  value: any;
}

export type SegmentOperator = 'and' | 'or';

export interface UserSegmentRule {
  operator: SegmentOperator;
  conditions: FlagRule[];
}

export interface UserAttributes {
  id?: string;
  email?: string;
  role?: string;
  groups?: string[];
  [key: string]: any;
}

export interface EvaluationContext {
  user?: UserAttributes;
  environment: string;
  device?: {
    type?: string;
    os?: string;
    browser?: string;
    [key: string]: any;
  };
  location?: {
    countryCode?: string;
    region?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface EvaluationResult<T = any> {
  flagId: string;
  enabled: boolean;
  value: T;
  variant?: string;
  reason: EvaluationReason;
  timestamp: string;
}

export type EvaluationReason = 
  | 'DEFAULT'
  | 'TARGETING_MATCH'
  | 'RULE_MATCH'
  | 'PERCENTAGE_ROLLOUT'
  | 'DISABLED'
  | 'ERROR'
  | 'VARIANT_ASSIGNMENT'
  | 'OVERRIDE';
