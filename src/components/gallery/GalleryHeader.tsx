
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface GalleryHeaderProps {
  title?: string;
  description?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  title = "Card Gallery",
  description = "Explore thousands of unique digital cards",
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-none">
        {title.split(' ').map((word, i) => 
          i === 1 ? <span key={i} className="text-brand-gradient">{word}</span> : <span key={i}>{word} </span>
        )}
      </h1>
      
      <p className="text-xl text-[var(--text-tertiary)] max-w-3xl mx-auto leading-relaxed mb-8">
        {description}
      </p>

      {/* Unified Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/60" />
          <Input
            placeholder="Search cards, creators, or collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-6 py-4 text-lg bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/60 focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)] backdrop-blur-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default GalleryHeader;
