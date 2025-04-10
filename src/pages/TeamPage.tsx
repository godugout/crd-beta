
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const TeamPage = () => {
  const teams = [
    {
      id: 'oakland',
      name: 'Oakland A\'s',
      logo: '/logo-oak.png',
      primaryColor: '#006341',
      secondaryColor: '#EFB21E',
      description: 'Oakland Athletics team page'
    },
    {
      id: 'sf-giants',
      name: 'San Francisco Giants',
      logo: '/logo-sfg.png',
      primaryColor: '#FD5A1E',
      secondaryColor: '#27251F',
      description: 'San Francisco Giants team page'
    }
  ];
  
  return (
    <PageLayout
      title="Teams"
      description="Browse team pages and collections"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Teams</h1>
          <p className="text-gray-600">
            Browse teams and their card collections
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map(team => (
            <Link to={`/teams/${team.id}`} key={team.id}>
              <div 
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white h-full"
              >
                <div 
                  className="h-40 flex items-center justify-center" 
                  style={{ 
                    backgroundColor: `${team.primaryColor}10` // 10% opacity version of primary color
                  }}
                >
                  {team.logo ? (
                    <img 
                      src={team.logo} 
                      alt={team.name} 
                      className="h-24 w-24 object-contain"
                    />
                  ) : (
                    <div 
                      className="h-20 w-20 rounded-full flex items-center justify-center" 
                      style={{ backgroundColor: team.primaryColor }}
                    >
                      <Users className="h-10 w-10 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 
                    className="font-medium text-lg" 
                    style={{ color: team.primaryColor }}
                  >
                    {team.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{team.description}</p>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Special Game Day Mode card */}
          <Link to="/game-day">
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-purple-50 h-full">
              <div className="h-40 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-500 mx-auto flex items-center justify-center">
                    <span className="text-white text-xl font-bold">LIVE</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-blue-600">Game Day Mode</h3>
                <p className="text-gray-600 mt-1">Enhanced experience for live games</p>
                <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Featured
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default TeamPage;
