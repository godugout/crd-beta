
import React from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Camera, BookOpen, Map, Users, Star } from 'lucide-react';

const OaklandLanding = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#003831]/90 to-[#006341]/80 z-10" />
          <div 
            className="h-96 bg-cover bg-center"
            style={{ backgroundImage: "url('/oakland/coliseum-bg.jpg')" }}
          />
          
          <div className="container mx-auto px-4 relative z-20 -mt-80 pb-8">
            <div className="max-w-3xl text-white pt-12">
              <div className="flex items-center mb-6">
                <img 
                  src="/oakland/oak-fan-logo.png" 
                  alt="Oakland A's Fan Club" 
                  className="h-20 w-20 mr-4"
                />
                <div>
                  <h1 className="text-4xl font-bold mb-1">Oakland A's</h1>
                  <p className="text-xl opacity-90">Fan Memory Collection</p>
                </div>
              </div>
              
              <p className="text-lg mb-8">
                Capture, preserve, and share your Oakland Athletics memories from the Coliseum and beyond. 
                Create digital cards from your photos and memorabilia to build a lasting collection of A's moments.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/oakland/create">
                  <Button size="lg" className="bg-[#EFB21E] hover:bg-[#EFB21E]/90 text-[#003831]">
                    Create Memory <Camera className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/oakland/memories">
                  <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                    Browse Memories <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#003831]">
              Preserve Your A's Memories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Camera className="h-8 w-8 text-[#006341]" />}
                title="Game Day Captures"
                description="Save photos from games with automatic date and opponent tagging"
              />
              <FeatureCard 
                icon={<BookOpen className="h-8 w-8 text-[#006341]" />}
                title="Historical Context"
                description="Add stats, historical notes, and context to each memory"
              />
              <FeatureCard 
                icon={<Map className="h-8 w-8 text-[#006341]" />}
                title="Section Memories"
                description="Tag your favorite section views and memorable game locations"
              />
              <FeatureCard 
                icon={<Users className="h-8 w-8 text-[#006341]" />}
                title="Player Encounters"
                description="Document autographs, photos, and player interactions"
              />
              <FeatureCard 
                icon={<Star className="h-8 w-8 text-[#006341]" />}
                title="Special Moments"
                description="Record home runs, no-hitters, and other standout moments"
              />
              <div className="bg-gradient-to-br from-[#003831] to-[#006341] rounded-xl p-6 text-white flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold mb-3">Game Day Mode</h3>
                <p className="text-center mb-4">
                  Try our special game day mode for quick and easy memory capture while at the Coliseum.
                </p>
                <Link to="/gameday">
                  <Button className="bg-[#EFB21E] hover:bg-[#EFB21E]/90 text-[#003831]">
                    Go to Game Day Mode
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-[#003831]">
              Start Building Your A's Memory Collection
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
              Don't let those special moments fade away. Create your first Oakland Athletics memory card today.
            </p>
            <Link to="/oakland/create">
              <Button size="lg" className="bg-[#006341] hover:bg-[#006341]/90">
                Create Your First Memory
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

// Helper component for feature cards
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-[#003831]">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default OaklandLanding;
