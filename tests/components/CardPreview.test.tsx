
import React from 'react';
import { render, screen } from '@testing-library/react';
import CardPreview from '@/components/card-creation/components/CardPreview';
import { mockCard } from '@/utils/testUtils';

// Setup mock for useMobileOptimization
jest.mock('@/hooks/useMobileOptimization', () => ({
  useMobileOptimization: () => ({
    reduceEffects: false,
    optimizedRendering: {
      resolution: 1,
    }
  })
}));

// Setup mock for useIsMobile
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}));

// Mock ResponsiveImage component
jest.mock('@/components/ui/responsive-image', () => ({
  ResponsiveImage: ({ alt, ...props }: any) => <img alt={alt} {...props} data-testid="responsive-image" />
}));

describe('CardPreview Component', () => {
  it('renders loading state when no card is provided', () => {
    render(<CardPreview />);
    expect(screen.getByText('Upload an image to see your card preview')).toBeInTheDocument();
  });

  it('renders card with image and title', () => {
    const testCard = mockCard({
      title: 'Test Card Title',
      player: 'John Doe',
      team: 'Test Team',
      imageUrl: '/test-image.jpg'
    });
    
    render(<CardPreview card={testCard} />);
    
    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
    expect(screen.getByText('John Doe • Test Team')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-image')).toHaveAttribute('src', '/test-image.jpg');
  });

  it('applies effect classes correctly', () => {
    const testCard = mockCard({
      imageUrl: '/test-image.jpg'
    });
    
    const { container } = render(
      <CardPreview 
        card={testCard} 
        effectClasses="test-effect gold-shimmer" 
      />
    );
    
    // Find div with effect classes
    const cardElement = container.querySelector('.test-effect.gold-shimmer');
    expect(cardElement).toBeInTheDocument();
  });

  it('applies card styling from designMetadata', () => {
    const testCard = mockCard({
      imageUrl: '/test-image.jpg',
      designMetadata: {
        cardStyle: {
          backgroundColor: '#FF0000',
          borderRadius: '12px',
          borderColor: '#00FF00',
          template: 'modern',
          effect: 'holographic',
          frameWidth: 3,
          frameColor: '#0000FF',
          shadowColor: 'rgba(0,0,0,0.5)'
        },
        textStyle: {
          titleColor: '#FFFF00',
          titleWeight: 'normal',
          titleAlignment: 'left',
          descriptionColor: '#FF00FF'
        },
        cardMetadata: {
          category: 'test',
          series: 'test',
          cardType: 'test'
        },
        marketMetadata: {
          isPrintable: true,
          isForSale: true,
          includeInCatalog: true
        }
      }
    });
    
    const { container } = render(<CardPreview card={testCard} />);
    
    // Find the card container and check its styles
    const cardElement = container.querySelector('.aspect-\\[2\\.5\\/3\\.5\\]');
    expect(cardElement).toHaveStyle({
      backgroundColor: '#FF0000',
      borderRadius: '12px',
      borderColor: '#00FF00'
    });
  });

  it('renders without player and team when not provided', () => {
    const testCard = mockCard({
      title: 'Test Card',
      player: undefined,
      team: undefined,
      imageUrl: '/test-image.jpg'
    });
    
    render(<CardPreview card={testCard} />);
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    // Check that player and team are not rendered
    const playerElement = screen.queryByText(/• Test Team/);
    expect(playerElement).not.toBeInTheDocument();
  });
});
