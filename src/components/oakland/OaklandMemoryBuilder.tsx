
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth/AuthProvider';
import { useOaklandNavigation } from '@/hooks/useOaklandNavigation';
import { toast } from 'sonner';
import { OaklandMemory, OaklandTemplate, OaklandExpression } from '@/lib/types/oaklandTypes';
import { CalendarDays, MapPin, Users, Heart, Megaphone, Camera, ArrowLeft } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';

const OaklandMemoryBuilder: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { goToMemories, handleMemoryCreated, handleMemoryError } = useOaklandNavigation();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<OaklandTemplate[]>([]);
  const [expressions, setExpressions] = useState<OaklandExpression[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    memory_type: 'game' as OaklandMemory['memory_type'],
    era: 'farewell' as OaklandMemory['era'],
    game_date: '',
    opponent: '',
    score: '',
    location: 'Oakland Coliseum',
    section: '',
    personal_significance: '',
    historical_context: '',
    attendees: '',
    tags: '',
    emotions: [] as string[],
    fan_expressions: [] as string[],
    template_id: '',
    visibility: 'public' as OaklandMemory['visibility']
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to create memories');
      goToMemories();
    }
  }, [user, authLoading, goToMemories]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch templates
      const { data: templatesData } = await supabase
        .from('oakland_templates')
        .select('*')
        .order('usage_count', { ascending: false });
      
      if (templatesData) {
        setTemplates(templatesData.map(template => ({
          ...template,
          category: template.category as OaklandTemplate['category'],
          era: template.era as OaklandTemplate['era'],
          config: (template.config || {}) as Record<string, any>,
          tags: template.tags || [],
          usage_count: template.usage_count || 0
        })));
      }

      // Fetch expressions
      const { data: expressionsData } = await supabase
        .from('oakland_expressions')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(50);
      
      if (expressionsData) {
        setExpressions(expressionsData.map(expression => ({
          ...expression,
          category: expression.category as OaklandExpression['category'],
          source: expression.source as OaklandExpression['source'],
          decade: expression.decade as OaklandExpression['decade'],
          era: expression.era as OaklandExpression['era'],
          emotion_tags: expression.emotion_tags || []
        })));
      }
    };

    fetchData();
  }, []);

  const emotionOptions = [
    { value: 'joy', label: '😊 Joy', color: 'bg-yellow-500' },
    { value: 'heartbreak', label: '💔 Heartbreak', color: 'bg-red-500' },
    { value: 'nostalgia', label: '🥺 Nostalgia', color: 'bg-purple-500' },
    { value: 'anger', label: '😡 Anger', color: 'bg-red-600' },
    { value: 'hope', label: '🌟 Hope', color: 'bg-blue-500' },
    { value: 'protest', label: '✊ Protest', color: 'bg-gray-800' }
  ];

  const handleEmotionToggle = (emotion: string) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const handleExpressionToggle = (expression: string) => {
    setFormData(prev => ({
      ...prev,
      fan_expressions: prev.fan_expressions.includes(expression)
        ? prev.fan_expressions.filter(e => e !== expression)
        : [...prev.fan_expressions, expression]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const memoryData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        memory_type: formData.memory_type,
        era: formData.era,
        game_date: formData.game_date || null,
        opponent: formData.opponent || null,
        score: formData.score || null,
        location: formData.location,
        section: formData.section || null,
        personal_significance: formData.personal_significance || null,
        historical_context: formData.historical_context || null,
        attendees: formData.attendees ? formData.attendees.split(',').map(s => s.trim()) : [],
        tags: formData.tags ? formData.tags.split(',').map(s => s.trim()) : [],
        emotions: formData.emotions,
        fan_expressions: formData.fan_expressions,
        template_id: formData.template_id || null,
        visibility: formData.visibility,
        effect_settings: {},
        is_featured: false,
        community_reactions: {}
      };

      const { data, error } = await supabase
        .from('oakland_memories')
        .insert([memoryData])
        .select()
        .single();

      if (error) throw error;

      handleMemoryCreated(data.id);
    } catch (error: any) {
      handleMemoryError(error.message || "Failed to create memory");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <PageLayout title="Create Memory" description="Loading...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageLayout 
      title="Create Oakland Memory" 
      description="Preserve your piece of Oakland baseball history"
      primaryAction={{
        label: 'Back to Memories',
        icon: <ArrowLeft className="h-4 w-4" />,
        onClick: goToMemories
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-yellow-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create Oakland Memory</h1>
            <p className="text-yellow-400 text-lg">Preserve your piece of Oakland baseball history</p>
          </div>

          <Card className="bg-gray-800/80 backdrop-blur-sm border-green-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Camera className="h-6 w-6 text-yellow-400" />
                Your Oakland Story
              </CardTitle>
              <CardDescription className="text-gray-300">
                Share your memories, moments, and connection to Oakland baseball
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Memory Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="My first A's game..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="memory_type" className="text-white">Memory Type</Label>
                    <Select value={formData.memory_type} onValueChange={(value) => setFormData(prev => ({ ...prev, memory_type: value as any }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="game">⚾ Game</SelectItem>
                        <SelectItem value="tailgate">🍖 Tailgate</SelectItem>
                        <SelectItem value="championship">🏆 Championship</SelectItem>
                        <SelectItem value="protest">✊ Protest</SelectItem>
                        <SelectItem value="community">👥 Community</SelectItem>
                        <SelectItem value="farewell">👋 Farewell</SelectItem>
                        <SelectItem value="player_moment">⭐ Player Moment</SelectItem>
                        <SelectItem value="season_highlight">📅 Season Highlight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Tell us about this memory..."
                    rows={3}
                  />
                </div>

                {/* Era & Game Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="era" className="text-white">Era</Label>
                    <Select value={formData.era} onValueChange={(value) => setFormData(prev => ({ ...prev, era: value as any }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="early_years">🌱 Early Years</SelectItem>
                        <SelectItem value="dynasty_70s">👑 Dynasty 70s</SelectItem>
                        <SelectItem value="bash_brothers">💪 Bash Brothers</SelectItem>
                        <SelectItem value="moneyball">📊 Moneyball</SelectItem>
                        <SelectItem value="playoff_runs">🎯 Playoff Runs</SelectItem>
                        <SelectItem value="farewell">👋 Farewell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="game_date" className="text-white flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      Game Date
                    </Label>
                    <Input
                      id="game_date"
                      type="date"
                      value={formData.game_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, game_date: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="opponent" className="text-white">Opponent</Label>
                    <Input
                      id="opponent"
                      value={formData.opponent}
                      onChange={(e) => setFormData(prev => ({ ...prev, opponent: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="vs Yankees..."
                    />
                  </div>
                </div>

                {/* Location & Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-white flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="section" className="text-white">Section</Label>
                    <Input
                      id="section"
                      value={formData.section}
                      onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Section 200..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="score" className="text-white">Score</Label>
                    <Input
                      id="score"
                      value={formData.score}
                      onChange={(e) => setFormData(prev => ({ ...prev, score: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="A's 7, Yankees 3"
                    />
                  </div>
                </div>

                {/* Emotions */}
                <div>
                  <Label className="text-white flex items-center gap-1 mb-3">
                    <Heart className="h-4 w-4" />
                    What emotions did this memory evoke?
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {emotionOptions.map((emotion) => (
                      <Badge
                        key={emotion.value}
                        variant={formData.emotions.includes(emotion.value) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          formData.emotions.includes(emotion.value) 
                            ? `${emotion.color} text-white` 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => handleEmotionToggle(emotion.value)}
                      >
                        {emotion.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Fan Expressions */}
                <div>
                  <Label className="text-white flex items-center gap-1 mb-3">
                    <Megaphone className="h-4 w-4" />
                    Oakland Fan Expressions (select any that apply)
                  </Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {expressions.slice(0, 20).map((expression) => (
                      <Badge
                        key={expression.id}
                        variant={formData.fan_expressions.includes(expression.text_content) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          formData.fan_expressions.includes(expression.text_content)
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => handleExpressionToggle(expression.text_content)}
                      >
                        {expression.text_content}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Personal Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personal_significance" className="text-white">Personal Significance</Label>
                    <Textarea
                      id="personal_significance"
                      value={formData.personal_significance}
                      onChange={(e) => setFormData(prev => ({ ...prev, personal_significance: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Why was this moment special to you?"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="historical_context" className="text-white">Historical Context</Label>
                    <Textarea
                      id="historical_context"
                      value={formData.historical_context}
                      onChange={(e) => setFormData(prev => ({ ...prev, historical_context: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="What was happening in Oakland baseball at the time?"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="attendees" className="text-white flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Who was with you? (comma separated)
                    </Label>
                    <Input
                      id="attendees"
                      value={formData.attendees}
                      onChange={(e) => setFormData(prev => ({ ...prev, attendees: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Dad, Mom, Brother..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags" className="text-white">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="family, first-game, championship..."
                    />
                  </div>
                </div>

                {/* Template Selection */}
                {templates.length > 0 && (
                  <div>
                    <Label className="text-white mb-3 block">Choose a Template</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            formData.template_id === template.id
                              ? 'border-green-500 bg-green-900/50'
                              : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, template_id: template.id }))}
                        >
                          <h4 className="text-white font-medium">{template.name}</h4>
                          <p className="text-gray-400 text-sm">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Privacy */}
                <div>
                  <Label htmlFor="visibility" className="text-white">Privacy</Label>
                  <Select value={formData.visibility} onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value as any }))}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">🌍 Public - Anyone can see</SelectItem>
                      <SelectItem value="community">👥 Community - Oakland fans only</SelectItem>
                      <SelectItem value="private">🔒 Private - Only you</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Creating Memory...' : 'Create Memory'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={goToMemories}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default OaklandMemoryBuilder;
