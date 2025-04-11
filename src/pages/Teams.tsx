
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

const Teams = () => {
  const teams = [
    { id: 'oakland', name: 'Oakland A\'s', color: '#006341', members: 24 },
    { id: 'sf-giants', name: 'SF Giants', color: '#FD5A1E', members: 18 },
    { id: 'la-dodgers', name: 'LA Dodgers', color: '#005A9C', members: 22 },
    { id: 'ny-yankees', name: 'NY Yankees', color: '#0C2340', members: 31 }
  ];

  return (
    <PageLayout
      title="Teams | CardShow"
      description="Join teams and share cards with other members"
    >
      <Container className="py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teams</h1>
            <p className="text-muted-foreground mt-1">Join teams and collaborate with other card collectors</p>
          </div>
          
          <Button asChild>
            <Link to="/teams/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <Link to={`/teams/${team.id}`} key={team.id}>
              <Card className="h-full hover:shadow-md transition-shadow dark:hover:shadow-gray-700">
                <CardContent className="p-6 flex items-center">
                  <div 
                    className="h-16 w-16 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${team.color}20` }}
                  >
                    <Users className="h-8 w-8" style={{ color: team.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-foreground">{team.name}</h3>
                    <p className="text-muted-foreground">{team.members} members</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          <Link to="/teams/create">
            <Card className="h-full border-dashed hover:border-primary hover:shadow-md transition-all dark:hover:shadow-gray-700">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-lg text-foreground">Create New Team</h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      </Container>
    </PageLayout>
  );
};

export default Teams;
