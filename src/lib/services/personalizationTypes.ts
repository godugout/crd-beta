
export interface CreationHistoryItem {
  id: string;
  cardId: string;
  effectsUsed: string[];
  elementsUsed: string[];
  timeSpent: number;
  createdAt: string;
}

export interface UserStyleProfile {
  userId: string;
  favoriteColors: string[];
  favoriteEffects: string[];
  favoriteTemplates: string[];
  createdAt: string;
  updatedAt: string;
}
