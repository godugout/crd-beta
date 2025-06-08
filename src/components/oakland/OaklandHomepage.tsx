
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { OaklandMemory, OaklandExpression, OaklandEvent } from '@/lib/types/oaklandTypes';
import { 
  Plus, 
  Heart, 
  MapPin, 
  Calendar, 
  Users, 
  Megaphone,
  Trophy,
  Camera,
  LogIn,
  LogOut,
  Archive
} from 'lucide-react';

const OaklandHomepage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [memories, setMemories] = useState<OaklandMemory[]>([]);
  const [expressions, setExpressions] = useState<OaklandExpression[]>([]);
  const [events, setEvents] = useState<OaklandEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch recent memories
      const { data: memoriesData } = await supabase
        .from('oakland_memories')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(6);

      if (memoriesData) setMemories(memoriesData);

      // Fetch popular expressions
      const { data: expressionsData } = await supabase
        .from('oakland_expressions')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(8);

      if (expressionsData) setExpressions(expressionsData);

      // Fetch featured events
      const { data: eventsData } = await supabase
        .from('oakland_events')
        .select('*')
        .eq('is_historical', true)
        .order('event_date', { ascending: false })
        .limit(4);

      if (eventsData) setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEraDisplay = (era: string) => {
    const eraMap: Record<string, { label: string; icon: string }> = {
      'dynasty_70s': { label: 'Dynasty 70s', icon: '👑' },
      'bash_brothers': { label: 'Bash Brothers', icon: '💪' },
      'moneyball': { label: 'Moneyball', icon: '📊' },
      'playoff_runs': { label: 'Playoff Runs', icon: '🎯' },
      'farewell': { label: 'Farewell', icon: '👋' },
      'early_years': { label: 'Early Years', icon: '🌱' }
    };
    return eraMap[era] || { label: era, icon: '⚾' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-yellow-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Oakland memories...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-yellow-900">
      {/* Header */}
      <header className="border-b border-green-600/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">OAK.FAN</h1>
            <p className="text-yellow-400 text-sm">We Stayed in the Stands</p>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/oakland/create')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Memory
                </Button>
                <Button 
                  variant="outline" 
                  onClick={signOut}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Join the Community
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-4">
            We Stayed in the Stands
          </h2>
          <p className="text-xl text-yellow-400 mb-6">
            Because no one can relocate what we made together
          </p>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
            OAK.FAN is a digital sanctuary for Oakland A's fans—a community-powered platform 
            that transforms displaced fan energy into creative memories, protest art, and digital collectibles.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate(user ? '/oakland/create' : '/auth')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Camera className="h-5 w-5 mr-2" />
              {user ? 'Create a Memory' : 'Join & Create'}
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/gallery')}
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-900/20"
            >
              <Archive className="h-5 w-5 mr-2" />
              Explore the Archive
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Memories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-white">Latest Fan Memories</h3>
            <Link to="/gallery" className="text-yellow-400 hover:text-yellow-300">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => {
              const era = getEraDisplay(memory.era);
              return (
                <Card key={memory.id} className="bg-gray-800/80 backdrop-blur-sm border-green-600/30 hover:border-green-500/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                        {era.icon} {era.label}
                      </Badge>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        {memory.memory_type}
                      </Badge>
                    </div>
                    <CardTitle className="text-white">{memory.title}</CardTitle>
                    {memory.description && (
                      <CardDescription className="text-gray-300">
                        {memory.description.substring(0, 100)}...
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-400">
                      {memory.game_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(memory.game_date).toLocaleDateString()}
                        </div>
                      )}
                      {memory.opponent && (
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          vs {memory.opponent}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {memory.location}
                      </div>
                    </div>
                    
                    {memory.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {memory.emotions.slice(0, 3).map((emotion) => (
                          <Badge key={emotion} variant="secondary" className="text-xs">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fan Expressions */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              <Megaphone className="inline h-8 w-8 mr-2 text-yellow-400" />
              The Voice of Oakland
            </h3>
            <p className="text-gray-300">Chants, cheers, and expressions that define Oakland fandom</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {expressions.map((expression) => (
              <Card key={expression.id} className="bg-gray-800/60 border-gray-600 hover:border-yellow-500/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="text-yellow-400 font-medium mb-2">
                    "{expression.text_content}"
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {expression.category}
                  </Badge>
                  {expression.decade && (
                    <Badge variant="secondary" className="text-xs ml-1">
                      {expression.decade}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Events */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Oakland Baseball History
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => {
              const era = getEraDisplay(event.era || 'early_years');
              return (
                <Card key={event.id} className="bg-gray-800/80 backdrop-blur-sm border-green-600/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                        {era.icon} {era.label}
                      </Badge>
                      <Badge className="bg-green-600">
                        {event.event_type}
                      </Badge>
                    </div>
                    <CardTitle className="text-white">{event.title}</CardTitle>
                    {event.description && (
                      <CardDescription className="text-gray-300">
                        {event.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {event.event_date && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-600/30 bg-black/40 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 mb-4">
            Preserving Oakland baseball memories, one story at a time.
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <span className="text-green-400">🌱 Preserve</span>
            <span className="text-red-400">✊ Protest</span>
            <span className="text-yellow-400">🎨 Create</span>
            <span className="text-blue-400">🎉 Celebrate</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OaklandHomepage;
