
import React from 'react';
import { useUserPreferencesContext } from '@/context/UserPreferencesContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import ColorPicker from '@/components/ui/color-picker';
import { PlusCircle, Trash2, Star, StarOff, Palette, Layers, Settings } from 'lucide-react';

const UserPreferencesDashboard: React.FC = () => {
  const { preferences, loading, toggleFavorite, addColorPalette, deleteColorPalette, updateLayoutPreference } = useUserPreferencesContext();
  const [newPaletteName, setNewPaletteName] = React.useState('');
  const [newPaletteColors, setNewPaletteColors] = React.useState(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']);
  const [activeColor, setActiveColor] = React.useState(0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleAddPalette = () => {
    if (newPaletteName.trim()) {
      addColorPalette(newPaletteName, newPaletteColors);
      setNewPaletteName('');
      setNewPaletteColors(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']);
    }
  };

  const handleColorChange = (color: string) => {
    const updatedColors = [...newPaletteColors];
    updatedColors[activeColor] = color;
    setNewPaletteColors(updatedColors);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personalization</CardTitle>
        <CardDescription>Customize your digital card creation experience</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="palettes" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="palettes" className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Color Palettes
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center">
              <Star className="mr-2 h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center">
              <Layers className="mr-2 h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          {/* Color Palettes Tab */}
          <TabsContent value="palettes">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Your Color Palettes</h3>
                <ScrollArea className="h-60">
                  <div className="space-y-3">
                    {preferences.colorPalettes.map((palette) => (
                      <div
                        key={palette.id}
                        className="border rounded-md p-3 flex flex-col space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{palette.name}</h4>
                          {palette.id !== 'default' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteColorPalette(palette.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {palette.colors.map((color, index) => (
                            <div
                              key={`${palette.id}-${index}`}
                              className="w-6 h-6 rounded-full border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Create New Palette</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="palette-name">Palette Name</Label>
                    <Input
                      id="palette-name"
                      value={newPaletteName}
                      onChange={(e) => setNewPaletteName(e.target.value)}
                      placeholder="My Custom Palette"
                    />
                  </div>
                  
                  <div>
                    <Label>Colors</Label>
                    <div className="flex space-x-3 mt-1">
                      {newPaletteColors.map((color, index) => (
                        <button
                          key={index}
                          className={`w-8 h-8 rounded-full border transition ${
                            activeColor === index ? 'ring-2 ring-primary' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setActiveColor(index)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Selected Color</Label>
                    <div className="mt-1">
                      <ColorPicker
                        color={newPaletteColors[activeColor]}
                        onChange={handleColorChange}
                        size="lg"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleAddPalette}
                    disabled={!newPaletteName.trim()}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Palette
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="space-y-6">
              {preferences.favoriteTemplates.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-3">Favorite Templates</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {preferences.favoriteTemplates.map((id) => (
                      <div key={id} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <span>Template {id.substring(0, 6)}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleFavorite('template', id)}
                          >
                            <StarOff className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border rounded-md bg-muted/20">
                  <Star className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No favorite templates yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mark templates as favorites when creating cards
                  </p>
                </div>
              )}
              
              {preferences.favoriteEffects.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Favorite Effects</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {preferences.favoriteEffects.map((id) => (
                      <div key={id} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <span>Effect {id.substring(0, 6)}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleFavorite('effect', id)}
                          >
                            <StarOff className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Layout Tab */}
          <TabsContent value="layout">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Interface Layout</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sidebar-position">Sidebar Position</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose where you want the sidebar to appear
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant={preferences.layoutPreferences.sidebarPosition === 'left' ? 'default' : 'outline'}
                        onClick={() => updateLayoutPreference('sidebarPosition', 'left')}
                      >
                        Left
                      </Button>
                      <Button
                        variant={preferences.layoutPreferences.sidebarPosition === 'right' ? 'default' : 'outline'}
                        onClick={() => updateLayoutPreference('sidebarPosition', 'right')}
                      >
                        Right
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label>Visible Panels</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose which panels to display in the interface
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['tools', 'properties', 'layers', 'history'].map((panel) => {
                        const isVisible = preferences.layoutPreferences.visiblePanels.includes(panel);
                        return (
                          <div key={panel} className="flex items-center justify-between border rounded-md p-3">
                            <Label htmlFor={`panel-${panel}`} className="capitalize">
                              {panel}
                            </Label>
                            <Switch
                              id={`panel-${panel}`}
                              checked={isVisible}
                              onCheckedChange={(checked) => {
                                const visiblePanels = checked
                                  ? [...preferences.layoutPreferences.visiblePanels, panel]
                                  : preferences.layoutPreferences.visiblePanels.filter(p => p !== panel);
                                updateLayoutPreference('visiblePanels', visiblePanels);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">General Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col border rounded-md p-3">
                      <Label htmlFor="default-view" className="mb-2">Default View</Label>
                      <select
                        id="default-view"
                        className="border rounded p-2"
                        value={preferences.defaultView}
                        onChange={(e) => updateLayoutPreference('defaultView', e.target.value)}
                      >
                        <option value="simple">Simple View</option>
                        <option value="advanced">Advanced View</option>
                        <option value="expert">Expert View</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <Label htmlFor="save-history">
                        <div className="font-medium">Save History</div>
                        <div className="text-sm text-muted-foreground">
                          Save your recent actions
                        </div>
                      </Label>
                      <Switch id="save-history" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserPreferencesDashboard;
