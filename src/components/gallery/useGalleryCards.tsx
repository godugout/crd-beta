import { useState, useEffect } from 'react';
import { Card } from '@/lib/types/cardTypes';

interface GalleryFilters {
  searchTerm: string;
  category: string;
  sortBy: string;
}

const useGalleryCards = (initialCards: Card[]) => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [filteredCards, setFilteredCards] = useState<Card[]>(initialCards);
  const [filters, setFilters] = useState<GalleryFilters>({
    searchTerm: '',
    category: 'all',
    sortBy: 'recent',
  });

  useEffect(() => {
    applyFilters();
  }, [filters, cards]);

  const updateCards = (newCards: Card[]) => {
    setCards(newCards);
  };

  const applyFilters = () => {
    let results = [...cards];

    if (filters.searchTerm) {
      results = results.filter(card =>
        card.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        card.tags?.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        getMemoryTitle(card).toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      results = results.filter(card => card.designMetadata?.cardMetadata?.category === filters.category);
    }

    if (filters.sortBy === 'recent') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'oldest') {
      results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filters.sortBy === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredCards(results);
  };

  const updateFilters = (newFilters: Partial<GalleryFilters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  // Update oaklandMemory access
  const getMemoryTitle = (card: Card) => {
    if (card.designMetadata?.oaklandMemory?.title) {
      return card.designMetadata.oaklandMemory.title;
    }
    return card.title || 'Untitled Memory';
  };

  return {
    cards: filteredCards,
    filters,
    updateFilters,
    updateCards
  };
};

export default useGalleryCards;
