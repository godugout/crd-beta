
import React from 'react';
import { Card } from '@/lib/types/cardTypes';
import { UGCAsset } from '@/lib/types/ugcTypes';
import { CardEffect } from '@/lib/types/cardEffects';

/**
 * Test utility functions for component testing
 * @module testUtils
 */

/**
 * Creates a mock Card object for testing
 * @param {Partial<Card>} overrides - Properties to override in the default card
 * @returns {Card} A mock card object
 */
export const mockCard = (overrides: Partial<Card> = {}): Card => ({
  id: 'test-card-id',
  title: 'Test Card',
  description: 'This is a test card',
  imageUrl: '/placeholder-card.png',
  thumbnailUrl: '/placeholder-card.png',
  tags: ['test', 'mock'],
  userId: 'test-user-id',
  effects: ['holographic', 'refractor'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  player: 'Test Player',
  team: 'Test Team',
  year: '2023',
  designMetadata: {
    cardStyle: {
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      borderColor: '#000000',
      template: 'classic',
      effect: 'holographic',
      frameWidth: 2,
      shadowColor: 'rgba(0,0,0,0.2)',
      frameColor: '#000000'
    },
    textStyle: {
      titleColor: '#FFFFFF',
      titleWeight: 'bold',
      titleAlignment: 'center',
      descriptionColor: '#DDDDDD'
    },
    cardMetadata: {
      category: 'sports',
      series: 'base',
      cardType: 'standard'
    },
    marketMetadata: {
      isPrintable: true,
      isForSale: false,
      includeInCatalog: true,
      price: 0,
      currency: 'USD',
      availableForSale: false,
      editionSize: 0,
      editionNumber: 0
    }
  },
  ...overrides
});

/**
 * Creates a mock UGCAsset object for testing
 * @param {Partial<UGCAsset>} overrides - Properties to override in the default asset
 * @returns {UGCAsset} A mock UGC asset object
 */
export const mockUGCAsset = (overrides: Partial<UGCAsset> = {}): UGCAsset => ({
  id: 'test-asset-id',
  title: 'Test Asset',
  description: 'This is a test asset',
  assetType: 'sticker',
  category: 'sports',
  thumbnailUrl: '/placeholder-card.png',
  url: '/placeholder-card.png',
  tags: ['test', 'mock'],
  userId: 'test-user-id',
  isOfficial: false,
  isApproved: true,
  isPremium: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  marketplace: {
    isForSale: false,
    price: 0,
    featured: false
  },
  ...overrides
});

/**
 * Creates a mock CardEffect object for testing
 * @param {Partial<CardEffect>} overrides - Properties to override in the default effect
 * @returns {CardEffect} A mock card effect object
 */
export const mockCardEffect = (overrides: Partial<CardEffect> = {}): CardEffect => ({
  id: 'test-effect-id',
  name: 'Test Effect',
  enabled: true,
  settings: {
    intensity: 50,
    speed: 5,
    pattern: 'waves',
    color: '#FF0000',
    animationEnabled: true
  },
  className: 'test-effect',
  ...overrides
});

/**
 * Mock ResizeObserver for component tests
 * @class MockResizeObserver
 */
export class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

/**
 * Setup global mocks for testing
 */
export function setupTestEnvironment() {
  // Mock ResizeObserver
  window.ResizeObserver = MockResizeObserver as any;
  
  // Mock matchMedia
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {},
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() { return true; }
    };
  };
  
  // Mock IntersectionObserver
  window.IntersectionObserver = class IntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn();
    constructor() {}
  };
}

/**
 * Wait for a specified time in tests
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>} Promise that resolves after the specified time
 */
export const wait = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));
