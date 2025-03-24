
export type CardStats = {
  battingAverage?: string;
  homeRuns?: string;
  rbis?: string;
  era?: string;
  wins?: string;
  strikeouts?: string;
};

export type CardData = {
  id: string;
  title: string;
  year: string;
  player: string;
  team: string;
  position: string;
  manufacturer: string;
  cardNumber: string;
  value: string;
  rarityScore: number;
  condition: string;
  imageUrl: string;
  backImageUrl?: string;
  stats?: CardStats;
};

