
export interface PremiumCardEffect {
  id: string;
  name: string;
  category: string;
  settings: {
    intensity: number;
    speed: number;
    pattern?: string;
    color?: string;
    angle?: number;
    animationEnabled?: boolean;
    [key: string]: any;
  };
  description: string;
  premium?: boolean;
  iconUrl?: string;
}
