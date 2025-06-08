
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Music, Palette, LogIn, LogOut, Home } from 'lucide-react';
import { useAuth } from '@/context/auth/AuthProvider';
import { Team } from '@/lib/types/teamTypes';
import WalkmanPlayer from '@/components/oakland/walkman/WalkmanPlayer';

interface OaklandHomepageProps {
  team?: Team;
}

const OaklandHomepage: React.FC<OaklandHomepageProps> = ({ team }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Use team slug for routing if provided, fallback to legacy oakland routes
  const teamSlug = team?.slug || 'oakland-athletics';
  const isLegacyRoute = !team; // If no team passed, we're on legacy route

  const getRoutePrefix = () => {
    return isLegacyRoute ? '/oakland' : `/teams/${teamSlug}`;
  };

  return (
    <div className="min-h-screen bg-oakland-primary">
      {/* Navigation Header */}
      <header className="border-b border-green-600/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-display font-bold text-yellow-400">
              OAK.FAN
            </h1>
            <span className="text-white text-sm font-nostalgia">
              We Stayed in the Stands
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            {user ? (
              <>
                <Button 
                  onClick={() => navigate(`${getRoutePrefix()}/create`)}
                  className="btn-oakland-primary"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Memory
                </Button>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="btn-oakland-primary"
                size="sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Join
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-oakland-hero font-protest text-white mb-6">
            We Stayed in the Stands
          </h1>
          <p className="text-xl text-yellow-400 mb-8 font-display max-w-2xl mx-auto">
            Because no one can relocate what we made together. 
            This is OAK.FAN - where Oakland baseball lives forever.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => navigate(`${getRoutePrefix()}/create`)}
              size="lg"
              className="btn-oakland-primary text-lg px-8 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create a Memory
            </Button>
            <Button
              onClick={() => navigate(`${getRoutePrefix()}/memories`)}
              variant="outline"
              size="lg"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-green-900 text-lg px-8 py-3"
            >
              Explore the Archive
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="oakland-memory-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Users className="h-5 w-5" />
                Fan Memories
              </CardTitle>
              <CardDescription className="text-gray-300">
                Share your Oakland baseball stories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate(`${getRoutePrefix()}/memories`)}
                className="w-full btn-oakland-primary"
              >
                Explore
              </Button>
            </CardContent>
          </Card>

          <Card className="oakland-memory-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Music className="h-5 w-5" />
                Walkman Player
              </CardTitle>
              <CardDescription className="text-gray-300">
                Listen to fan audio memories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Audio player available in bottom right
              </p>
            </CardContent>
          </Card>

          <Card className="oakland-memory-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Palette className="h-5 w-5" />
                Templates
              </CardTitle>
              <CardDescription className="text-gray-300">
                Oakland-themed memory templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate(`${getRoutePrefix()}/templates`)}
                className="w-full btn-oakland-primary"
              >
                Browse
              </Button>
            </CardContent>
          </Card>

          <Card className="oakland-memory-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Plus className="h-5 w-5" />
                Create
              </CardTitle>
              <CardDescription className="text-gray-300">
                Build your Oakland memory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate(`${getRoutePrefix()}/create`)}
                className="w-full btn-oakland-primary"
              >
                Start Creating
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Walkman Player */}
      <WalkmanPlayer />

      {/* Footer */}
      <footer className="border-t border-green-600/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400 font-nostalgia">
            Oakland baseball lives in our memories. Forever and always.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OaklandHomepage;
