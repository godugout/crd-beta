
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBrandTheme } from '@/context/BrandThemeContext';

const ThemeSwitcher = () => {
  const { themes, themeId, setTheme, currentTheme } = useBrandTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Star 
            className="h-5 w-5" 
            fill={currentTheme.primaryColor} 
            stroke={currentTheme.primaryColor} 
          />
          <span className="sr-only">Change Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.values(themes).map((theme) => {
          const isSelected = theme.id === themeId;
          
          return (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className="flex items-center gap-2 py-2 px-3 cursor-pointer"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <span className="flex-1">{theme.name}</span>
              {isSelected && <Star className="h-4 w-4" fill="currentColor" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
