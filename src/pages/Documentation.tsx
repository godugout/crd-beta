
import React from 'react';
import ApiDocumentation from '@/components/documentation/ApiDocumentation';
import ComponentDocs from '@/components/documentation/ComponentDocs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MobileOptimizedLayout from '@/components/layout/MobileOptimizedLayout';
import CardPreview from '@/components/card-creation/components/CardPreview';
import ColorPicker from '@/components/ui/color-picker';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { debugObject } from '@/utils/debugRenderer';

const Documentation: React.FC = () => {
  // Simple state for examples
  const [selectedColor, setSelectedColor] = useState('#8B5CF6');
  const [sampleCard] = useState<Partial<Card>>({
    id: 'sample-1',
    title: 'Sample Card',
    player: 'John Smith',
    team: 'All Stars',
    imageUrl: '/placeholder-card.png',
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
    }
  });
  
  // Log for debugging
  if (process.env.NODE_ENV === 'development') {
    debugObject('Documentation page initialized', { sampleCard });
  }

  const componentDocs = [
    {
      name: 'CardPreview',
      description: 'A component for displaying card previews with various visual effects and styling options.',
      imports: [
        "import CardPreview from '@/components/card-creation/components/CardPreview';",
        "import { Card } from '@/lib/types/cardTypes';"
      ],
      props: [
        {
          name: 'card',
          type: 'Partial<Card> | undefined',
          required: false,
          description: 'Card data object containing image, title, and styling information'
        },
        {
          name: 'className',
          type: 'string',
          required: false,
          description: 'Additional CSS classes to apply to the component'
        },
        {
          name: 'effectClasses',
          type: 'string',
          defaultValue: '""',
          required: false,
          description: 'CSS classes for applying visual effects to the card'
        }
      ],
      examples: [
        {
          title: 'Basic Card Preview',
          code: `<CardPreview 
  card={{
    title: 'Sample Card',
    player: 'John Smith',
    team: 'All Stars',
    imageUrl: '/placeholder-card.png'
  }}
/>`,
          preview: <div className="w-40"><CardPreview card={sampleCard} /></div>
        },
        {
          title: 'Card Preview with Effect',
          code: `<CardPreview 
  card={card}
  effectClasses="holographic-effect"
/>`,
          preview: <div className="w-40"><CardPreview card={sampleCard} effectClasses="holographic-effect" /></div>
        }
      ],
      notes: [
        'Automatically handles empty states when no card is provided',
        'Optimizes performance on mobile devices by reducing effect complexity',
        'Uses the ResponsiveImage component for optimized image loading',
        'Adapts effect quality based on device capabilities'
      ]
    },
    {
      name: 'ColorPicker',
      description: 'A component for selecting colors with predefined palette and custom color input.',
      imports: ["import ColorPicker from '@/components/ui/color-picker';"],
      props: [
        {
          name: 'color',
          type: 'string',
          required: true,
          description: 'The currently selected color value (hex format)'
        },
        {
          name: 'onChange',
          type: '(color: string) => void',
          required: true,
          description: 'Callback function called when a color is selected'
        },
        {
          name: 'className',
          type: 'string',
          required: false,
          description: 'Additional CSS classes to apply to the component'
        },
        {
          name: 'title',
          type: 'string',
          defaultValue: '"Select color"',
          required: false,
          description: 'Tooltip title for the color picker'
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          defaultValue: "'md'",
          required: false,
          description: 'Size variant for the color swatches'
        }
      ],
      examples: [
        {
          title: 'Basic Color Picker',
          code: `const [color, setColor] = useState('#8B5CF6');\n\n<ColorPicker color={color} onChange={setColor} />`,
          preview: (
            <div>
              <ColorPicker color={selectedColor} onChange={setSelectedColor} />
              <div className="mt-2 text-xs">Selected: <span className="font-mono">{selectedColor}</span></div>
            </div>
          )
        },
        {
          title: 'Small Size Color Picker',
          code: `<ColorPicker color={color} onChange={setColor} size="sm" />`,
          preview: <ColorPicker color={selectedColor} onChange={setSelectedColor} size="sm" />
        }
      ],
      notes: [
        'Provides haptic feedback on mobile devices',
        'Includes predefined color palette for quick selection',
        'Supports custom color selection via native color picker',
        'Adapts to mobile devices with larger touch targets'
      ]
    }
  ];
  
  const apiDocs = [
    {
      title: 'UGC API',
      description: 'API endpoints for managing user-generated content (UGC)',
      endpoints: [
        {
          name: 'List Assets',
          method: 'GET',
          endpoint: '/api/ugc/assets',
          description: 'Retrieves a list of UGC assets with optional filtering',
          parameters: [
            {
              name: 'type',
              type: 'string',
              required: false,
              description: 'Filter by asset type (sticker, logo, frame, etc.)'
            },
            {
              name: 'category',
              type: 'string',
              required: false,
              description: 'Filter by asset category'
            },
            {
              name: 'tags',
              type: 'string[]',
              required: false,
              description: 'Filter by one or more tags'
            },
            {
              name: 'creator',
              type: 'string',
              required: false,
              description: 'Filter by creator ID'
            }
          ],
          responseExample: `{
  "assets": [
    {
      "id": "asset-123",
      "title": "Star Logo",
      "description": "A star-shaped logo element",
      "assetType": "logo",
      "category": "sports",
      "url": "/assets/star-logo.png",
      "thumbnailUrl": "/assets/star-logo-thumb.png",
      "tags": ["star", "logo", "sports"],
      "isOfficial": true,
      "isPremium": false,
      "createdAt": "2023-05-15T10:30:00Z"
    },
    ...
  ],
  "total": 243,
  "page": 1,
  "pageSize": 20
}`
        },
        {
          name: 'Upload Asset',
          method: 'POST',
          endpoint: '/api/ugc/assets',
          description: 'Upload a new UGC asset to the marketplace',
          parameters: [
            {
              name: 'title',
              type: 'string',
              required: true,
              description: 'Title of the asset'
            },
            {
              name: 'description',
              type: 'string',
              required: false,
              description: 'Description of the asset'
            },
            {
              name: 'assetType',
              type: 'string',
              required: true,
              description: 'Type of asset (sticker, logo, frame, etc.)'
            },
            {
              name: 'file',
              type: 'File',
              required: true,
              description: 'The asset file to upload'
            },
            {
              name: 'tags',
              type: 'string[]',
              required: false,
              description: 'Tags to associate with the asset'
            }
          ],
          requestExample: `// Using FormData
const formData = new FormData();
formData.append('title', 'My Custom Logo');
formData.append('description', 'A custom logo for sports cards');
formData.append('assetType', 'logo');
formData.append('file', fileObject);
formData.append('tags', JSON.stringify(['custom', 'logo', 'sports']));

fetch('/api/ugc/assets', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': 'Bearer <token>'
  }
});`,
          responseExample: `{
  "success": true,
  "asset": {
    "id": "asset-456",
    "title": "My Custom Logo",
    "description": "A custom logo for sports cards",
    "assetType": "logo",
    "category": "user-generated",
    "url": "/user-assets/custom-logo-123.png",
    "thumbnailUrl": "/user-assets/custom-logo-123-thumb.png",
    "tags": ["custom", "logo", "sports"],
    "isOfficial": false,
    "isPremium": false,
    "createdAt": "2023-05-16T14:22:30Z"
  }
}`
        }
      ]
    },
    {
      title: 'Card Effects',
      description: 'API endpoints for managing card visual effects',
      endpoints: [
        {
          name: 'Get Available Effects',
          method: 'GET',
          endpoint: '/api/effects',
          description: 'Retrieve a list of available card effects',
          responseExample: `{
  "effects": [
    {
      "id": "holographic",
      "name": "Holographic",
      "description": "Shimmering rainbow effect that changes with viewing angle",
      "thumbnail": "/effects/holographic-thumb.jpg",
      "category": "premium",
      "defaultSettings": {
        "intensity": 50,
        "speed": 5,
        "pattern": "waves"
      },
      "isPremium": true
    },
    ...
  ]
}`
        },
        {
          name: 'Apply Effect to Card',
          method: 'POST',
          endpoint: '/api/cards/:cardId/effects',
          description: 'Apply an effect to a specific card',
          parameters: [
            {
              name: 'cardId',
              type: 'string',
              required: true,
              description: 'ID of the card to apply the effect to'
            },
            {
              name: 'effectId',
              type: 'string',
              required: true,
              description: 'ID of the effect to apply'
            },
            {
              name: 'settings',
              type: 'object',
              required: false,
              description: 'Custom settings for the effect'
            }
          ],
          requestExample: `fetch('/api/cards/card-123/effects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    effectId: 'holographic',
    settings: {
      intensity: 75,
      speed: 3,
      pattern: 'diagonal'
    }
  })
});`,
          responseExample: `{
  "success": true,
  "card": {
    "id": "card-123",
    "effects": ["holographic"],
    "effectSettings": {
      "holographic": {
        "intensity": 75,
        "speed": 3,
        "pattern": "diagonal"
      }
    },
    "updatedAt": "2023-05-16T15:30:45Z"
  }
}`
        }
      ]
    }
  ];

  return (
    <MobileOptimizedLayout title="Documentation">
      <div className="container max-w-7xl px-4 py-6 space-y-8">
        <div className="prose dark:prose-invert max-w-none">
          <h1>CardShow Documentation</h1>
          <p>
            Welcome to the CardShow documentation. This guide provides detailed information about 
            components, APIs, and best practices for developing with the CardShow platform.
          </p>
        </div>
        
        <Tabs defaultValue="components" className="space-y-4">
          <TabsList>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="components" className="space-y-8">
            <ComponentDocs components={componentDocs} />
          </TabsContent>
          
          <TabsContent value="api">
            <ApiDocumentation sections={apiDocs} />
          </TabsContent>
          
          <TabsContent value="guides">
            <div className="prose dark:prose-invert max-w-none">
              <h2>User Guides</h2>
              <p>
                Comprehensive guides and tutorials for using the CardShow platform.
              </p>
              
              <h3>Creating Your First Card</h3>
              <ol>
                <li>
                  <strong>Select a template</strong> - Choose from one of our professionally 
                  designed card templates as a starting point.
                </li>
                <li>
                  <strong>Upload an image</strong> - Upload a high-quality image for your card.
                  We recommend at least 1200x1600 pixels for best results.
                </li>
                <li>
                  <strong>Customize styling</strong> - Adjust colors, borders, and text to match
                  your preferences.
                </li>
                <li>
                  <strong>Add effects</strong> - Enhance your card with premium visual effects
                  like holographic shimmer, refractor patterns, or textured foils.
                </li>
                <li>
                  <strong>Preview and save</strong> - Review your design from different angles
                  and save it to your collection.
                </li>
              </ol>
              
              <h3>Mobile Optimization Tips</h3>
              <ul>
                <li>
                  <strong>Reduce effects on low-end devices</strong> - The platform automatically
                  reduces effect complexity on low-end devices, but you can manually control this.
                </li>
                <li>
                  <strong>Work offline</strong> - Changes are saved locally and synced when you reconnect.
                </li>
                <li>
                  <strong>Use compressed images</strong> - Consider using our image optimization tool
                  when on limited connections.
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="testing">
            <div className="prose dark:prose-invert max-w-none">
              <h2>Testing Documentation</h2>
              <p>
                Learn how to write tests for CardShow components and features.
              </p>
              
              <h3>Testing Utilities</h3>
              <p>
                We provide several utilities to make testing easier:
              </p>
              
              <pre><code>{`// Import test utilities
import { 
  mockCard, 
  mockUGCAsset, 
  mockCardEffect,
  setupTestEnvironment,
  wait 
} from '@/utils/testUtils';

// Setup environment before tests
setupTestEnvironment();

// Create mock data
const card = mockCard({ title: 'Test Card' });
const asset = mockUGCAsset({ title: 'Test Asset' });
const effect = mockCardEffect({ name: 'Test Effect' });

// Example test
describe('CardPreview', () => {
  it('renders card title correctly', () => {
    render(<CardPreview card={card} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });
});`}</code></pre>
              
              <h3>Component Testing Example</h3>
              <p>Here's an example of testing a component with effects:</p>
              
              <pre><code>{`import { render, screen } from '@testing-library/react';
import CardPreview from '@/components/card-creation/components/CardPreview';
import { mockCard } from '@/utils/testUtils';

// Mock hooks
jest.mock('@/hooks/useMobileOptimization', () => ({
  useMobileOptimization: () => ({
    reduceEffects: false,
    optimizedRendering: { resolution: 1 }
  })
}));

describe('CardPreview', () => {
  it('applies effect classes correctly', () => {
    const testCard = mockCard({ title: 'Effect Test Card' });
    
    const { container } = render(
      <CardPreview 
        card={testCard} 
        effectClasses="holographic-premium" 
      />
    );
    
    // Find div with effect class
    expect(container.querySelector('.holographic-premium')).toBeInTheDocument();
  });
});`}</code></pre>
              
              <h3>Running Tests</h3>
              <p>Use the following commands to run tests:</p>
              
              <ul>
                <li><code>npm test</code> - Run all tests</li>
                <li><code>npm test -- --watch</code> - Run tests in watch mode</li>
                <li><code>npm test -- --coverage</code> - Run tests with coverage report</li>
              </ul>
              
              <div className="not-prose my-6">
                <Button>View Full Testing Guidelines</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileOptimizedLayout>
  );
};

export default Documentation;
