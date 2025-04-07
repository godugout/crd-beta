
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Clock, MapPin, Medal, Ticket, Users } from 'lucide-react';

const OaklandLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-[#006341] text-white">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Preserve Your Oakland A's Memories</h1>
            <p className="text-lg mb-8">
              Create digital memory cards from your favorite moments at the Oakland Coliseum. 
              From the Bash Brothers to the Moneyball era, preserve your A's memories forever.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#EFB21E] hover:bg-[#D9A31D] text-[#003831]">
                <Link to="/oakland/create">Create Your First Memory</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/oakland/memories">Browse Memories</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EFB21E" d="M45,-52.2C58.2,-42.1,69,-28.1,71.4,-12.8C73.8,2.6,67.7,19.2,58.1,32.8C48.5,46.3,35.3,56.9,19.7,64.3C4.1,71.7,-14,75.9,-29.8,70.9C-45.7,65.9,-59.3,51.7,-67.7,34.7C-76.1,17.8,-79.3,-1.9,-73.2,-18C-67.1,-34,-51.8,-46.4,-36.6,-55.9C-21.4,-65.3,-6.4,-71.8,7.7,-80.3C21.9,-88.8,43.8,-99.3,45,-52.2Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#003831]">Create Your Personal A's Archive</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-12 w-12 bg-[#006341]/10 rounded-full flex items-center justify-center mb-4">
              <Ticket className="h-6 w-6 text-[#006341]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Game Tickets</h3>
            <p className="text-gray-600">Preserve your ticket stubs as digital collectibles with all the game details.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-12 w-12 bg-[#006341]/10 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-6 w-6 text-[#006341]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Game Photos</h3>
            <p className="text-gray-600">Upload your photos from the game and transform them into memory cards.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-12 w-12 bg-[#006341]/10 rounded-full flex items-center justify-center mb-4">
              <Medal className="h-6 w-6 text-[#006341]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Historic Moments</h3>
            <p className="text-gray-600">Record the historic A's moments you witnessed in person at the Coliseum.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-12 w-12 bg-[#006341]/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-[#006341]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Stadium Sections</h3>
            <p className="text-gray-600">Tag your exact seat location to remember your view of the diamond.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-12 w-12 bg-[#006341]/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-[#006341]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Friends & Family</h3>
            <p className="text-gray-600">Tag who was with you to remember those shared baseball experiences.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-12 w-12 bg-[#006341]/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-[#006341]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Final Season</h3>
            <p className="text-gray-600">Specially mark memories from the Coliseum's final Oakland A's season.</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-[#006341] hover:bg-[#003831]">
            <Link to="/oakland/create">
              Start Creating Memories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-[#EFB21E] text-[#003831] py-16">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Preserve Your Oakland A's Memories?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Don't let your Oakland Athletics memories fade away. Create digital memory cards that you can share and enjoy forever.
          </p>
          <Button asChild size="lg" className="bg-[#003831] hover:bg-[#002820] text-white">
            <Link to="/oakland/create">Create Your First Memory</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OaklandLanding;
