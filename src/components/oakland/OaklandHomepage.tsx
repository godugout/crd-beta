
import React from 'react';
import { Team } from '@/lib/types/teamTypes';
import OaklandHeroSection from './OaklandHeroSection';
import OaklandMemoryGallery from './OaklandMemoryGallery';

interface OaklandHomepageProps {
  team?: Team;
}

const OaklandHomepage: React.FC<OaklandHomepageProps> = ({ team }) => {
  return (
    <div className="min-h-screen bg-oakland-primary">
      <OaklandHeroSection />
      
      {/* Memory Gallery Section */}
      <section className="py-16 bg-gradient-to-b from-oakland-primary to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-center text-white mb-12">
            Latest Fan Memories
          </h2>
          <OaklandMemoryGallery />
        </div>
      </section>
      
      {/* Community Features - Coming Soon */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-8">
            More Features Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold text-white mb-2">Walkman Player</h3>
              <p className="text-gray-400">Listen to fan-recorded audio memories</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4">📺</div>
              <h3 className="text-xl font-bold text-white mb-2">Retro Jumbotron</h3>
              <p className="text-gray-400">Broadcast messages like the old Coliseum</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-bold text-white mb-2">Misfit Mascots</h3>
              <p className="text-gray-400">Meet Oakland's rebellious mascot gallery</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OaklandHomepage;
