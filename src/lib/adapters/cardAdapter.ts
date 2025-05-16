
import { Card } from "@/lib/types/card";
import { DEFAULT_DESIGN_METADATA } from "@/lib/utils/cardDefaults";
import { generateId } from "@/lib/utils/idGenerator";

// Helper to generate a default card with minimal required properties
export function createEmptyCard(): Card {
  const timestamp = new Date().toISOString();
  
  return {
    id: generateId(),
    title: "New Card",
    description: "",
    imageUrl: "/placeholder-card.png",
    thumbnailUrl: "/placeholder-card.png",
    tags: [],
    userId: "anonymous", // This should be replaced with actual user ID when available
    effects: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    designMetadata: DEFAULT_DESIGN_METADATA
  };
}

// Adapts data from various sources to a valid Card object
export function adaptToCard(data: Partial<Card>): Card {
  const timestamp = new Date().toISOString();
  const designMetadata = data.designMetadata || DEFAULT_DESIGN_METADATA;
  
  // Ensure essential nested objects exist
  if (!designMetadata.cardMetadata) {
    designMetadata.cardMetadata = DEFAULT_DESIGN_METADATA.cardMetadata;
  }
  
  if (!designMetadata.marketMetadata) {
    designMetadata.marketMetadata = DEFAULT_DESIGN_METADATA.marketMetadata;
  }
  
  if (!designMetadata.cardStyle) {
    designMetadata.cardStyle = DEFAULT_DESIGN_METADATA.cardStyle;
  }
  
  if (!designMetadata.textStyle) {
    designMetadata.textStyle = DEFAULT_DESIGN_METADATA.textStyle;
  }

  return {
    // Required fields with defaults
    id: data.id || generateId(),
    title: data.title || "Untitled Card",
    description: data.description || "",
    imageUrl: data.imageUrl || "/placeholder-card.png",
    thumbnailUrl: data.thumbnailUrl || data.imageUrl || "/placeholder-card-thumb.png",
    tags: data.tags || [],
    userId: data.userId || "anonymous",
    effects: data.effects || [],
    createdAt: data.createdAt || timestamp,
    updatedAt: data.updatedAt || timestamp,
    designMetadata: designMetadata,
    
    // Optional fields that can be passed through
    collectionId: data.collectionId,
    metadata: data.metadata,
    reactions: data.reactions,
    comments: data.comments,
    viewCount: data.viewCount,
    isPublic: data.isPublic,
    
    // Player-related fields
    player: data.player,
    team: data.team,
    year: data.year,
    jersey: data.jersey,
    set: data.set,
    cardNumber: data.cardNumber,
    cardType: data.cardType,
    
    // Visual properties
    artist: data.artist,
    backgroundColor: data.backgroundColor,
    textColor: data.textColor, // Support this legacy field
    specialEffect: data.specialEffect,
    fabricSwatches: data.fabricSwatches,
    
    // Additional metadata
    name: data.name,
    cardStyle: data.cardStyle,
    backTemplate: data.backTemplate,
    
    // Additional IDs
    teamId: data.teamId,
    creatorId: data.creatorId,
    
    // Market data
    price: data.price,
    estimatedValue: data.estimatedValue,
    condition: data.condition,
    rarity: data.rarity
  };
}
