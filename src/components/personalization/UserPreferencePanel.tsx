
import React, { useState } from 'react';
import { usePersonalizationContext } from '@/context/PersonalizationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Palette, Heart, Sliders, Briefcase, Clock, Star, ChevronRight } from 'lucide-react';

const UserPreferencePanel: React.FC = () => {
  const { 
    loading, 
    preferences,
    activeBrandProfile,
    toggleFavorite,
    createColorPalette,
    updateWorkflow
  } = usePersonalizationContext();
  
  const [newPaletteName, setNewPaletteName] = useState('');
  const [newPaletteColors, setNewPaletteColors] = useState(['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']);
  
  const handleCreatePalette = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaletteName) return;
    
    await createColorPalette({
      name: newPaletteName,
      colors: newPaletteColors,
      isDefault: false
    });
    
    // Reset form
    setNewPaletteName('');
  };
  
  const handleToggleView = async (view: 'simple' | 'advanced' | 'expert') => {
    await updateWorkflow({
      defaultView: view
    });
  };
  
  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-60">
            <p className="text-muted-foreground">Loading your preferences...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!preferences) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-60 gap-4">
            <p className="text-muted-foreground">No preferences found</p>
            <Button>Initialize Preferences</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>User Preferences</CardTitle>
        <CardDescription>Customize your card creation experience</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="colors">
              <Palette className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Color Palettes</span>
              <span className="inline sm:hidden">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Favorites</span>
              <span className="inline sm:hidden">Favs</span>
            </TabsTrigger>
            <TabsTrigger value="workflow">
              <Sliders className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Workflow</span>
              <span className="inline sm:hidden">Work</span>
            </TabsTrigger>
            <TabsTrigger value="brands">
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Brand Profiles</span>
              <span className="inline sm:hidden">Brands</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Color Palettes Tab */}
          <TabsContent value="colors">
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Your Color Palettes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preferences.colorPalettes.map((palette) => (
                    <div 
                      key={palette.id}
                      className="border rounded-lg p-4 bg-card"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{palette.name}</h4>
                        {palette.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                      <div className="flex space-x-2 mb-2">
                        {palette.colors.map((color, index) => (
                          <div 
                            key={`${palette.id}-${index}`}
                            className="w-8 h-8 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Create New Palette</h3>
                <form onSubmit={handleCreatePalette} className="space-y-4">
                  <div>
                    <Label htmlFor="palette-name">Palette Name</Label>
                    <Input 
                      id="palette-name"
                      value={newPaletteName}
                      onChange={(e) => setNewPaletteName(e.target.value)}
                      placeholder="My Awesome Palette"
                      className="max-w-md"
                    />
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Palette Colors</Label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {newPaletteColors.map((color, index) => (
                        <div key={index} className="relative">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...newPaletteColors];
                              newColors[index] = e.target.value;
                              setNewPaletteColors(newColors);
                            }}
                            className="w-12 h-12 cursor-pointer rounded-lg overflow-hidden border"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={!newPaletteName.trim()}
                  >
                    Create Palette
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>
          
          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Favorite Templates</h3>
                {preferences.favoriteTemplates.length === 0 ? (
                  <p className="text-muted-foreground">You haven't favorited any templates yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* This would show actual template data in a real implementation */}
                    {preferences.favoriteTemplates.map((id) => (
                      <div key={id} className="border rounded-lg p-4 bg-card">
                        <div className="aspect-[2.5/3.5] bg-muted rounded mb-2"></div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Template {id.substring(0, 6)}...</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleFavorite('template', id)}
                          >
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Favorite Effects</h3>
                {preferences.favoriteEffects.length === 0 ? (
                  <p className="text-muted-foreground">You haven't favorited any effects yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {preferences.favoriteEffects.map((id) => (
                      <div key={id} className="border rounded-lg p-3 bg-card">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Effect {id.substring(0, 6)}...</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleFavorite('effect', id)}
                          >
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Favorite Elements</h3>
                {preferences.favoriteElements.length === 0 ? (
                  <p className="text-muted-foreground">You haven't favorited any elements yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {preferences.favoriteElements.map((id) => (
                      <div key={id} className="border rounded-lg p-3 bg-card">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Element {id.substring(0, 6)}...</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleFavorite('element', id)}
                          >
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Workflow Tab */}
          <TabsContent value="workflow">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Interface Preferences</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Default View</h4>
                      <p className="text-sm text-muted-foreground">Choose your preferred interface complexity</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={preferences.workflow.defaultView === 'simple' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleView('simple')}
                      >
                        Simple
                      </Button>
                      <Button 
                        variant={preferences.workflow.defaultView === 'advanced' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleView('advanced')}
                      >
                        Advanced
                      </Button>
                      <Button 
                        variant={preferences.workflow.defaultView === 'expert' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleView('expert')}
                      >
                        Expert
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <h4 className="font-medium">Show Recommendations</h4>
                      <p className="text-sm text-muted-foreground">Get AI-powered suggestions while creating</p>
                    </div>
                    <Switch checked={preferences.recommendationsEnabled} />
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <h4 className="font-medium">Sidebar Position</h4>
                      <p className="text-sm text-muted-foreground">Choose where tools appear</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={preferences.workflow.layoutPreferences.sidebarPosition === 'left' ? 'default' : 'outline'}
                        size="sm"
                      >
                        Left
                      </Button>
                      <Button 
                        variant={preferences.workflow.layoutPreferences.sidebarPosition === 'right' ? 'default' : 'outline'}
                        size="sm"
                      >
                        Right
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Quick Access Tools</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {preferences.workflow.quickAccessTools.map((tool) => (
                    <Badge key={tool} variant="secondary">
                      {tool.charAt(0).toUpperCase() + tool.slice(1)}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  Customize Tools
                </Button>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-2">
                  {preferences.creationHistory.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Card: {item.cardId.substring(0, 8)}...</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {preferences.creationHistory.length === 0 && (
                    <p className="text-muted-foreground">No recent activity.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Brand Profiles Tab */}
          <TabsContent value="brands">
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Brand Profiles</h3>
                <Button size="sm">
                  Create New Brand
                </Button>
              </div>
              
              {preferences.brandProfiles.length === 0 ? (
                <div className="border rounded-lg p-6 bg-muted/50 flex flex-col items-center justify-center space-y-4">
                  <Briefcase className="h-12 w-12 text-muted-foreground" />
                  <div className="text-center">
                    <h4 className="font-medium">No Brand Profiles Yet</h4>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                      Create your first brand profile to maintain consistent styling across all your cards
                    </p>
                  </div>
                  <Button className="mt-2">Create Brand Profile</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preferences.brandProfiles.map((profile) => (
                    <div 
                      key={profile.id}
                      className={`border rounded-lg p-4 ${
                        profile.id === preferences.activeBrandProfileId ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{profile.name}</h4>
                          {profile.description && (
                            <p className="text-sm text-muted-foreground mt-1">{profile.description}</p>
                          )}
                        </div>
                        {profile.id === preferences.activeBrandProfileId && (
                          <Badge>Active</Badge>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Brand Colors</h5>
                        <div className="flex space-x-2">
                          <div 
                            className="w-8 h-8 rounded-full border"
                            style={{ backgroundColor: profile.colors.primary }}
                            title="Primary"
                          />
                          <div 
                            className="w-8 h-8 rounded-full border"
                            style={{ backgroundColor: profile.colors.secondary }}
                            title="Secondary"
                          />
                          <div 
                            className="w-8 h-8 rounded-full border"
                            style={{ backgroundColor: profile.colors.accent }}
                            title="Accent"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Font: </span>
                          <span>{profile.typography.fontFamily}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary"
                        >
                          <span>Details</span>
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserPreferencePanel;
