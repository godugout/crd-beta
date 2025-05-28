
import React, { useState } from 'react';
import { useTeamTheme, TeamTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPicker } from '@/components/ui/color-picker';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Save, Trash2, Copy, CheckCircle, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';

const ThemeManager: React.FC = () => {
  const { themes, currentTheme, setCurrentTheme, addTheme, updateTheme, deleteTheme } = useTeamTheme();
  const [activeTab, setActiveTab] = useState<string>(currentTheme?.id || 'default');
  const [editingTheme, setEditingTheme] = useState<TeamTheme | null>(null);
  
  // Start editing a theme
  const handleEditTheme = (theme: TeamTheme) => {
    setEditingTheme({...theme});
    setActiveTab(theme.id);
  };
  
  // Create a new theme
  const handleCreateTheme = () => {
    const newTheme: TeamTheme = {
      id: uuidv4(),
      name: 'New Theme',
      primary: '#48BB78',
      secondary: '#38A169',
      accent: '#4FD1C5',
      neutral: '#8E9196',
      background: '#FFFFFF',
      text: '#1A202C',
    };
    
    addTheme(newTheme);
    handleEditTheme(newTheme);
    toast.success('New theme created');
  };
  
  // Duplicate a theme
  const handleDuplicateTheme = (theme: TeamTheme) => {
    const duplicate: TeamTheme = {
      ...theme,
      id: uuidv4(),
      name: `${theme.name} Copy`,
    };
    
    addTheme(duplicate);
    handleEditTheme(duplicate);
    toast.success(`Duplicated ${theme.name}`);
  };
  
  // Save theme changes
  const handleSaveTheme = () => {
    if (!editingTheme) return;
    
    updateTheme(editingTheme.id, editingTheme);
    setEditingTheme(null);
    toast.success('Theme updated successfully');
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTheme(null);
  };
  
  // Delete a theme
  const handleDeleteTheme = (themeId: string) => {
    if (themeId === 'default') {
      toast.error('Cannot delete the default theme');
      return;
    }
    
    deleteTheme(themeId);
    setEditingTheme(null);
    setActiveTab('default');
    toast.success('Theme deleted');
  };
  
  // Apply the selected theme
  const handleApplyTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    toast.success('Theme applied');
  };
  
  // Handle changes to editing theme
  const handleThemePropertyChange = (property: keyof TeamTheme, value: string) => {
    if (!editingTheme) return;
    
    setEditingTheme({
      ...editingTheme,
      [property]: value,
    });
  };
  
  // Render a theme preview
  const renderThemePreview = (theme: TeamTheme) => {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{theme.name}</h3>
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleEditTheme(theme)} 
              size="sm" 
              variant="ghost"
              title="Edit theme"
            >
              <Paintbrush className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => handleDuplicateTheme(theme)} 
              size="sm" 
              variant="ghost"
              title="Duplicate theme"
            >
              <Copy className="h-4 w-4" />
            </Button>
            {theme.id !== 'default' && (
              <Button 
                onClick={() => handleDeleteTheme(theme.id)} 
                size="sm" 
                variant="ghost"
                title="Delete theme"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 p-3 rounded-md border" style={{ background: theme.background }}>
          <div className="h-10 rounded-md flex items-center justify-center text-white" style={{ background: theme.primary }}>Primary</div>
          <div className="h-10 rounded-md flex items-center justify-center text-white" style={{ background: theme.secondary }}>Secondary</div>
          <div className="h-10 rounded-md flex items-center justify-center text-white" style={{ background: theme.accent }}>Accent</div>
          <div className="h-10 rounded-md flex items-center justify-center" style={{ background: theme.neutral, color: theme.text }}>Neutral</div>
          <div className="col-span-2 h-10 rounded-md flex items-center justify-center" style={{ background: theme.background, color: theme.text, border: `1px solid ${theme.neutral}` }}>Text Color</div>
        </div>
        
        <Button 
          onClick={() => handleApplyTheme(theme.id)} 
          size="sm"
          variant={currentTheme?.id === theme.id ? "default" : "outline"}
          className="w-full"
        >
          {currentTheme?.id === theme.id ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Active
            </>
          ) : (
            'Apply Theme'
          )}
        </Button>
      </div>
    );
  };
  
  // Render the theme editor
  const renderThemeEditor = () => {
    if (!editingTheme) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="name">Theme Name</Label>
            <Input
              id="name"
              value={editingTheme.name}
              onChange={(e) => handleThemePropertyChange('name', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary">Primary Color</Label>
              <ColorPicker
                value={editingTheme.primary}
                onChange={(color) => handleThemePropertyChange('primary', color)}
                colors={['#48BB78', '#4FD1C5', '#006341', '#FD5A1E', '#9b87f5', '#F97316', '#0EA5E9', '#D946EF']}
              />
            </div>
            
            <div>
              <Label htmlFor="secondary">Secondary Color</Label>
              <ColorPicker
                value={editingTheme.secondary}
                onChange={(color) => handleThemePropertyChange('secondary', color)}
                colors={['#38A169', '#285E61', '#EFB21E', '#27251F', '#7E69AB', '#B45309', '#0369A1', '#A21CAF']}
              />
            </div>
            
            <div>
              <Label htmlFor="accent">Accent Color</Label>
              <ColorPicker
                value={editingTheme.accent}
                onChange={(color) => handleThemePropertyChange('accent', color)}
                colors={['#4FD1C5', '#9AE6B4', '#003831', '#8B6F4E', '#D946EF', '#FBBF24', '#60A5FA', '#F43F5E']}
              />
            </div>
            
            <div>
              <Label htmlFor="neutral">Neutral Color</Label>
              <ColorPicker
                value={editingTheme.neutral}
                onChange={(color) => handleThemePropertyChange('neutral', color)}
                colors={['#8E9196', '#CBD5E0', '#CCCCCC', '#E2E8F0', '#A0AEC0', '#D1D5DB', '#9CA3AF', '#71717A']}
              />
            </div>
            
            <div>
              <Label htmlFor="background">Background Color</Label>
              <ColorPicker
                value={editingTheme.background}
                onChange={(color) => handleThemePropertyChange('background', color)}
                colors={['#FFFFFF', '#F8F8F8', '#F7FAFC', '#F9FAFB', '#1A1F2C', '#111827', '#0F172A', '#18181B']}
              />
            </div>
            
            <div>
              <Label htmlFor="text">Text Color</Label>
              <ColorPicker
                value={editingTheme.text}
                onChange={(color) => handleThemePropertyChange('text', color)}
                colors={['#1A202C', '#2D3748', '#4A5568', '#718096', '#FFFFFF', '#F7FAFC', '#E2E8F0', '#CBD5E0']}
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-md">
          <h3 className="font-medium mb-3">Theme Preview</h3>
          <div className="p-4 rounded-md" style={{ background: editingTheme.background, color: editingTheme.text }}>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 h-16 rounded-md flex items-center justify-center font-bold" style={{ background: editingTheme.primary, color: '#FFFFFF' }}>
                Primary
              </div>
              <div className="flex-1 h-16 rounded-md flex items-center justify-center font-bold" style={{ background: editingTheme.secondary, color: '#FFFFFF' }}>
                Secondary
              </div>
              <div className="flex-1 h-16 rounded-md flex items-center justify-center font-bold" style={{ background: editingTheme.accent, color: '#FFFFFF' }}>
                Accent
              </div>
            </div>
            
            <div className="border rounded-md p-4 mb-4" style={{ borderColor: editingTheme.neutral }}>
              <h4 className="text-lg font-bold mb-2" style={{ color: editingTheme.primary }}>Sample Content</h4>
              <p className="mb-4">This is how text will appear on this background with the selected colors.</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-md text-white" style={{ background: editingTheme.primary }}>
                  Primary Button
                </button>
                <button className="px-4 py-2 rounded-md text-white" style={{ background: editingTheme.secondary }}>
                  Secondary Button
                </button>
                <button className="px-4 py-2 rounded-md border" style={{ borderColor: editingTheme.neutral }}>
                  Outline Button
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-md" style={{ background: editingTheme.neutral, color: editingTheme.text }}>
                Neutral background
              </div>
              <div className="p-4 rounded-md border" style={{ borderColor: editingTheme.accent }}>
                Accent border
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button onClick={handleSaveTheme}>
            <Save className="h-4 w-4 mr-2" />
            Save Theme
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Team Theme Management</CardTitle>
        <CardDescription>
          Customize colors and styles for teams and communities
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {editingTheme ? (
          renderThemeEditor()
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-lg font-medium">Available Themes</h3>
              <Button onClick={handleCreateTheme} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Theme
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <Card key={theme.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    {renderThemePreview(theme)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ThemeManager;
