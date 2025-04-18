import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useCommunityTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('towns');

  useEffect(() => {
    // Set the initial tab based on the current route
    if (location.pathname.startsWith('/teams')) {
      setActiveTab('teams');
    } else if (location.pathname.startsWith('/towns')) {
      setActiveTab('towns');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Update URL to match the selected tab
    switch (tab) {
      case 'teams':
        navigate('/teams');
        break;
      case 'towns':
        navigate('/towns');
        break;
      default:
        // For other tabs, keep current route but maybe add a query param
        break;
    }
  };

  return {
    activeTab,
    setActiveTab: handleTabChange
  };
}

export default useCommunityTabs;
