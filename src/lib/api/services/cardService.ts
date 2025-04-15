
import { apiClient } from '../base/apiClient';
import type { Card } from '@/lib/types';

const CARD_FIELDS = `
  id
  title
  description
  imageUrl
  createdAt
  updatedAt
  userId
  tags
  metadata
`;

export const cardService = {
  async getCards() {
    const query = `
      query GetCards {
        cards {
          ${CARD_FIELDS}
        }
      }
    `;
    return apiClient.query<{ cards: Card[] }>(query);
  },

  async getCardById(id: string) {
    const query = `
      query GetCard($id: ID!) {
        card(id: $id) {
          ${CARD_FIELDS}
        }
      }
    `;
    return apiClient.query<{ card: Card }>(query, { id });
  },

  async createCard(input: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) {
    const mutation = `
      mutation CreateCard($input: CardInput!) {
        createCard(input: $input) {
          ${CARD_FIELDS}
        }
      }
    `;
    return apiClient.mutate<{ createCard: Card }>(mutation, { input });
  },

  async updateCard(id: string, input: Partial<Card>) {
    const mutation = `
      mutation UpdateCard($id: ID!, $input: CardUpdateInput!) {
        updateCard(id: $id, input: $input) {
          ${CARD_FIELDS}
        }
      }
    `;
    return apiClient.mutate<{ updateCard: Card }>(mutation, { id, input });
  },

  async deleteCard(id: string) {
    const mutation = `
      mutation DeleteCard($id: ID!) {
        deleteCard(id: $id)
      }
    `;
    return apiClient.mutate<{ deleteCard: boolean }>(mutation, { id });
  }
};
