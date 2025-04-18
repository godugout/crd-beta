import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Image, Layers, Package, Users, Zap, PlayCircle, Eye, MessageCircle } from 'lucide-react';

const Home = () => {
  return (
    <PageLayout 
      title="Home | CardShow" 
      description="Create, manage, and share your digital card collection"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Collection</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Create, manage, and share your digital card collection
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/cards/create">Create New Card</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/gallery">Browse Gallery</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Image className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold mb-3">Card Gallery</h2>
            <p className="mb-4 text-muted-foreground">Browse your collection of cards and memories</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/gallery">View Cards</Link>
            </Button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Layers className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold mb-3">Collections</h2>
            <p className="mb-4 text-muted-foreground">Organize your cards into themed collections</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/collections">View Collections</Link>
            </Button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-3">Memory Packs</h2>
            <p className="mb-4 text-muted-foreground">Explore themed memory packs</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/packs">Browse Packs</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Experiences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 p-6 rounded-lg border">
              <div className="h-12 w-12 bg-white/80 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <PlayCircle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Game Day Mode</h3>
              <p className="mb-4 text-muted-foreground">
                Enhance your experience during live games with real-time updates and card creation
              </p>
              <Button asChild>
                <Link to="/features/game-day">Try Game Day Mode</Link>
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 p-6 rounded-lg border">
              <div className="h-12 w-12 bg-white/80 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
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
        
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Teams</h2>
            <Button asChild variant="outline">
              <Link to="/teams">View All Teams</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              to="/teams/oakland" 
              className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center hover:shadow-md transition-shadow border"
            >
              <div className="h-16 w-16 bg-[#006341]/10 rounded-full flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-[#006341]" />
              </div>
              <span className="font-medium">Oakland A's</span>
            </Link>
            
            <Link 
              to="/teams/sf-giants" 
              className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center hover:shadow-md transition-shadow border"
            >
              <div className="h-16 w-16 bg-[#FD5A1E]/10 rounded-full flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-[#FD5A1E]" />
              </div>
              <span className="font-medium">SF Giants</span>
            </Link>
            
            <Link 
              to="/community" 
              className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center hover:shadow-md transition-shadow border"
            >
              <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2">
                <MessageCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium">Community</span>
            </Link>
            
            <Link 
              to="/detector" 
              className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center hover:shadow-md transition-shadow border"
            >
              <div className="h-16 w-16 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center mb-2">
                <Eye className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="font-medium">Card Detector</span>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
