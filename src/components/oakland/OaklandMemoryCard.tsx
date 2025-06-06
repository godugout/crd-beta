
import React from 'react';
import { OaklandTemplateType } from './OaklandCardTemplates';

interface OaklandMemory {
  title: string;
  description: string;
  date: string;
  memoryType: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  attendees: string[];
  tags: string[];
  imageUrl: string;
  historicalContext?: string;
  personalSignificance?: string;
}

interface OaklandMemoryCardProps {
  memory: {
    title: string;
    description: string;
    date?: string; // Make optional to handle OaklandMemoryData
    memoryType?: string;
    opponent?: string;
    score?: string;
    location?: string;
    section?: string;
    attendees?: string[];
    tags?: string[];
    imageUrl: string;
    historicalContext?: string;
    personalSignificance?: string;
  };
  templateType: OaklandTemplateType;
}

const OaklandMemoryCard: React.FC<OaklandMemoryCardProps> = ({ memory, templateType }) => {
  const getTemplateStyles = (template: OaklandTemplateType) => {
    switch (template) {
      case 'classic':
        return {
          background: 'linear-gradient(135deg, #006341 0%, #003831 100%)',
          accent: '#EFB21E',
          textColor: '#FFFFFF'
        };
      case 'moneyball':
        return {
          background: 'linear-gradient(135deg, #2D5A3D 0%, #1A3A2A 100%)',
          accent: '#C4A962',
          textColor: '#E5E5E5'
        };
      case 'dynasty':
        return {
          background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
          accent: '#006341',
          textColor: '#003831'
        };
      case 'coliseum':
        return {
          background: 'linear-gradient(135deg, #4A5D23 0%, #2F3A16 100%)',
          accent: '#EFB21E',
          textColor: '#FFFFFF'
        };
      case 'tailgate':
        return {
          background: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)',
          accent: '#EFB21E',
          textColor: '#FFFFFF'
        };
      case 'bashbrothers':
        return {
          background: 'linear-gradient(135deg, #1E3A5F 0%, #0F1D2F 100%)',
          accent: '#FFD700',
          textColor: '#FFFFFF'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #006341 0%, #003831 100%)',
          accent: '#EFB21E',
          textColor: '#FFFFFF'
        };
    }
  };

  const styles = getTemplateStyles(templateType);

  return (
    <div 
      className="w-full max-w-sm mx-auto rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
      style={{ background: styles.background }}
    >
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span 
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: styles.accent, color: styles.background.includes('#FFD700') ? '#003831' : '#003831' }}
          >
            OAKLAND A'S MEMORY
          </span>
          {memory.date && (
            <span 
              className="text-xs font-medium"
              style={{ color: styles.textColor }}
            >
              {new Date(memory.date).getFullYear()}
            </span>
          )}
        </div>
        
        <h3 
          className="text-lg font-bold leading-tight"
          style={{ color: styles.accent }}
        >
          {memory.title}
        </h3>
      </div>

      {/* Image */}
      <div className="relative mx-4 mb-4 rounded-lg overflow-hidden">
        <img 
          src={memory.imageUrl} 
          alt={memory.title}
          className="w-full h-48 object-cover"
        />
        {memory.opponent && (
          <div 
            className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium"
            style={{ backgroundColor: styles.accent, color: '#003831' }}
          >
            vs {memory.opponent}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 pt-0">
        <p 
          className="text-sm mb-3 leading-relaxed"
          style={{ color: styles.textColor }}
        >
          {memory.description}
        </p>

        {/* Game Details */}
        {(memory.score || memory.section) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {memory.score && (
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: `${styles.accent}20`, color: styles.accent }}
              >
                {memory.score}
              </span>
            )}
            {memory.section && (
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: `${styles.accent}20`, color: styles.accent }}
              >
                {memory.section}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: styles.textColor, opacity: 0.8 }}>
            {memory.location || 'Oakland Coliseum'}
          </span>
          {memory.tags && memory.tags.length > 0 && (
            <span 
              className="font-medium"
              style={{ color: styles.accent }}
            >
              #{memory.tags.join(' #')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OaklandMemoryCard;
