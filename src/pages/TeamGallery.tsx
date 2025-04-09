
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  memberCount?: number;
}

const teams: Team[] = [
  { 
    id: '1', 
    name: 'Oakland A\'s', 
    slug: 'oakland', 
    description: 'Memories and cards for Oakland Athletics fans',
    color: '#006341',
    memberCount: 1243
  },
  { 
    id: '2', 
    name: 'San Francisco Giants', 
    slug: 'sf-giants', 
    description: 'A community for SF Giants fans to share their memories',
    color: '#FD5A1E',
    memberCount: 984
  },
  { 
    id: '3', 
    name: 'Los Angeles Dodgers', 
    slug: 'la-dodgers', 
    description: 'Dodgers memories and moments from fans',
    color: '#005A9C',
    memberCount: 756
  }
];

const TeamGallery = () => {
  return (
    <PageLayout title="Teams" description="Browse team memories and collections">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Teams</h1>
            <p className="text-gray-600 mt-2">Browse team memories and collections</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div 
                className="h-16 flex items-center justify-center text-white text-xl font-bold" 
                style={{ backgroundColor: team.color }}
              >
                {team.name}
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{team.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{team.memberCount?.toLocaleString() || 0} fans</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline">
                    <Link to={`/teams/${team.slug}/memories`}>View Memories</Link>
                  </Button>
                  <Button asChild>
                    <Link to={`/teams/${team.slug}/memories/new`}>Create Memory</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default TeamGallery;
