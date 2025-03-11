
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
  userId?: string;
  isPublic?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  isPublic?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cards?: Card[];
  collections?: Collection[];
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
