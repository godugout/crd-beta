
import React from 'react';

interface TownInfoSectionProps {
  townName: string;
}

const TownInfoSection: React.FC<TownInfoSectionProps> = ({ townName }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-3">Town Info</h2>
        <p className="text-gray-600">{townName} town details and history</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-3">Local Groups</h2>
        <p className="text-gray-600">Groups and teams in {townName}</p>
      </div>
    </div>
  );
};

export default TownInfoSection;
