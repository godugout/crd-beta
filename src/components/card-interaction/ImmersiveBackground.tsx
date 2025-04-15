
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ImmersiveBackgroundProps {
  children: React.ReactNode;
  theme?: 'modern' | 'vintage' | 'premium' | 'default';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  className?: string;
}

export const ImmersiveBackground: React.FC<ImmersiveBackgroundProps> = ({
  children,
  theme = 'default',
  intensity = 'medium',
  animated = true,
  className,
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Calculate intensity values
  const getIntensityValue = () => {
    switch (intensity) {
      case 'low': return 0.3;
      case 'medium': return 0.6;
      case 'high': return 1;
      default: return 0.6;
    }
  };
  
  const intensityValue = getIntensityValue();
  
  // Generate theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'modern':
        return {
          background: `linear-gradient(120deg, #f6f8fa ${100 - intensityValue * 20}%, #e3e9f0)`,
          boxShadow: `0 0 ${30 * intensityValue}px rgba(0, 0, 0, 0.1) inset`,
          animationClass: 'bg-modern-animation'
        };
      
      case 'vintage':
        return {
          background: `linear-gradient(120deg, #f8f4e9 ${100 - intensityValue * 20}%, #e7deca)`,
          boxShadow: `0 0 ${30 * intensityValue}px rgba(139, 69, 19, 0.1) inset`,
          animationClass: 'bg-vintage-animation'
        };
      
      case 'premium':
        return {
          background: `linear-gradient(120deg, #1a1a2e ${100 - intensityValue * 20}%, #16213e)`,
          boxShadow: `0 0 ${30 * intensityValue}px rgba(255, 215, 0, 0.05) inset`,
          animationClass: 'bg-premium-animation'
        };
      
      default:
        return {
          background: 'linear-gradient(120deg, #ffffff, #f8f9fa)',
          boxShadow: 'none',
          animationClass: ''
        };
    }
  };
  
  const themeStyles = getThemeStyles();
  
  // Generate ambient elements based on theme
  const renderAmbientElements = () => {
    if (!animated) return null;
    
    switch (theme) {
      case 'modern':
        return (
          <>
            <div className="ambient-element ambient-circle" style={{ 
              background: 'radial-gradient(circle, rgba(173, 216, 230, 0.3), rgba(173, 216, 230, 0))',
              animationDuration: '18s'
            }} />
            <div className="ambient-element ambient-circle" style={{ 
              background: 'radial-gradient(circle, rgba(135, 206, 250, 0.2), rgba(135, 206, 250, 0))',
              animationDuration: '24s',
              animationDelay: '2s'
            }} />
          </>
        );
      
      case 'vintage':
        return (
          <>
            <div className="ambient-element ambient-dust" />
            <div className="ambient-element ambient-dust" style={{ animationDelay: '3s' }} />
            <div className="ambient-element ambient-dust" style={{ animationDelay: '7s' }} />
          </>
        );
      
      case 'premium':
        return (
          <>
            <div className="ambient-element ambient-sparkle" />
            <div className="ambient-element ambient-sparkle" style={{ animationDelay: '2s' }} />
            <div className="ambient-element ambient-sparkle" style={{ animationDelay: '4s' }} />
            <div className="ambient-element ambient-sparkle" style={{ animationDelay: '6s' }} />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "immersive-background relative overflow-hidden transition-all duration-700",
        animated && themeStyles.animationClass,
        mounted && "fade-in", // Apply fade-in when mounted
        className
      )}
      style={{
        background: themeStyles.background,
        boxShadow: themeStyles.boxShadow,
      }}
    >
      {/* Ambient background elements */}
      {animated && mounted && (
        <div className="ambient-container absolute inset-0 overflow-hidden pointer-events-none">
          {renderAmbientElements()}
        </div>
      )}
      
      {/* Main content */}
      <div className="immersive-content relative z-10">
        {children}
      </div>
      
      {/* Add dynamic styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .immersive-background {
          min-height: 100%;
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .ambient-container {
          z-index: 1;
        }
        
        .ambient-element {
          position: absolute;
          pointer-events: none;
        }
        
        .ambient-circle {
          width: 50vw;
          height: 50vw;
          border-radius: 50%;
          opacity: 0.7;
          filter: blur(30px);
          animation: float 20s infinite ease-in-out;
        }
        
        .ambient-dust {
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d2c8b6' fill-opacity='0.2'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='30' cy='50' r='1'/%3E%3Ccircle cx='50' cy='20' r='1'/%3E%3Ccircle cx='70' cy='80' r='1'/%3E%3Ccircle cx='90' cy='40' r='1'/%3E%3C/g%3E%3C/svg%3E");
          animation: dust 60s infinite linear;
          opacity: ${intensityValue * 0.5};
        }
        
        .ambient-sparkle {
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='30' cy='50' r='0.5'/%3E%3Ccircle cx='50' cy='20' r='0.75'/%3E%3Ccircle cx='70' cy='80' r='0.5'/%3E%3Ccircle cx='90' cy='40' r='1'/%3E%3C/g%3E%3C/svg%3E");
          animation: sparkle 90s infinite linear;
          opacity: ${intensityValue * 0.7};
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(5%, 5%); }
          50% { transform: translate(10%, -5%); }
          75% { transform: translate(-5%, 10%); }
        }
        
        @keyframes dust {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes sparkle {
          0% { opacity: ${intensityValue * 0.4}; }
          50% { opacity: ${intensityValue * 0.7}; }
          100% { opacity: ${intensityValue * 0.4}; }
        }
        
        .bg-modern-animation {
          animation: modernPulse 15s infinite alternate;
        }
        
        .bg-vintage-animation {
          animation: vintageEffect 20s infinite alternate;
        }
        
        .bg-premium-animation {
          animation: premiumGlow 15s infinite alternate;
        }
        
        @keyframes modernPulse {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        
        @keyframes vintageEffect {
          0% { filter: sepia(0.2) brightness(1.02); }
          100% { filter: sepia(0.3) brightness(0.98); }
        }
        
        @keyframes premiumGlow {
          0% { box-shadow: 0 0 ${20 * intensityValue}px rgba(255, 215, 0, 0.1) inset; }
          100% { box-shadow: 0 0 ${30 * intensityValue}px rgba(255, 215, 0, 0.2) inset; }
        }
      `}} />
    </div>
  );
};

export default ImmersiveBackground;
