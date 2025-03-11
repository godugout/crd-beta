
export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  collectionId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cards: Card[];
  collections: Collection[];
}
