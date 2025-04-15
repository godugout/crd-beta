
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { getTeamById } from '@/data/baseballTeamColors';
import TeamHeaderSection from '@/components/baseball/TeamHeaderSection';
import TeamTabsSection from '@/components/baseball/TeamTabsSection';
import TownNotFoundSection from '@/components/towns/TownNotFoundSection';
import { useTeamTheme } from '@/context/ThemeContext';
import { TeamThemeProvider } from '@/context/ThemeContext';

const TownDetailContent: React.FC = () => {
  const { townId } = useParams<{ townId: string }>();
  const [activeTab, setActiveTab] = useState('colors');
  const { themes, setCurrentTheme } = useTeamTheme();
  
  const team = townId ? getTeamById(townId) : undefined;
  
  // Get current colors (most recent in history)
  const currentColors = team?.colorHistory.length ? 
    team.colorHistory.reduce((latest, current) => current.year > latest.year ? current : latest) 
    : null;
  
  // Apply team theme when town changes
  useEffect(() => {
    if (townId && themes) {
      // Try to find a matching theme for this town
      const townTheme = themes.find(t => t.id === townId);
      if (townTheme) {
        setCurrentTheme(townTheme.id);
      } else if (townId === 'oakland' && themes.find(t => t.id === 'oakland')) {
        // Special case for Oakland town
        setCurrentTheme('oakland');
      } else {
        // Default theme
        setCurrentTheme('default');
      }
    }
  }, [townId, themes, setCurrentTheme]);
  
  if (!team) {
    return (
      <PageLayout title="Town Not Found" description="The requested town could not be found">
        <div className="container mx-auto px-4 py-8">
          <TownNotFoundSection />
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title={team.fullName || team.name} description={`${team.fullName} town history and statistics`}>
      <div className="container mx-auto px-4 py-6">
        <TeamHeaderSection team={team} currentColors={currentColors} />
        <TeamTabsSection team={team} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </PageLayout>
  );
};

const TownDetail: React.FC = () => {
  return (
    <TeamThemeProvider>
      <TownDetailContent />
    </TeamThemeProvider>
  );
};

export default TownDetail;
