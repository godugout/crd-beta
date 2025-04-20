
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import HeroSection from '@/components/card-showcase/HeroSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlayCircle, Zap, PlusCircle, Users, Layout, MessageCircle } from 'lucide-react';

const HomePage = () => {
  return (
    <PageLayout 
      title="CardShow - Digital Trading Cards"
      description="Create, collect and showcase your digital trading cards"
      fullWidth={true}
      hideBreadcrumbs={true}
    >
      <HeroSection />
      
      {/* Featured Experiences */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Featured Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 p-6 rounded-lg border group hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-white/80 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PlayCircle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Game Day Mode</h3>
              <p className="mb-4 text-muted-foreground">
                Enhance your experience during live games with real-time updates and card creation
              </p>
              <Button asChild>
                <Link to="/game-day">Try Game Day Mode</Link>
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 p-6 rounded-lg border group hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-white/80 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dugout Labs</h3>
              <p className="mb-4 text-muted-foreground">
                Preview experimental features and provide feedback to our team
              </p>
              <Button asChild>
                <Link to="/labs">Explore Labs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              to="/cards/create" 
              className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center hover:shadow-md transition-shadow border text-center group"
            >
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <span className="font-medium">Create Card</span>
            </Link>
            
            <Link 
              to="/collections" 
              className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center hover:shadow-md transition-shadow border text-center group"
            >
              <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Layout className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium">Collections</span>
            </Link>
            
            <Link 
              to="/teams" 
              className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center hover:shadow-md transition-shadow border text-center group"
            >
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium">Teams</span>
            </Link>
            
            <Link 
              to="/gallery" 
              className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center hover:shadow-md transition-shadow border text-center group"
            >
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">Gallery</span>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HomePage;
