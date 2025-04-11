
import React from 'react';

interface TeamInfoSectionProps {
  teamName: string;
}

const TeamInfoSection: React.FC<TeamInfoSectionProps> = ({ teamName }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-3">Team Info</h2>
        <p className="text-gray-600">{teamName} team details and history</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-3">Team Schedule</h2>
        <p className="text-gray-600">Upcoming games and events</p>
      </div>
    </div>
  );
};

export default TeamInfoSection;
