
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Sparkles, Heart, Megaphone, Camera, Users, MapPin } from 'lucide-react';
import { OAKLAND_MEMORY_TEMPLATES, OaklandMemoryTemplate } from '@/lib/data/oakland/oaklandTemplates';
import { OAKLAND_FAN_EXPRESSIONS, OaklandFanExpression, searchExpressions, getExpressionsByCategory } from '@/lib/data/oakland/fanExpressions';
import { useAuth } from '@/context/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type BuilderStep = 'template' | 'content' | 'expressions' | 'emotions' | 'preview';

interface MemoryData {
  title: string;
  description: string;
  memory_type: string;
  era: string;
  game_date: string;
  opponent: string;
  score: string;
  location: string;
  section: string;
  personal_significance: string;
  historical_context: string;
  attendees: string[];
  tags: string[];
  emotions: string[];
  fan_expressions: string[];
  template_id: string;
  visibility: 'public' | 'private' | 'community';
}

const OaklandMemoryBuilder: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BuilderStep>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<OaklandMemoryTemplate | null>(null);
  const [memoryData, setMemoryData] = useState<MemoryData>({
    title: '',
    description: '',
    memory_type: 'game',
    era: 'farewell',
    game_date: '',
    opponent: '',
    score: '',
    location: 'Oakland Coliseum',
    section: '',
    personal_significance: '',
    historical_context: '',
    attendees: [],
    tags: [],
    emotions: [],
    fan_expressions: [],
    template_id: '',
    visibility: 'public'
  });
  const [expressionSearch, setExpressionSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const emotionOptions = [
    { value: 'joy', label: '😊 Joy', color: 'bg-yellow-500' },
    { value: 'heartbreak', label: '💔 Heartbreak', color: 'bg-red-500' },
    { value: 'nostalgia', label: '🥺 Nostalgia', color: 'bg-purple-500' },
    { value: 'anger', label: '😡 Anger', color: 'bg-red-600' },
    { value: 'hope', label: '🌟 Hope', color: 'bg-blue-500' },
    { value: 'protest', label: '✊ Protest', color: 'bg-gray-800' },
    { value: 'pride', label: '🏆 Pride', color: 'bg-green-600' },
    { value: 'community', label: '👥 Community', color: 'bg-indigo-500' }
  ];

  const stepTitles = {
    template: 'Choose Your Memory Style',
    content: 'Tell Your Story',
    expressions: 'Add Fan Voice',
    emotions: 'Capture the Feeling',
    preview: 'Preview & Share'
  };

  const handleTemplateSelect = (template: OaklandMemoryTemplate) => {
    setSelectedTemplate(template);
    setMemoryData(prev => ({ ...prev, template_id: template.id, era: template.era }));
  };

  const handleEmotionToggle = (emotion: string) => {
    setMemoryData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const handleExpressionToggle = (expression: string) => {
    setMemoryData(prev => ({
      ...prev,
      fan_expressions: prev.fan_expressions.includes(expression)
        ? prev.fan_expressions.filter(e => e !== expression)
        : [...prev.fan_expressions, expression]
    }));
  };

  const getFilteredExpressions = () => {
    if (expressionSearch) {
      return searchExpressions(expressionSearch);
    }
    return OAKLAND_FAN_EXPRESSIONS.slice(0, 20);
  };

  const handleNext = () => {
    const steps: BuilderStep[] = ['template', 'content', 'expressions', 'emotions', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: BuilderStep[] = ['template', 'content', 'expressions', 'emotions', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('oakland_memories')
        .insert([{
          user_id: user.id,
          title: memoryData.title,
          description: memoryData.description,
          memory_type: memoryData.memory_type,
          era: memoryData.era,
          game_date: memoryData.game_date || null,
          opponent: memoryData.opponent || null,
          score: memoryData.score || null,
          location: memoryData.location,
          section: memoryData.section || null,
          personal_significance: memoryData.personal_significance || null,
          historical_context: memoryData.historical_context || null,
          attendees: memoryData.attendees,
          tags: memoryData.tags,
          emotions: memoryData.emotions,
          fan_expressions: memoryData.fan_expressions,
          template_id: memoryData.template_id,
          visibility: memoryData.visibility,
          effect_settings: selectedTemplate?.config || {},
          is_featured: false,
          community_reactions: {}
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Memory Created!",
        description: "Your Oakland memory has been added to the archive.",
      });

      navigate('/teams/oakland-athletics/memories');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create memory",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'template':
        return selectedTemplate !== null;
      case 'content':
        return memoryData.title.trim() !== '' && memoryData.description.trim() !== '';
      case 'expressions':
      case 'emotions':
        return true; // These are optional
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-yellow-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Oakland Memory Builder</h1>
          <p className="text-yellow-400 text-lg">{stepTitles[currentStep]}</p>
          
          {/* Progress Bar */}
          <div className="flex justify-center mt-4 space-x-2">
            {['template', 'content', 'expressions', 'emotions', 'preview'].map((step, index) => (
              <div
                key={step}
                className={`w-12 h-2 rounded-full ${
                  currentStep === step ? 'bg-yellow-400' :
                  ['template', 'content', 'expressions', 'emotions', 'preview'].indexOf(currentStep) > index 
                    ? 'bg-green-600' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            
            {/* Template Selection */}
            {currentStep === 'template' && (
              <Card className="bg-gray-800/80 backdrop-blur-sm border-green-600/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-yellow-400" />
                    Choose Your Memory Template
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Each template captures a different era and emotion of Oakland baseball
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {OAKLAND_MEMORY_TEMPLATES.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                          selectedTemplate?.id === template.id
                            ? 'border-yellow-400 bg-yellow-900/30'
                            : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <div 
                          className="w-full h-24 rounded mb-3"
                          style={{ backgroundColor: template.config.backgroundColor }}
                        />
                        <h3 className="text-white font-bold">{template.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                          <Badge variant="outline" className="text-xs">{template.era}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Step */}
            {currentStep === 'content' && (
              <Card className="bg-gray-800/80 backdrop-blur-sm border-green-600/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Camera className="h-6 w-6 text-yellow-400" />
                    Tell Your Oakland Story
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white block mb-2">Memory Title *</label>
                      <Input
                        value={memoryData.title}
                        onChange={(e) => setMemoryData(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="My first A's game..."
                      />
                    </div>
                    <div>
                      <label className="text-white block mb-2">Memory Type</label>
                      <Select value={memoryData.memory_type} onValueChange={(value) => setMemoryData(prev => ({ ...prev, memory_type: value }))}>
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
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-white block mb-2">Description *</label>
                    <Textarea
                      value={memoryData.description}
                      onChange={(e) => setMemoryData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Describe your Oakland memory..."
                      rows={3}
                    />
                  </div>

                  {/* Game Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-white block mb-2">Game Date</label>
                      <Input
                        type="date"
                        value={memoryData.game_date}
                        onChange={(e) => setMemoryData(prev => ({ ...prev, game_date: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white block mb-2">Opponent</label>
                      <Input
                        value={memoryData.opponent}
                        onChange={(e) => setMemoryData(prev => ({ ...prev, opponent: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="vs Yankees..."
                      />
                    </div>
                    <div>
                      <label className="text-white block mb-2">Score</label>
                      <Input
                        value={memoryData.score}
                        onChange={(e) => setMemoryData(prev => ({ ...prev, score: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="A's 7, Yankees 3"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white block mb-2 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Location
                      </label>
                      <Input
                        value={memoryData.location}
                        onChange={(e) => setMemoryData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white block mb-2">Section</label>
                      <Input
                        value={memoryData.section}
                        onChange={(e) => setMemoryData(prev => ({ ...prev, section: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Section 200..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fan Expressions Step */}
            {currentStep === 'expressions' && (
              <Card className="bg-gray-800/80 backdrop-blur-sm border-green-600/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Megaphone className="h-6 w-6 text-yellow-400" />
                    Add Oakland Fan Voice
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Choose chants, cheers, and expressions that capture the Oakland spirit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input
                      value={expressionSearch}
                      onChange={(e) => setExpressionSearch(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Search fan expressions..."
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {getFilteredExpressions().map((expression) => (
                      <Badge
                        key={expression.id}
                        variant={memoryData.fan_expressions.includes(expression.text_content) ? "default" : "outline"}
                        className={`cursor-pointer p-2 ${
                          memoryData.fan_expressions.includes(expression.text_content)
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => handleExpressionToggle(expression.text_content)}
                      >
                        {expression.text_content}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emotions Step */}
            {currentStep === 'emotions' && (
              <Card className="bg-gray-800/80 backdrop-blur-sm border-green-600/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="h-6 w-6 text-yellow-400" />
                    Capture the Emotions
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    What emotions did this memory evoke?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {emotionOptions.map((emotion) => (
                      <Badge
                        key={emotion.value}
                        variant={memoryData.emotions.includes(emotion.value) ? "default" : "outline"}
                        className={`cursor-pointer p-3 text-base ${
                          memoryData.emotions.includes(emotion.value) 
                            ? `${emotion.color} text-white` 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => handleEmotionToggle(emotion.value)}
                      >
                        {emotion.label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preview Step */}
            {currentStep === 'preview' && (
              <Card className="bg-gray-800/80 backdrop-blur-sm border-green-600/30">
                <CardHeader>
                  <CardTitle className="text-white">Preview Your Memory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-yellow-400 font-bold text-xl">{memoryData.title}</h3>
                      <p className="text-gray-300 mt-2">{memoryData.description}</p>
                    </div>
                    
                    {memoryData.emotions.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Emotions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {memoryData.emotions.map(emotion => (
                            <Badge key={emotion} variant="outline">{emotion}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {memoryData.fan_expressions.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Fan Expressions:</h4>
                        <div className="space-y-1">
                          {memoryData.fan_expressions.map((expression, index) => (
                            <p key={index} className="text-green-400 italic">"{expression}"</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-4">
            <Card className="bg-gray-800/80 backdrop-blur-sm border-green-600/30">
              <CardHeader>
                <CardTitle className="text-white">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTemplate && (
                  <div 
                    className="aspect-[3/4] rounded-lg p-4 text-white relative overflow-hidden"
                    style={{ 
                      backgroundColor: selectedTemplate.config.backgroundColor,
                      border: `2px solid ${selectedTemplate.config.accentColor}`
                    }}
                  >
                    <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent" />
                    <div className="relative z-10">
                      <h3 
                        className="font-bold text-lg mb-2"
                        style={{ color: selectedTemplate.config.accentColor }}
                      >
                        {memoryData.title || 'Your Memory Title'}
                      </h3>
                      <p className="text-sm mb-4 opacity-90">
                        {memoryData.description || 'Your memory description will appear here...'}
                      </p>
                      
                      {memoryData.opponent && (
                        <div className="text-xs mb-2">vs {memoryData.opponent}</div>
                      )}
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-xs opacity-75">{memoryData.location}</div>
                        {memoryData.emotions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {memoryData.emotions.slice(0, 3).map(emotion => (
                              <span key={emotion} className="text-[10px] px-1 py-0.5 rounded bg-black/30">
                                {emotion}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentStep === 'template'}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2 text-white">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              {currentStep === 'preview' ? 'Ready to share' : `Step ${['template', 'content', 'expressions', 'emotions', 'preview'].indexOf(currentStep) + 1} of 5`}
            </span>
          </div>

          {currentStep === 'preview' ? (
            <Button
              onClick={handleSubmit}
              disabled={loading || !canProceed()}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Creating...' : 'Create Memory'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-green-600 hover:bg-green-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OaklandMemoryBuilder;
