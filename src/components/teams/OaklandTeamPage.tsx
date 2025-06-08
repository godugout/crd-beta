import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Team } from '@/lib/types/teamTypes';
import OaklandHomepage from '@/components/oakland/OaklandHomepage';
import { Plus, Images, BookOpen, Mic, MessageSquare } from 'lucide-react';

interface OaklandTeamPageProps {
  team: Team;
}

const OaklandTeamPage: React.FC<OaklandTeamPageProps> = ({ team }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-yellow-900">
      {/* Oakland Homepage Content */}
      <OaklandHomepage team={team} />
      
      {/* Quick Actions Section */}
      <section className="py-16 bg-gray-900/80">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-center text-white mb-12">
            Your Oakland Story Awaits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Create Memory */}
            <Card className="bg-gradient-to-br from-green-800 to-green-900 border-green-600/30 hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-green-900" />
                </div>
                <CardTitle className="text-white">Create Memory</CardTitle>
                <CardDescription className="text-gray-300">
                  Share your Oakland baseball moments
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to="/teams/oakland-athletics/memories/create">
                  <Button className="w-full bg-yellow-400 text-green-900 hover:bg-yellow-500">
                    Start Building
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Browse Memories */}
            <Card className="bg-gradient-to-br from-blue-800 to-blue-900 border-blue-600/30 hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                  <Images className="h-8 w-8 text-blue-900" />
                </div>
                <CardTitle className="text-white">Memory Gallery</CardTitle>
                <CardDescription className="text-gray-300">
                  Explore fan memories and stories
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to="/teams/oakland-athletics/memories">
                  <Button className="w-full bg-yellow-400 text-blue-900 hover:bg-yellow-500">
                    Browse Gallery
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Template Library */}
            <Card className="bg-gradient-to-br from-purple-800 to-purple-900 border-purple-600/30 hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-purple-900" />
                </div>
                <CardTitle className="text-white">Templates</CardTitle>
                <CardDescription className="text-gray-300">
                  Oakland-themed design templates
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to="/teams/oakland-athletics/templates">
                  <Button className="w-full bg-yellow-400 text-purple-900 hover:bg-yellow-500">
                    View Templates
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Fan Expressions */}
            <Card className="bg-gradient-to-br from-red-800 to-red-900 border-red-600/30 hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                  <Mic className="h-8 w-8 text-red-900" />
                </div>
                <CardTitle className="text-white">Fan Voice</CardTitle>
                <CardDescription className="text-gray-300">
                  Chants, cheers, and expressions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full bg-yellow-400 text-red-900 hover:bg-yellow-500">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Fan Stats */}
          <div className="mt-12 text-center">
            <div className="flex justify-center space-x-8 text-white">
              <div>
                <div className="text-3xl font-bold text-yellow-400">1,250+</div>
                <div className="text-sm text-gray-400">Fan Memories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">50+</div>
                <div className="text-sm text-gray-400">Fan Expressions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">25+</div>
                <div className="text-sm text-gray-400">Years of History</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">∞</div>
                <div className="text-sm text-gray-400">Oakland Pride</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-800 to-yellow-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            We Stayed in the Stands
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Because no one can relocate what we made together. Share your Oakland memories and keep the spirit alive forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/teams/oakland-athletics/memories/create">
              <Button size="lg" className="bg-white text-green-800 hover:bg-gray-100">
                Create Your First Memory
              </Button>
            </Link>
            <Link to="/teams/oakland-athletics/memories">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800">
                Explore the Archive
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OaklandTeamPage;
