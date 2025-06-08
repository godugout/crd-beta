
import React from 'react';
import { ProfessionalOaklandTemplate } from '@/lib/data/oakland/professionalTemplates';
import { cn } from '@/lib/utils';

interface ProfessionalCardRendererProps {
  template: ProfessionalOaklandTemplate;
  memory: {
    title: string;
    description: string;
    imageUrl?: string;
    opponent?: string;
    score?: string;
    location?: string;
    section?: string;
    game_date?: string;
    emotions?: string[];
    tags?: string[];
  };
  className?: string;
}

const ProfessionalCardRenderer: React.FC<ProfessionalCardRendererProps> = ({
  template,
  memory,
  className
}) => {
  const { config } = template;

  const getLayoutStyles = () => {
    const baseStyles = {
      position: 'relative' as const,
      width: '100%',
      aspectRatio: config.layout.grid === '3x4' ? '3/4' : '2/3',
      overflow: 'hidden',
      borderRadius: '12px',
      background: config.effects.background,
      border: config.effects.border,
      boxShadow: config.effects.shadows,
    };

    if (config.effects.glows) {
      baseStyles.boxShadow += `, ${config.effects.glows}`;
    }

    return baseStyles;
  };

  const getContentZoneStyle = (zone: any) => ({
    position: 'absolute' as const,
    left: `${zone.x}%`,
    top: `${zone.y}%`,
    width: `${zone.width}%`,
    height: `${zone.height}%`,
  });

  const getTypographyStyle = (type: 'hero' | 'subtitle' | 'body' | 'accent') => {
    const typo = config.typography[type];
    return {
      fontFamily: typo.fontFamily,
      fontSize: typo.fontSize,
      fontWeight: typo.fontWeight,
      letterSpacing: typo.letterSpacing,
      lineHeight: typo.lineHeight || '1.2',
      textTransform: (typo.textTransform as any) || 'none',
      textShadow: typo.textShadow || 'none',
      color: config.colors.text,
    };
  };

  const renderTextureOverlay = () => {
    if (!config.effects.texture) return null;

    const textureClass = {
      'vintage-paper': 'vintage-grain-texture',
      'concrete-grain': 'concrete-texture',
      'wood-grain': 'wood-texture',
      'comic-dots': 'comic-dots-texture'
    }[config.effects.texture];

    return (
      <div 
        className={cn("absolute inset-0 pointer-events-none opacity-30", textureClass)}
        style={{ mixBlendMode: 'multiply' }}
      />
    );
  };

  const renderAnimationEffects = () => {
    if (!config.effects.animation) return null;

    return config.effects.animation.map((effect, index) => (
      <div
        key={index}
        className={cn(
          "absolute inset-0 pointer-events-none",
          effect === 'gold-shimmer' && 'gold-shimmer-effect',
          effect === 'victory-sparkle' && 'victory-sparkle-effect',
          effect === 'protest-glitch' && 'protest-glitch-effect',
          effect === 'power-burst' && 'power-burst-effect'
        )}
      />
    ));
  };

  const renderFoilEffects = () => {
    if (!config.effects.foil) return null;

    return config.effects.foil.map((foil, index) => (
      <div
        key={index}
        className={cn(
          "absolute pointer-events-none",
          foil === 'title-foil' && 'title-foil-effect',
          foil === 'border-foil' && 'border-foil-effect'
        )}
        style={
          foil === 'title-foil' 
            ? getContentZoneStyle(config.layout.contentZones.title)
            : foil === 'border-foil'
            ? { inset: 0 }
            : {}
        }
      />
    ));
  };

  return (
    <div 
      className={cn("professional-card-container", className)}
      style={getLayoutStyles()}
    >
      {/* Background Overlay */}
      {config.effects.overlay && (
        <div 
          className="absolute inset-0"
          style={{ background: config.effects.overlay }}
        />
      )}

      {/* Texture Overlay */}
      {renderTextureOverlay()}

      {/* Hero Image */}
      {memory.imageUrl && (
        <div 
          className="absolute overflow-hidden rounded"
          style={getContentZoneStyle(config.layout.contentZones.heroImage)}
        >
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-cover"
            style={{
              filter: template.id === 'coliseum-concrete' 
                ? 'contrast(1.1) saturate(0.9)' 
                : template.id === 'sell-team-activist'
                ? 'contrast(1.3) saturate(1.2)'
                : 'none'
            }}
          />
        </div>
      )}

      {/* Title */}
      <div 
        className="absolute flex items-center"
        style={{
          ...getContentZoneStyle(config.layout.contentZones.title),
          ...getTypographyStyle('hero')
        }}
      >
        <h1 className="w-full text-center leading-tight">
          {memory.title || 'Memory Title'}
        </h1>
      </div>

      {/* Subtitle */}
      {config.layout.contentZones.subtitle && (
        <div 
          className="absolute flex items-center"
          style={{
            ...getContentZoneStyle(config.layout.contentZones.subtitle),
            ...getTypographyStyle('subtitle'),
            color: config.colors.textSecondary
          }}
        >
          <p className="w-full text-center">
            {memory.opponent ? `vs ${memory.opponent}` : memory.location || 'Oakland Coliseum'}
            {memory.score && ` • ${memory.score}`}
          </p>
        </div>
      )}

      {/* Body Content */}
      <div 
        className="absolute"
        style={{
          ...getContentZoneStyle(config.layout.contentZones.body),
          ...getTypographyStyle('body')
        }}
      >
        <p className="line-clamp-4 text-center leading-relaxed">
          {memory.description || 'Your Oakland memory description will appear here...'}
        </p>
      </div>

      {/* Stats Panel */}
      {config.layout.contentZones.stats && (memory.game_date || memory.section) && (
        <div 
          className="absolute"
          style={{
            ...getContentZoneStyle(config.layout.contentZones.stats),
            ...getTypographyStyle('accent'),
            color: config.colors.accent
          }}
        >
          <div className="space-y-1 text-center">
            {memory.game_date && (
              <div className="text-xs opacity-90">
                {new Date(memory.game_date).toLocaleDateString()}
              </div>
            )}
            {memory.section && (
              <div className="text-xs opacity-90">{memory.section}</div>
            )}
            {memory.emotions && memory.emotions.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mt-2">
                {memory.emotions.slice(0, 2).map((emotion, index) => (
                  <span 
                    key={index} 
                    className="text-[10px] px-1 py-0.5 rounded-full bg-black/20"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logo */}
      {config.layout.contentZones.logo && (
        <div 
          className="absolute flex items-center justify-center"
          style={getContentZoneStyle(config.layout.contentZones.logo)}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ 
              backgroundColor: config.colors.accent,
              color: config.colors.secondary
            }}
          >
            A's
          </div>
        </div>
      )}

      {/* Foil Effects */}
      {renderFoilEffects()}

      {/* Animation Effects */}
      {renderAnimationEffects()}

      {/* Premium Badge */}
      {template.premium && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] font-bold px-2 py-1 rounded-full">
          PREMIUM
        </div>
      )}
    </div>
  );
};

export default ProfessionalCardRenderer;
