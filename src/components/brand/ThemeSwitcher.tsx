
import React, { useState } from 'react';
import { useBrandTheme } from '@/context/BrandThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';

interface ThemeSwitcherProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'; 
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  variant = 'outline', 
  size = 'default',
  showLabel = true
}) => {
  const { themes, themeId, setTheme, currentTheme } = useBrandTheme();
  const [open, setOpen] = useState(false);
  
  const handleSelectTheme = (id: string) => {
    setTheme(id);
    setOpen(false);
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="gap-2"
          style={variant === 'default' ? {
            backgroundColor: currentTheme.buttonPrimaryColor,
            color: currentTheme.buttonTextColor
          } : {}}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: currentTheme.primaryColor }}
          />
          {showLabel && <span>Theme</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {Object.values(themes).map((theme) => {
          const isSelected = theme.id === themeId;
          
          return (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              className="flex items-center gap-2 py-2 px-3 cursor-pointer"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <span className="flex-1">{theme.name}</span>
              {isSelected && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 py-2 px-3">
          <Palette className="h-4 w-4" />
          <span className="flex-1">Customize Themes</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
