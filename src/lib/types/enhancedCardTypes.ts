
import { Card, CardRarity as BaseCardRarity } from './cardTypes';

export interface HotspotData {
  id: string;
  position: { x: number; y: number };
  content: string;
  type: 'info' | 'stat' | 'achievement';
}

export interface EnhancedCard extends Card {
  hotspots?: HotspotData[];
  interactiveElements?: any[];
  animationPresets?: string[];
}

export interface Series {
  id: string;
  name: string;
  year: string;
  manufacturer: string;
  cardCount: number;
}

export type CardRarity = BaseCardRarity;
