
import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from '@/pages/Dashboard';
import Gallery from '@/pages/Gallery';
import CardCreatorPage from '@/pages/CardCreatorPage';

// Mock the imports
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { 
      id: '123', 
      email: 'test@example.com',
      role: 'user',
      displayName: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    isLoading: false
  })
}));

jest.mock('@/components/dashboard/AdminDashboard', () => () => <div>Admin Dashboard</div>);
jest.mock('@/components/dashboard/ArtistDashboard', () => () => <div>Artist Dashboard</div>);
jest.mock('@/components/dashboard/FanDashboard', () => () => <div>Fan Dashboard</div>);
jest.mock('@/components/navigation/PageLayout', () => ({ children, title }) => (
  <div>
    <h1>{title}</h1>
    {children}
  </div>
));
jest.mock('@/components/CardGallery', () => () => <div>Card Gallery</div>);
jest.mock('@/components/card-creation/CardMakerWizard', () => () => <div>Card Maker Wizard</div>);
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: null }),
  useParams: () => ({ id: null })
}));
jest.mock('@/context/CardContext', () => ({
  useCards: () => ({
    displayCards: [],
    isLoading: false
  })
}));

describe('Page Rendering', () => {
  test('Dashboard should render without errors for a user', () => {
    const { container } = render(<Dashboard />);
    expect(container).toBeTruthy();
  });
  
  test('Gallery should render without errors', () => {
    const { container } = render(<Gallery />);
    expect(container).toBeTruthy();
  });
  
  test('CardCreatorPage should render without errors', () => {
    const { container } = render(<CardCreatorPage />);
    expect(container).toBeTruthy();
  });
});
