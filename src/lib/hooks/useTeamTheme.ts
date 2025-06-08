
import { useEffect } from 'react';
import { getTeamColors, getTeamConfig } from '@/lib/config/teamConfigs';

export const useTeamTheme = (teamSlug?: string) => {
  useEffect(() => {
    if (!teamSlug) return;

    const colors = getTeamColors(teamSlug);
    const config = getTeamConfig(teamSlug);

    if (colors && config) {
      // Apply team colors as CSS variables
      const root = document.documentElement;
      
      // Set primary team colors
      root.style.setProperty('--team-primary', colors.primary || '#000000');
      root.style.setProperty('--team-secondary', colors.secondary || '#FFFFFF');
      root.style.setProperty('--team-accent', colors.accent || '#CCCCCC');
      
      // Set emotion colors if available
      if (colors.emotions) {
        Object.entries(colors.emotions).forEach(([emotion, color]) => {
          root.style.setProperty(`--team-emotion-${emotion}`, color);
        });
      }

      // Apply team-specific CSS class to body
      document.body.className = document.body.className.replace(/team-\w+/g, '');
      document.body.classList.add(`team-${config.theme}`);
    }

    // Cleanup function
    return () => {
      const root = document.documentElement;
      root.style.removeProperty('--team-primary');
      root.style.removeProperty('--team-secondary');
      root.style.removeProperty('--team-accent');
      
      // Remove emotion color variables
      const colors = getTeamColors(teamSlug);
      if (colors?.emotions) {
        Object.keys(colors.emotions).forEach(emotion => {
          root.style.removeProperty(`--team-emotion-${emotion}`);
        });
      }

      // Remove team class from body
      document.body.className = document.body.className.replace(/team-\w+/g, '');
    };
  }, [teamSlug]);
};
