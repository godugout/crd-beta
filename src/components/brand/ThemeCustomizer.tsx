
import React, { useState } from 'react';
import { useBrandTheme, BrandTheme, defaultThemes } from '@/context/BrandThemeContext';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Paintbrush, 
  Plus, 
  Copy, 
  Trash2, 
  Save, 
  CheckCircle, 
  Image,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import ColorPicker from '@/components/brand/ColorPicker';

interface ThemePreviewProps {
  theme: BrandTheme;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onApply: () => void;
  isActive: boolean;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ 
  theme, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onApply,
  isActive 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {theme.logo && (
            <img 
              src={theme.logo} 
              alt={`${theme.name} logo`} 
              className="w-6 h-6 object-contain"
            />
          )}
          <h3 className="font-medium">{theme.name}</h3>
        </div>
        <div className="flex space-x-1">
          <Button 
            onClick={onEdit} 
            size="sm" 
            variant="ghost"
            title="Edit theme"
          >
            <Paintbrush className="h-4 w-4" />
          </Button>
          <Button 
            onClick={onDuplicate} 
            size="sm" 
            variant="ghost"
            title="Duplicate theme"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {!Object.keys(defaultThemes || {}).includes(theme.id) && (
            <Button 
              onClick={onDelete} 
              size="sm" 
              variant="ghost"
              title="Delete theme"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div 
        className="rounded-md p-4 border"
        style={{ background: theme.backgroundColor, color: theme.textColor }}
      >
        <div 
          className="h-8 mb-3 rounded-md flex items-center px-3"
          style={{ background: theme.headerBackgroundColor, color: theme.navTextColor }}
        >
          <div className="text-sm font-medium">Header</div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div 
            className="h-8 rounded-md flex items-center justify-center text-center text-xs text-white"
            style={{ background: theme.primaryColor }}
          >
            Primary
          </div>
          <div 
            className="h-8 rounded-md flex items-center justify-center text-center text-xs text-white"
            style={{ background: theme.secondaryColor }}
          >
            Secondary
          </div>
          <div 
            className="h-8 rounded-md flex items-center justify-center text-center text-xs text-white"
            style={{ background: theme.accentColor }}
          >
            Accent
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="px-3 py-1 rounded-md text-xs"
            style={{ 
              background: theme.buttonPrimaryColor,
              color: theme.buttonTextColor
            }}
          >
            Button
          </button>
          <button 
            className="px-3 py-1 rounded-md text-xs"
            style={{ 
              background: theme.buttonSecondaryColor,
              color: theme.buttonTextColor
            }}
          >
            Button
          </button>
          <div 
            className="px-3 py-1 rounded-md text-xs border flex-1 flex items-center justify-center"
            style={{ 
              borderColor: theme.primaryColor,
              color: theme.textColor
            }}
          >
            Card
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onApply} 
        size="sm"
        variant={isActive ? "default" : "outline"}
        className="w-full"
        style={isActive ? {
          backgroundColor: theme.buttonPrimaryColor,
          color: theme.buttonTextColor
        } : {}}
      >
        {isActive ? (
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

const defaultTheme: BrandTheme = {
  id: '',
  name: 'New Theme',
  primaryColor: '#0000FF',
  secondaryColor: '#FFD700',
  accentColor: '#FF6B00',
  backgroundColor: '#F8F8F8',
  textColor: '#1A1A1A',
  cardBackgroundColor: '#FFFFFF',
  headerBackgroundColor: '#0000FF',
  navTextColor: '#FFFFFF',
  buttonPrimaryColor: '#0000FF',
  buttonSecondaryColor: '#FFD700',
  buttonTextColor: '#FFFFFF'
};

const ThemeCustomizer: React.FC = () => {
  const { 
    currentTheme, 
    themeId, 
    themes, 
    setTheme, 
    addCustomTheme, 
    removeCustomTheme,
    updateCustomTheme 
  } = useBrandTheme();
  
  const [editingTheme, setEditingTheme] = useState<BrandTheme | null>(null);
  
  const handleCreateTheme = () => {
    const newTheme: BrandTheme = {
      ...defaultTheme,
      id: `custom-${uuidv4()}`,
      name: 'New Custom Theme'
    };
    
    setEditingTheme(newTheme);
  };
  
  const handleEditTheme = (theme: BrandTheme) => {
    setEditingTheme({ ...theme });
  };
  
  const handleDuplicateTheme = (theme: BrandTheme) => {
    const duplicate: BrandTheme = {
      ...theme,
      id: `custom-${uuidv4()}`,
      name: `${theme.name} Copy`
    };
    
    addCustomTheme(duplicate);
    toast.success(`Duplicated ${theme.name}`);
  };
  
  const handleDeleteTheme = (id: string) => {
    removeCustomTheme(id);
    toast.success('Theme deleted');
  };
  
  const handleApplyTheme = (id: string) => {
    setTheme(id);
    toast.success('Theme applied');
  };
  
  const handleSaveTheme = () => {
    if (!editingTheme) return;
    
    if (editingTheme.id) {
      updateCustomTheme(editingTheme.id, editingTheme);
    } else {
      addCustomTheme({
        ...editingTheme,
        id: `custom-${uuidv4()}`
      });
    }
    
    setEditingTheme(null);
    toast.success('Theme saved successfully');
  };
  
  const handleCancelEdit = () => {
    setEditingTheme(null);
  };
  
  const handleChangeThemeProperty = (property: keyof BrandTheme, value: string) => {
    if (!editingTheme) return;
    
    setEditingTheme({
      ...editingTheme,
      [property]: value
    });
  };
  
  const handleRandomizeColors = () => {
    if (!editingTheme) return;
    
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + Math.floor(Math.random() * 120) + 120) % 360;
    const hue3 = (hue2 + Math.floor(Math.random() * 120) + 120) % 360;
    
    const primary = `hsl(${hue1}, 80%, 50%)`;
    const secondary = `hsl(${hue2}, 80%, 50%)`;
    const accent = `hsl(${hue3}, 80%, 50%)`;
    
    setEditingTheme({
      ...editingTheme,
      primaryColor: primary,
      secondaryColor: secondary,
      accentColor: accent,
      headerBackgroundColor: primary,
      buttonPrimaryColor: primary,
      buttonSecondaryColor: secondary
    });
    
    toast.success('Colors randomized!');
  };
  
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
              onChange={(e) => handleChangeThemeProperty('name', e.target.value)}
              placeholder="Theme name"
            />
          </div>
          
          <div>
            <Label htmlFor="logo">Logo URL (optional)</Label>
            <Input
              id="logo"
              value={editingTheme.logo || ''}
              onChange={(e) => handleChangeThemeProperty('logo', e.target.value)}
              placeholder="URL to logo image"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Color Palette</h3>
            <Button 
              onClick={handleRandomizeColors} 
              size="sm" 
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Randomize Colors
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <ColorPicker
                id="primaryColor"
                value={editingTheme.primaryColor}
                onChange={(value) => handleChangeThemeProperty('primaryColor', value)}
                label="Primary Color"
              />
            </div>
            
            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <ColorPicker
                id="secondaryColor"
                value={editingTheme.secondaryColor}
                onChange={(value) => handleChangeThemeProperty('secondaryColor', value)}
                label="Secondary Color"
              />
            </div>
            
            <div>
              <Label htmlFor="accentColor">Accent Color</Label>
              <ColorPicker
                id="accentColor"
                value={editingTheme.accentColor}
                onChange={(value) => handleChangeThemeProperty('accentColor', value)}
                label="Accent Color"
              />
            </div>
            
            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
              <ColorPicker
                id="backgroundColor"
                value={editingTheme.backgroundColor}
                onChange={(value) => handleChangeThemeProperty('backgroundColor', value)}
                label="Background Color"
              />
            </div>
            
            <div>
              <Label htmlFor="textColor">Text Color</Label>
              <ColorPicker
                id="textColor"
                value={editingTheme.textColor}
                onChange={(value) => handleChangeThemeProperty('textColor', value)}
                label="Text Color"
              />
            </div>
            
            <div>
              <Label htmlFor="cardBackgroundColor">Card Background</Label>
              <ColorPicker
                id="cardBackgroundColor"
                value={editingTheme.cardBackgroundColor}
                onChange={(value) => handleChangeThemeProperty('cardBackgroundColor', value)}
                label="Card Background"
              />
            </div>
            
            <div>
              <Label htmlFor="headerBackgroundColor">Header Background</Label>
              <ColorPicker
                id="headerBackgroundColor"
                value={editingTheme.headerBackgroundColor}
                onChange={(value) => handleChangeThemeProperty('headerBackgroundColor', value)}
                label="Header Background"
              />
            </div>
            
            <div>
              <Label htmlFor="navTextColor">Navigation Text</Label>
              <ColorPicker
                id="navTextColor"
                value={editingTheme.navTextColor}
                onChange={(value) => handleChangeThemeProperty('navTextColor', value)}
                label="Navigation Text"
              />
            </div>
            
            <div>
              <Label htmlFor="buttonPrimaryColor">Button Primary</Label>
              <ColorPicker
                id="buttonPrimaryColor"
                value={editingTheme.buttonPrimaryColor}
                onChange={(value) => handleChangeThemeProperty('buttonPrimaryColor', value)}
                label="Button Primary"
              />
            </div>
            
            <div>
              <Label htmlFor="buttonSecondaryColor">Button Secondary</Label>
              <ColorPicker
                id="buttonSecondaryColor"
                value={editingTheme.buttonSecondaryColor}
                onChange={(value) => handleChangeThemeProperty('buttonSecondaryColor', value)}
                label="Button Secondary"
              />
            </div>
            
            <div>
              <Label htmlFor="buttonTextColor">Button Text</Label>
              <ColorPicker
                id="buttonTextColor"
                value={editingTheme.buttonTextColor}
                onChange={(value) => handleChangeThemeProperty('buttonTextColor', value)}
                label="Button Text"
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-md">
          <h3 className="font-medium mb-3">Theme Preview</h3>
          <div 
            className="p-4 rounded-md border"
            style={{ 
              background: editingTheme.backgroundColor, 
              color: editingTheme.textColor,
              borderColor: editingTheme.primaryColor
            }}
          >
            <div 
              className="h-10 mb-4 rounded-md flex items-center px-4"
              style={{ background: editingTheme.headerBackgroundColor, color: editingTheme.navTextColor }}
            >
              <div className="font-medium">CardShow</div>
              <div className="flex-1"></div>
              <div className="flex gap-2">
                <div className="text-sm">Home</div>
                <div className="text-sm">Cards</div>
                <div className="text-sm">Collections</div>
              </div>
            </div>
            
            <div className="flex gap-4 mb-4">
              <div 
                className="flex-1 p-4 rounded-md border"
                style={{ 
                  background: editingTheme.cardBackgroundColor,
                  borderColor: 'rgba(0,0,0,0.1)'
                }}
              >
                <h4 className="font-bold mb-2" style={{ color: editingTheme.primaryColor }}>
                  Card Title
                </h4>
                <p className="text-sm mb-3">This is how your card content will appear.</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    className="py-1 px-2 rounded-md text-sm"
                    style={{ 
                      background: editingTheme.buttonPrimaryColor,
                      color: editingTheme.buttonTextColor
                    }}
                  >
                    Primary Button
                  </button>
                  <button 
                    className="py-1 px-2 rounded-md text-sm"
                    style={{ 
                      background: editingTheme.buttonSecondaryColor,
                      color: editingTheme.buttonTextColor
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
              
              <div 
                className="flex-1 p-4 rounded-md border"
                style={{ 
                  background: editingTheme.cardBackgroundColor,
                  borderColor: 'rgba(0,0,0,0.1)'
                }}
              >
                <h4 className="font-bold mb-2" style={{ color: editingTheme.secondaryColor }}>
                  Another Card
                </h4>
                <p className="text-sm mb-3">Different styled content example.</p>
                <div 
                  className="p-2 rounded-md mb-2"
                  style={{ background: editingTheme.accentColor, color: editingTheme.buttonTextColor }}
                >
                  Accent colored section
                </div>
                <div className="border-t pt-2" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                  <span className="text-xs" style={{ color: editingTheme.primaryColor }}>
                    Footer information
                  </span>
                </div>
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
        <CardTitle>Brand Theme Customization</CardTitle>
        <CardDescription>
          Choose from built-in themes or create your own custom brand theme
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
                Create New Theme
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(themes).map((theme) => (
                <Card key={theme.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <ThemePreview
                      theme={theme}
                      onEdit={() => handleEditTheme(theme)}
                      onDuplicate={() => handleDuplicateTheme(theme)}
                      onDelete={() => handleDeleteTheme(theme.id)}
                      onApply={() => handleApplyTheme(theme.id)}
                      isActive={themeId === theme.id}
                    />
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

export default ThemeCustomizer;
