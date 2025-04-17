
import React, { useState } from 'react';
import { useBrandTheme } from '@/context/BrandThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Palette, Check, Sparkles, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeSwitcherProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'rainbow' | 'glass'; 
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  showLabel?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  variant = 'glass', 
  size = 'default',
  showLabel = true
}) => {
  const { themes, themeId, setTheme, currentTheme } = useBrandTheme();
  const [open, setOpen] = useState(false);
  
  const handleSelectTheme = (id: string) => {
    setTheme(id);
    setOpen(false);
  };
  
  // Group themes into categories
  const featuredThemes = ['crd-spectrum', 'dscvr-dark', 'midnight'];
  const standardThemes = Object.values(themes).filter(theme => !featuredThemes.includes(theme.id));
  
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
          {themeId === 'crd-spectrum' ? (
            <Sparkles className="h-4 w-4 text-[var(--brand-accent)]" />
          ) : (
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: currentTheme.primaryColor }}
            />
          )}
          {showLabel && <span>Theme</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64" sideOffset={8}>
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--brand-accent)]" />
          <span>Featured Themes</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          {Object.values(themes)
            .filter(theme => featuredThemes.includes(theme.id))
            .map((theme) => {
              const isSelected = theme.id === themeId;
              
              return (
                <DropdownMenuItem
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className="flex items-center gap-3 py-3 px-3 cursor-pointer group"
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full ${theme.id === 'crd-spectrum' ? 'animated-gradient-bg bg-gradient-to-r from-[#FF5C69] via-[#2AFC98] to-[#38B6FF]' : ''}`}
                      style={theme.id !== 'crd-spectrum' ? { backgroundColor: theme.primaryColor } : {}}
                    />
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check className="h-4 w-4 text-white drop-shadow-md" />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {theme.name}
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)]">
                      {theme.id === 'crd-spectrum' ? 'Modern & immersive design' : 'Featured theme'}
                    </div>
                  </div>
                  
                  {theme.id === 'crd-spectrum' && (
                    <div className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] font-medium">
                      New
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span>Standard Themes</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-[220px] overflow-y-auto">
          {standardThemes.map((theme) => {
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
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 py-2 px-3 cursor-pointer">
          <Settings className="h-4 w-4" />
          <span className="flex-1">Customize Themes</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
