
import React from 'react';
import { cn } from '@/lib/utils';
import { OaklandCardTemplate } from '@/lib/data/oaklandCardTemplates';

interface OaklandCardPreviewProps {
  template: OaklandCardTemplate;
  title?: string;
  subtitle?: string;
  className?: string;
  isInteractive?: boolean;
  onSelect?: () => void;
}

const OaklandCardPreview: React.FC<OaklandCardPreviewProps> = ({
  template,
  title = 'Oakland A\'s',
  subtitle = 'Baseball Card',
  className,
  isInteractive = false,
  onSelect
}) => {
  const backgroundStyle = React.useMemo(() => {
    const { backgroundConfig } = template;
    
    switch (backgroundConfig.type) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${backgroundConfig.primary} 0%, ${backgroundConfig.secondary || backgroundConfig.primary} 100%)`
        };
      case 'solid':
        return {
          backgroundColor: backgroundConfig.primary
        };
      case 'image':
        return {
          backgroundImage: `url(${template.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      default:
        return {
          backgroundColor: 'transparent'
        };
    }
  }, [template]);

  const overlayStyle = React.useMemo(() => {
    if (template.backgroundConfig.type === 'transparent') return {};
    
    return {
      backgroundColor: template.backgroundConfig.primary,
      opacity: template.backgroundConfig.opacity || 0.2
    };
  }, [template.backgroundConfig]);

  return (
    <div 
      className={cn(
        "relative overflow-hidden shadow-lg transition-all duration-300",
        "w-full", // Will be constrained by parent
        isInteractive && "cursor-pointer hover:shadow-xl hover:scale-105",
        className
      )}
      style={{ aspectRatio: '2.5 / 3.5' }} // Enforce 2.5:3.5 ratio
      onClick={onSelect}
    >
      {/* Background Layer */}
      <div 
        className="absolute inset-0"
        style={backgroundStyle}
      />
      
      {/* Background Overlay */}
      {template.backgroundConfig.type !== 'transparent' && (
        <div 
          className="absolute inset-0"
          style={overlayStyle}
        />
      )}
      
      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <img 
          src={template.imageUrl}
          alt={template.name}
          className={cn(
            "max-w-full max-h-full object-contain rounded-lg",
            template.category === 'protest' && "filter contrast-110 saturate-110"
          )}
          style={{
            filter: template.effects.includes('vintage') ? 'sepia(0.3) contrast(1.1)' : 'none'
          }}
        />
      </div>
      
      {/* Text Overlay */}
      {template.textConfig.placement !== 'overlay' && (
        <div 
          className={cn(
            "absolute left-0 right-0 p-3 text-center",
            template.textConfig.placement === 'bottom' && "bottom-0 bg-gradient-to-t from-black/80 to-transparent",
            template.textConfig.placement === 'top' && "top-0 bg-gradient-to-b from-black/80 to-transparent"
          )}
        >
          <h3 
            className="font-bold text-sm leading-tight"
            style={{ 
              color: template.textConfig.primaryColor,
              fontFamily: template.textConfig.fontFamily === 'serif' ? 'Georgia, serif' : 
                          template.textConfig.fontFamily === 'impact' ? 'Impact, sans-serif' : 
                          'Arial, sans-serif'
            }}
          >
            {title}
          </h3>
          <p 
            className="text-xs mt-1"
            style={{ color: template.textConfig.secondaryColor }}
          >
            {subtitle}
          </p>
        </div>
      )}
      
      {/* Corner Badge for Category */}
      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
        {template.category}
      </div>
      
      {/* Effects Indicators */}
      {template.effects.length > 0 && (
        <div className="absolute bottom-2 left-2 flex space-x-1">
          {template.effects.slice(0, 2).map(effect => (
            <div 
              key={effect}
              className="bg-yellow-500/80 text-black text-xs px-1 py-0.5 rounded"
            >
              {effect}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OaklandCardPreview;
