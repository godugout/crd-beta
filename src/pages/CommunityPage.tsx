
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { MessageSquare, Users, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CommunityPage = () => {
  return (
    <PageLayout
      title="Community"
      description="Connect with other collectors and share your experiences"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-gray-600">
            Connect with other collectors and share your experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Forums Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Discussion Forums</h2>
            <p className="text-gray-600 mb-4">
              Join conversations about collecting, trading, and card values
            </p>
            <Button variant="outline">
              Coming Soon
            </Button>
          </div>
          
          {/* Groups Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Collector Groups</h2>
            <p className="text-gray-600 mb-4">
              Find and join groups based on your specific collecting interests
            </p>
            <Button variant="outline">
              Coming Soon
            </Button>
          </div>
          
          {/* News Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Newspaper className="h-6 w-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Collector News</h2>
            <p className="text-gray-600 mb-4">
              Stay updated with the latest news from the collecting world
            </p>
            <Button variant="outline">
              Coming Soon
            </Button>
          </div>
        </div>
        
        {/* Coming Soon Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-3">Community Features Coming Soon</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            We're working hard to build community features that will connect collectors worldwide.
            Join our mailing list to be notified when these features launch.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button>
                Get Notified
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CommunityPage;
