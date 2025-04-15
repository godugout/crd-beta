
export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface CardData {
  id: string;
  name?: string;
  title?: string;
  player?: string;
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
  tags?: string[];
}
