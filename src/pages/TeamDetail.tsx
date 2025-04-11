
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { getTeamById } from '@/data/baseballTeamColors';
import TeamHeaderSection from '@/components/baseball/TeamHeaderSection';
import TeamTabsSection from '@/components/baseball/TeamTabsSection';
import TeamNotFoundSection from '@/components/baseball/TeamNotFoundSection';

const TeamDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [activeTab, setActiveTab] = useState('colors');
  
  const team = teamId ? getTeamById(teamId) : undefined;
  
  // Get current colors (most recent in history)
  const currentColors = team?.colorHistory.length ? 
    team.colorHistory.reduce((latest, current) => current.year > latest.year ? current : latest) 
    : null;
  
  if (!team) {
    return (
      <PageLayout title="Team Not Found" description="The requested team could not be found">
        <div className="container mx-auto px-4 py-8">
          <TeamNotFoundSection />
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title={team.fullName || team.name} description={`${team.fullName} team history and statistics`}>
      <div className="container mx-auto px-4 py-6">
        <TeamHeaderSection team={team} currentColors={currentColors} />
        <TeamTabsSection team={team} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </PageLayout>
  );
};

export default TeamDetail;
