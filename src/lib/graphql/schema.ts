
import { gql } from '@apollo/client';

// Define GraphQL types
export const typeDefs = gql`
  # Core Card Type
  type Card {
    id: ID!
    title: String!
    description: String
    imageUrl: String!
    thumbnailUrl: String
    rarity: String!
    editionSize: Int!
    createdAt: String!
    updatedAt: String!
    creator: User
    owner: User
    team: Team
    collection: Collection
    tags: [String]
    isPublic: Boolean
    designMetadata: JSONObject
  }

  # User Type
  type User {
    id: ID!
    email: String!
    name: String
    username: String
    avatarUrl: String
    cards: [Card]
    collections: [Collection]
    teams: [Team]
    createdAt: String!
    updatedAt: String!
  }

  # Collection Type
  type Collection {
    id: ID!
    title: String!
    description: String
    coverImageUrl: String
    owner: User!
    team: Team
    cards: [Card]
    visibility: Visibility!
    allowComments: Boolean!
    createdAt: String!
    updatedAt: String!
    designMetadata: JSONObject
  }

  # Team Type
  type Team {
    id: ID!
    name: String!
    description: String
    logoUrl: String
    primaryColor: String
    secondaryColor: String
    tertiaryColor: String
    owner: User!
    members: [TeamMember]
    cards: [Card]
    collections: [Collection]
    createdAt: String!
    updatedAt: String!
  }

  # Team Member Type
  type TeamMember {
    id: ID!
    team: Team!
    user: User!
    role: TeamRole!
    joinedAt: String!
  }

  # Effect Type
  type Effect {
    id: ID!
    name: String!
    description: String
    category: EffectCategory!
    intensity: Float
    settings: JSONObject
    preview: String
    isActive: Boolean!
  }

  # Digital Asset Type
  type DigitalAsset {
    id: ID!
    title: String!
    description: String
    mimeType: String!
    storagePath: String!
    publicUrl: String!
    thumbnailUrl: String!
    fileSize: Int!
    width: Int
    height: Int
    tags: [String]
    metadata: JSONObject
    createdAt: String!
    updatedAt: String!
    user: User!
    originalFilename: String!
  }

  # Comment Type
  type Comment {
    id: ID!
    content: String!
    user: User!
    card: Card
    collection: Collection
    team: Team
    parent: Comment
    replies: [Comment]
    createdAt: String!
    updatedAt: String!
  }

  # Reaction Type
  type Reaction {
    id: ID!
    type: ReactionType!
    user: User!
    card: Card
    collection: Collection
    comment: Comment
    createdAt: String!
  }

  # Custom Scalar Types
  scalar JSONObject

  # Enums
  enum Visibility {
    PUBLIC
    PRIVATE
    TEAM
  }

  enum TeamRole {
    OWNER
    ADMIN
    MEMBER
    VIEWER
  }

  enum EffectCategory {
    HOLOGRAPHIC
    REFRACTOR
    SHIMMER
    GOLD
    VINTAGE
    CHROME
    TEXTURE
    FRAME
    BACKGROUND
  }

  enum ReactionType {
    LIKE
    LOVE
    WOW
    HAHA
    SAD
    ANGRY
  }

  # Input Types
  input CardInput {
    title: String!
    description: String
    imageUrl: String!
    thumbnailUrl: String
    rarity: String!
    editionSize: Int!
    teamId: ID
    collectionId: ID
    tags: [String]
    isPublic: Boolean
    designMetadata: JSONObject
  }

  input CollectionInput {
    title: String!
    description: String
    coverImageUrl: String
    teamId: ID
    visibility: Visibility!
    allowComments: Boolean!
    designMetadata: JSONObject
  }

  input EffectInput {
    name: String!
    description: String
    category: EffectCategory!
    intensity: Float
    settings: JSONObject
    isActive: Boolean!
  }

  input PaginationInput {
    limit: Int = 10
    offset: Int = 0
  }

  input CardFilterInput {
    creatorId: ID
    ownerId: ID
    teamId: ID
    collectionId: ID
    tags: [String]
    rarity: String
    search: String
  }

  input CardSortInput {
    field: CardSortField!
    direction: SortDirection!
  }

  enum CardSortField {
    CREATED_AT
    UPDATED_AT
    TITLE
    RARITY
  }

  enum SortDirection {
    ASC
    DESC
  }

  # Pagination Type
  type PaginatedCards {
    items: [Card]!
    total: Int!
    hasMore: Boolean!
  }

  # Queries
  type Query {
    # Card Queries
    card(id: ID!): Card
    cards(
      pagination: PaginationInput
      filter: CardFilterInput
      sort: CardSortInput
    ): PaginatedCards!
    
    # User Queries
    user(id: ID!): User
    currentUser: User
    
    # Collection Queries
    collection(id: ID!): Collection
    collections(
      userId: ID
      teamId: ID
      pagination: PaginationInput
    ): [Collection]!
    
    # Team Queries
    team(id: ID!): Team
    teams: [Team]!
    
    # Effect Queries
    effects(category: EffectCategory): [Effect]!
    
    # Digital Asset Queries
    digitalAsset(id: ID!): DigitalAsset
    digitalAssets(
      userId: ID
      tags: [String]
      pagination: PaginationInput
    ): [DigitalAsset]!
  }

  # Mutations
  type Mutation {
    # Card Mutations
    createCard(input: CardInput!): Card!
    updateCard(id: ID!, input: CardInput!): Card!
    deleteCard(id: ID!): Boolean!
    addCardToCollection(cardId: ID!, collectionId: ID!): Boolean!
    removeCardFromCollection(cardId: ID!, collectionId: ID!): Boolean!
    
    # Collection Mutations
    createCollection(input: CollectionInput!): Collection!
    updateCollection(id: ID!, input: CollectionInput!): Collection!
    deleteCollection(id: ID!): Boolean!
    
    # Team Mutations
    createTeam(name: String!, description: String): Team!
    updateTeam(id: ID!, name: String, description: String, logoUrl: String): Team!
    deleteTeam(id: ID!): Boolean!
    addTeamMember(teamId: ID!, userId: ID!, role: TeamRole!): TeamMember!
    updateTeamMemberRole(teamMemberId: ID!, role: TeamRole!): TeamMember!
    removeTeamMember(teamMemberId: ID!): Boolean!
    
    # Effect Mutations
    createEffect(input: EffectInput!): Effect!
    updateEffect(id: ID!, input: EffectInput!): Effect!
    deleteEffect(id: ID!): Boolean!
    applyEffectToCard(cardId: ID!, effectId: ID!, settings: JSONObject): Card!
    
    # Digital Asset Mutations
    uploadDigitalAsset(file: Upload!, title: String, description: String, tags: [String]): DigitalAsset!
    updateDigitalAsset(id: ID!, title: String, description: String, tags: [String]): DigitalAsset!
    deleteDigitalAsset(id: ID!): Boolean!
    
    # Comment Mutations
    createComment(content: String!, cardId: ID, collectionId: ID, teamId: ID, parentId: ID): Comment!
    updateComment(id: ID!, content: String!): Comment!
    deleteComment(id: ID!): Boolean!
    
    # Reaction Mutations
    addReaction(type: ReactionType!, cardId: ID, collectionId: ID, commentId: ID): Reaction!
    removeReaction(id: ID!): Boolean!
  }

  # Subscriptions
  type Subscription {
    cardCreated: Card!
    cardUpdated(id: ID!): Card!
    collectionUpdated(id: ID!): Collection!
    commentAdded(cardId: ID, collectionId: ID, teamId: ID): Comment!
    reactionAdded(cardId: ID, collectionId: ID, commentId: ID): Reaction!
  }
`;

export default typeDefs;
