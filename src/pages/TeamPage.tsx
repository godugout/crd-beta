
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Link, useParams } from 'react-router-dom';
import { Users, BookOpen, Plus, Image, Star, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TeamPage = () => {
  const { teamId } = useParams<{ teamId?: string }>();
  
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

  // If we are viewing a specific team page
  if (teamId) {
    const team = teams.find(t => t.id === teamId);
    
    if (!team) {
      return (
        <PageLayout title="Team Not Found" description="The requested team could not be found">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Team Not Found</h1>
            <p>The team you're looking for doesn't exist. Return to <Link to="/teams" className="text-blue-600 hover:underline">all teams</Link>.</p>
          </div>
        </PageLayout>
      );
    }
    
    // Special content for Oakland team
    if (teamId === 'oakland') {
      return (
        <PageLayout title={team.name} description={team.description}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="h-16 w-16 mr-4" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold" style={{ color: team.primaryColor }}>{team.name}</h1>
                <p className="text-gray-600">{team.description}</p>
              </div>
            </div>
            
            {/* Promotional Banner for OAK.FAN */}
            <div 
              className="mb-8 p-6 rounded-lg shadow-md text-white"
              style={{ 
                background: `linear-gradient(135deg, ${team.primaryColor} 0%, ${team.primaryColor}dd 100%)`,
              }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold mb-2">OAK.FAN - Oakland Sports Legacy Project</h2>
                  <p className="text-white/90">Preserve and share your memories of Oakland sports history</p>
                </div>
                <Button 
                  asChild
                  className="bg-white hover:bg-gray-100" 
                  style={{ color: team.primaryColor }}
                >
                  <Link to="/oakland-landing">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Oakland Memories Feature Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Memory Creator Card */}
              <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
                <div 
                  className="h-36 p-6 flex items-center justify-center"
                  style={{ backgroundColor: `${team.primaryColor}10` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full mb-2 flex items-center justify-center" style={{ backgroundColor: team.primaryColor }}>
                      <Plus className="h-7 w-7 text-white" />
                    </div>
                    <span className="font-medium" style={{ color: team.primaryColor }}>Create Memory</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2">Share Your Oakland Story</h3>
                  <p className="text-gray-600 mb-4">Preserve your personal memories of Oakland sports moments.</p>
                  <Button asChild variant="outline" className="w-full" style={{ borderColor: team.primaryColor, color: team.primaryColor }}>
                    <Link to="/oakland-memory-creator">Create Memory</Link>
                  </Button>
                </div>
              </div>
              
              {/* Browse Memories Card */}
              <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
                <div 
                  className="h-36 p-6 flex items-center justify-center"
                  style={{ backgroundColor: `${team.primaryColor}10` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full mb-2 flex items-center justify-center" style={{ backgroundColor: team.primaryColor }}>
                      <BookOpen className="h-7 w-7 text-white" />
                    </div>
                    <span className="font-medium" style={{ color: team.primaryColor }}>Browse Memories</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2">Oakland Memories Archive</h3>
                  <p className="text-gray-600 mb-4">Explore stories and memories from Oakland fans worldwide.</p>
                  <Button asChild variant="outline" className="w-full" style={{ borderColor: team.primaryColor, color: team.primaryColor }}>
                    <Link to="/oakland-memories">View Memories</Link>
                  </Button>
                </div>
              </div>
              
              {/* History Project Card */}
              <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
                <div 
                  className="h-36 p-6 flex items-center justify-center"
                  style={{ backgroundColor: `${team.primaryColor}10` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full mb-2 flex items-center justify-center" style={{ backgroundColor: team.primaryColor }}>
                      <BookMarked className="h-7 w-7 text-white" />
                    </div>
                    <span className="font-medium" style={{ color: team.primaryColor }}>About the Project</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2">Oakland Sports Legacy</h3>
                  <p className="text-gray-600 mb-4">Learn about our mission to preserve Oakland's rich sports history.</p>
                  <Button asChild variant="outline" className="w-full" style={{ borderColor: team.primaryColor, color: team.primaryColor }}>
                    <Link to="/oakland/OaklandLanding">About OAK.FAN</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Team Schedule and Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-3">Team Info</h2>
                <p className="text-gray-600">Oakland Athletics team details and history</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-3">Team Schedule</h2>
                <p className="text-gray-600">Upcoming games and events</p>
              </div>
            </div>
          </div>
        </PageLayout>
      );
    }
    
    // Regular team page for non-Oakland teams
    return (
      <PageLayout title={team.name} description={team.description}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            {team.logo ? (
              <img src={team.logo} alt={team.name} className="h-16 w-16 mr-4" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                <Users className="h-8 w-8 text-gray-500" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold" style={{ color: team.primaryColor }}>{team.name}</h1>
              <p className="text-gray-600">{team.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-3">Team Info</h2>
              <p className="text-gray-600">{team.name} team details and history</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-3">Team Schedule</h2>
              <p className="text-gray-600">Upcoming games and events</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Teams overview page (original code)
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
