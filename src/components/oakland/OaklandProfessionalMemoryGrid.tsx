
import React from 'react';
import { Link } from 'react-router-dom';
import { OaklandMemory } from '@/hooks/useOaklandMemories';
import { getProfessionalTemplateById } from '@/lib/data/oakland/professionalTemplates';
import ProfessionalCardRenderer from './ProfessionalCardRenderer';

interface OaklandProfessionalMemoryGridProps {
  memories: OaklandMemory[];
  loading?: boolean;
}

const OaklandProfessionalMemoryGrid: React.FC<OaklandProfessionalMemoryGridProps> = ({ 
  memories, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Memories Found</h3>
        <p className="text-gray-600 mb-8">
          Be the first to create an Oakland A's memory!
        </p>
        <Link 
          to="/teams/oakland-athletics/create"
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Your First Memory
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {memories.map(memory => {
        // Get template or use default
        const template = memory.template_id 
          ? getProfessionalTemplateById(memory.template_id) 
          : getProfessionalTemplateById('classic-dynasty'); // fallback template
        
        if (!template) return null;
        
        // Convert memory data to match professional card renderer format
        const memoryData = {
          title: memory.title,
          description: memory.description || '',
          imageUrl: memory.image_url,
          opponent: memory.opponent,
          score: memory.score,
          location: memory.location || 'Oakland Coliseum',
          section: memory.section,
          game_date: memory.game_date,
          emotions: memory.emotions || [],
          tags: memory.tags || [],
        };
        
        return (
          <Link 
            key={memory.id} 
            to={`/teams/oakland-athletics/memories/${memory.id}`}
            className="block hover:scale-105 transition-transform duration-200"
          >
            <ProfessionalCardRenderer 
              template={template}
              memory={memoryData}
              className="h-full cursor-pointer"
            />
          </Link>
        );
      })}
    </div>
  );
};

export default OaklandProfessionalMemoryGrid;
