
/**
 * API Documentation
 * 
 * This file contains documentation for all API endpoints used in the application.
 * It follows OpenAPI-like structure for consistency and can be used to generate
 * interactive documentation in the future.
 */

export interface ApiEndpointDoc {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters?: ApiParameterDoc[];
  requestBody?: ApiRequestBodyDoc;
  responses: Record<string, ApiResponseDoc>;
  tags?: string[];
}

export interface ApiParameterDoc {
  name: string;
  in: 'query' | 'path' | 'header';
  required: boolean;
  description: string;
  schema: {
    type: string;
    format?: string;
  };
}

export interface ApiRequestBodyDoc {
  description: string;
  required: boolean;
  content: {
    [contentType: string]: {
      schema: any;
      example?: any;
    };
  };
}

export interface ApiResponseDoc {
  description: string;
  content?: {
    [contentType: string]: {
      schema: any;
      example?: any;
    };
  };
}

/**
 * Cards API Documentation
 */
export const cardsApiDocs: Record<string, ApiEndpointDoc> = {
  getCards: {
    path: '/cards',
    method: 'GET',
    description: 'Retrieve all cards with optional filtering',
    parameters: [
      {
        name: 'teamId',
        in: 'query',
        required: false,
        description: 'Filter cards by team ID',
        schema: { type: 'string', format: 'uuid' }
      },
      {
        name: 'collectionId',
        in: 'query',
        required: false,
        description: 'Filter cards by collection ID',
        schema: { type: 'string', format: 'uuid' }
      },
      {
        name: 'tags',
        in: 'query',
        required: false,
        description: 'Filter cards by tags (comma-separated)',
        schema: { type: 'string' }
      }
    ],
    responses: {
      '200': {
        description: 'List of cards matching the filter criteria',
        content: {
          'application/json': {
            schema: { type: 'array', items: { $ref: '#/components/schemas/Card' } }
          }
        }
      },
      '401': {
        description: 'Unauthorized - User authentication required'
      },
      '500': {
        description: 'Server error'
      }
    },
    tags: ['cards']
  },
  getCardById: {
    path: '/cards/{id}',
    method: 'GET',
    description: 'Get a specific card by ID',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Unique identifier of the card',
        schema: { type: 'string', format: 'uuid' }
      }
    ],
    responses: {
      '200': {
        description: 'Card details',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Card' }
          }
        }
      },
      '404': {
        description: 'Card not found'
      },
      '401': {
        description: 'Unauthorized - User authentication required'
      }
    },
    tags: ['cards']
  },
  createCard: {
    path: '/cards',
    method: 'POST',
    description: 'Create a new card',
    requestBody: {
      description: 'Card data to create',
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/CardCreate' }
        }
      }
    },
    responses: {
      '201': {
        description: 'Card created successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Card' }
          }
        }
      },
      '400': {
        description: 'Invalid card data'
      },
      '401': {
        description: 'Unauthorized - User authentication required'
      }
    },
    tags: ['cards']
  }
};

/**
 * Collections API Documentation
 */
export const collectionsApiDocs: Record<string, ApiEndpointDoc> = {
  getCollections: {
    path: '/collections',
    method: 'GET',
    description: 'Retrieve all collections',
    responses: {
      '200': {
        description: 'List of collections',
        content: {
          'application/json': {
            schema: { type: 'array', items: { $ref: '#/components/schemas/Collection' } }
          }
        }
      },
      '401': {
        description: 'Unauthorized - User authentication required'
      }
    },
    tags: ['collections']
  }
};

/**
 * Schema definitions for API documentation
 */
export const apiSchemas = {
  Card: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      title: { type: 'string' },
      description: { type: 'string' },
      imageUrl: { type: 'string', format: 'uri' },
      thumbnailUrl: { type: 'string', format: 'uri' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      userId: { type: 'string', format: 'uuid' },
      teamId: { type: 'string', format: 'uuid' },
      collectionId: { type: 'string', format: 'uuid' },
      isPublic: { type: 'boolean' },
      tags: { type: 'array', items: { type: 'string' } },
      designMetadata: { type: 'object' },
      reactions: { type: 'array', items: { $ref: '#/components/schemas/Reaction' } }
    },
    required: ['id', 'title', 'userId']
  },
  CardCreate: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      imageUrl: { type: 'string', format: 'uri' },
      thumbnailUrl: { type: 'string', format: 'uri' },
      teamId: { type: 'string', format: 'uuid' },
      collectionId: { type: 'string', format: 'uuid' },
      isPublic: { type: 'boolean' },
      tags: { type: 'array', items: { type: 'string' } },
      designMetadata: { type: 'object' }
    },
    required: ['title']
  },
  Reaction: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      cardId: { type: 'string', format: 'uuid' },
      type: { type: 'string', enum: ['like', 'love', 'wow', 'haha', 'sad', 'angry'] },
      createdAt: { type: 'string', format: 'date-time' }
    }
  }
};
