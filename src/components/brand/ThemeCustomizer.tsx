
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { createToast } from '@/utils/createToast';

interface ThemeCustomizerProps {
  className?: string;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ className }) => {
  const [primaryColor, setPrimaryColor] = useState('#0070f3');
  const [secondaryColor, setSecondaryColor] = useState('#6c757d');
  const [accentColor, setAccentColor] = useState('#ff4081');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [borderRadius, setBorderRadius] = useState('0.5rem');
  const [darkMode, setDarkMode] = useState(false);
  const [customCss, setCustomCss] = useState('');
  const { setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    // Apply theme changes
    const theme = darkMode ? 'dark' : 'light';
    setTheme(theme);
  }, [darkMode, setTheme]);

  const handleSave = () => {
    // Save theme settings to local storage or database
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    localStorage.setItem('accentColor', accentColor);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('borderRadius', borderRadius);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('customCss', customCss);

    toast(createToast({
      title: "Theme updated",
      description: "Your theme settings have been saved"
    }));
  };

  const handleReset = () => {
    // Reset theme settings to default values
    setPrimaryColor('#0070f3');
    setSecondaryColor('#6c757d');
    setAccentColor('#ff4081');
    setFontFamily('Arial, sans-serif');
    setBorderRadius('0.5rem');
    setDarkMode(false);
    setCustomCss('');

    // Clear local storage
    localStorage.removeItem('primaryColor');
    localStorage.removeItem('secondaryColor');
    localStorage.removeItem('accentColor');
    localStorage.removeItem('fontFamily');
    localStorage.removeItem('borderRadius');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('customCss');

    toast(createToast({
      title: "Theme reset",
      description: "Theme has been reset to default values"
    }));
  };

  return (
    <div className={`container mx-auto p-4 ${className}`}>
      <h1 className="text-2xl font-bold mb-4">Theme Customizer</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label htmlFor="primary-color">Primary Color</Label>
                <ColorPicker
                  color={primaryColor}
                  onChange={setPrimaryColor}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <ColorPicker
                  color={secondaryColor}
                  onChange={setSecondaryColor}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="accent-color">Accent Color</Label>
                <ColorPicker
                  color={accentColor}
                  onChange={setAccentColor}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="font-family">Font Family</Label>
                <Input
                  type="text"
                  id="font-family"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="border-radius">Border Radius</Label>
                <Input
                  type="text"
                  id="border-radius"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label htmlFor="custom-css">Custom CSS</Label>
                <Textarea
                  id="custom-css"
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder="Enter custom CSS to override default styles"
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
