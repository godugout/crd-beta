
import React from 'react';
import { BrandTheme } from '@/context/BrandThemeContext';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface ThemePreviewProps {
  theme: BrandTheme;
  isActive: boolean;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, isActive }) => {
  const isSpectrumTheme = theme.id === 'crd-spectrum';
  
  return (
    <div className="relative">
      {isActive && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="bg-[var(--brand-accent)] text-white text-xs font-medium px-2 py-0.5 rounded-full">
            Active
          </div>
        </div>
      )}
      
      <Card className={`overflow-hidden border ${isActive ? 'border-[var(--brand-primary)]' : 'border-[var(--border-primary)]'} ${isSpectrumTheme ? 'rainbow-border' : ''}`}>
        <div 
          className="p-4"
          style={{ 
            background: theme.backgroundColor,
            color: theme.textColor
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium">
              {theme.name}
            </div>
            {isSpectrumTheme && (
              <Sparkles className="h-4 w-4 text-[var(--brand-accent)]" />
            )}
          </div>
          
          <div 
            className="h-10 mb-4 rounded-md flex items-center px-3"
            style={{ 
              background: theme.headerBackgroundColor,
              color: theme.navTextColor
            }}
          >
            <div className="text-xs">Header</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div 
              className="h-16 rounded-md flex items-center justify-center"
              style={{
                background: theme.cardBackgroundColor,
                color: theme.textColor,
                borderColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <span className="text-xs">Card</span>
            </div>
            <div 
              className="h-16 rounded-md flex flex-col items-center justify-center gap-1"
              style={{
                background: 'rgba(0,0,0,0.2)',
                backdropFilter: 'blur(8px)'
              }}
            >
              {isSpectrumTheme ? (
                <span className="text-xs bg-clip-text text-transparent bg-gradient-to-r from-[#FF5C69] via-[#2AFC98] to-[#38B6FF]">Spectrum</span>
              ) : (
                <span className="text-xs" style={{ color: theme.primaryColor }}>Accent</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              className="h-8 rounded-md text-xs flex items-center justify-center"
              style={{ 
                background: theme.buttonPrimaryColor,
                color: theme.buttonTextColor
              }}
            >
              Primary
            </button>
            <button 
              className="h-8 rounded-md text-xs flex items-center justify-center"
              style={{ 
                background: theme.buttonSecondaryColor,
                color: theme.buttonTextColor
              }}
            >
              Secondary
            </button>
          </div>
        </div>
        
        {isSpectrumTheme && (
          <CardContent className="pt-4 pb-3 bg-[#121212]">
            <div className="text-sm font-medium mb-3">Preview Buttons</div>
            <div className="flex flex-wrap gap-2">
              <CrdButton size="sm" variant="default">Default</CrdButton>
              <CrdButton size="sm" variant="rainbow">Rainbow</CrdButton>
              <CrdButton size="sm" variant="glass">Glass</CrdButton>
              <CrdButton size="sm" variant="spectrum">Spectrum</CrdButton>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ThemePreview;
