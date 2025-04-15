
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Paintbrush } from 'lucide-react';
import { useTheme } from 'next-themes';

export interface ImmersiveBackgroundProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'modern' | 'vintage' | 'premium' | 'stadium' | 'custom';
  showThemeSelector?: boolean;
  customBackground?: string;
  customLighting?: string;
  animationIntensity?: number;
}

export const ImmersiveBackground: React.FC<ImmersiveBackgroundProps> = ({
  children,
  className,
  theme: initialTheme = 'modern',
  showThemeSelector = true,
  customBackground,
  customLighting,
  animationIntensity = 1.0,
}) => {
  const [theme, setTheme] = useState<'modern' | 'vintage' | 'premium' | 'stadium' | 'custom'>(initialTheme);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const { theme: systemTheme } = useTheme();
  const isDarkMode = systemTheme === 'dark';
  const backgroundRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  // Handle theme switch
  const handleThemeChange = (newTheme: 'modern' | 'vintage' | 'premium' | 'stadium' | 'custom') => {
    setTheme(newTheme);
  };
  
  // Get background styles based on theme
  const getBackgroundStyles = () => {
    switch (theme) {
      case 'modern':
        return {
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #e0e5ec 0%, #f5f7fa 50%, #dbe7fd 100%)',
          gridOpacity: isDarkMode ? 0.15 : 0.07,
          gridSize: '40px',
          lightIntensity: 0.6,
          effectColor: isDarkMode ? 'rgba(90, 140, 250, 0.05)' : 'rgba(120, 170, 255, 0.07)'
        };
      case 'vintage':
        return {
          background: isDarkMode
            ? 'linear-gradient(135deg, #2c2923 0%, #3b3632 50%, #433d36 100%)'
            : 'linear-gradient(135deg, #f5f5f0 0%, #ece9e1 50%, #d6cfc2 100%)',
          gridOpacity: 0.08,
          gridSize: '15px',
          lightIntensity: 0.4,
          effectColor: isDarkMode ? 'rgba(255, 230, 150, 0.03)' : 'rgba(210, 180, 140, 0.08)'
        };
      case 'premium':
        return {
          background: isDarkMode
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
          gridOpacity: 0.1,
          gridSize: '25px',
          lightIntensity: 0.7,
          effectColor: isDarkMode ? 'rgba(220, 190, 255, 0.05)' : 'rgba(180, 130, 255, 0.04)'
        };
      case 'stadium':
        return {
          background: isDarkMode
            ? 'linear-gradient(135deg, #1c3122 0%, #215037 50%, #12372a 100%)'
            : 'linear-gradient(135deg, #e3f2e9 0%, #c6ebd9 50%, #a3d9bf 100%)',
          gridOpacity: 0.1,
          gridSize: '50px',
          lightIntensity: 0.5,
          effectColor: isDarkMode ? 'rgba(150, 255, 180, 0.04)' : 'rgba(100, 240, 130, 0.05)'
        };
      case 'custom':
        return {
          background: customBackground || 'transparent',
          gridOpacity: 0,
          gridSize: '0px',
          lightIntensity: 0.5,
          effectColor: 'transparent'
        };
      default:
        return {
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #e0e5ec 0%, #f5f7fa 50%, #dbe7fd 100%)',
          gridOpacity: isDarkMode ? 0.15 : 0.07,
          gridSize: '40px',
          lightIntensity: 0.6,
          effectColor: isDarkMode ? 'rgba(90, 140, 250, 0.05)' : 'rgba(120, 170, 255, 0.07)'
        };
    }
  };
  
  const bgStyles = getBackgroundStyles();
  
  // Create mouse-following gradient effect
  useEffect(() => {
    if (!animationEnabled || !backgroundRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height, left, top } = backgroundRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to background element
      const x = clientX - left;
      const y = clientY - top;
      
      // Convert to percentage
      const xPercent = (x / width) * 100;
      const yPercent = (y / height) * 100;
      
      // Apply gradient to follow mouse
      backgroundRef.current.style.setProperty('--x-pos', `${xPercent}%`);
      backgroundRef.current.style.setProperty('--y-pos', `${yPercent}%`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [animationEnabled, theme]);
  
  // Create floating particles effect
  useEffect(() => {
    if (!animationEnabled || !particlesRef.current || theme === 'custom') return;
    
    // Clear existing particles
    particlesRef.current.innerHTML = '';
    
    // Create new particles
    const particleCount = Math.floor(10 * animationIntensity);
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Randomize particle properties
      const size = Math.random() * 50 + 20;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = Math.random() * 20 + 40;
      const delay = Math.random() * 10;
      
      // Apply styles
      particle.className = 'absolute rounded-full bg-current opacity-30 blur-xl';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
      particle.style.color = bgStyles.effectColor;
      
      // Add to container
      particlesRef.current.appendChild(particle);
    }
    
    return () => {
      if (particlesRef.current) {
        particlesRef.current.innerHTML = '';
      }
    };
  }, [animationEnabled, theme, animationIntensity, bgStyles.effectColor]);
  
  return (
    <div
      ref={backgroundRef}
      className={cn(
        "immersive-background relative overflow-hidden w-full h-full",
        className
      )}
      style={{
        background: bgStyles.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '--x-pos': '50%',
        '--y-pos': '50%',
        '--grid-size': bgStyles.gridSize,
        '--grid-opacity': bgStyles.gridOpacity,
        '--light-intensity': bgStyles.lightIntensity,
      } as React.CSSProperties}
    >
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,var(--grid-opacity)) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,var(--grid-opacity)) 1px, transparent 1px)
          `,
          backgroundSize: 'var(--grid-size) var(--grid-size)',
        }}
      />
      
      {/* Light effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(
            circle at var(--x-pos) var(--y-pos),
            rgba(255,255,255,calc(var(--light-intensity) * 0.5)),
            transparent 80%
          )`,
          opacity: animationEnabled ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />
      
      {/* Animated particles */}
      <div 
        ref={particlesRef}
        className="particles absolute inset-0 pointer-events-none z-0 overflow-hidden"
      />
      
      {/* Theme selector */}
      {showThemeSelector && (
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Paintbrush className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Background</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleThemeChange('modern')}>
                Modern
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('vintage')}>
                Vintage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('premium')}>
                Premium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('stadium')}>
                Stadium
              </DropdownMenuItem>
              {customBackground && (
                <DropdownMenuItem onClick={() => handleThemeChange('custom')}>
                  Custom
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-1 w-full h-full">{children}</div>
      
      {/* Animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100px) translateX(50px) scale(1.5);
            opacity: 0.05;
          }
        }
      `}} />
    </div>
  );
};

export default ImmersiveBackground;
