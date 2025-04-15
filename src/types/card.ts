
export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface CardData {
  id: string; // Changed from number to string to match how it's used
  name?: string;
  title: string; // Added title property
  player?: string; // Added player property
  team?: string;
  jersey?: string;
  year?: string;
  backgroundColor?: string;
  textColor?: string;
  cardType?: string;
  artist?: string;
  set?: string;
  cardNumber?: string;
  description?: string;
  specialEffect?: string;
  imageUrl?: string;
  fabricSwatches?: FabricSwatch[];
  tags?: string[]; // Added tags property
}
