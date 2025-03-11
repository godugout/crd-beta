
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Grid, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-cardshow-blue-light/30 to-white -z-10" />
          
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col text-left animate-slide-up">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cardshow-dark">
                  Create, organize, and share digital trading cards
                </h1>
                <p className="mt-6 text-lg text-cardshow-slate max-w-md">
                  Upload photos or scans, transform them into beautiful digital cards, organize your collection, and share with others.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/editor')}
                    className="flex items-center px-6 py-3 bg-cardshow-blue text-white font-medium rounded-lg shadow-sm hover:bg-opacity-90 transition-colors"
                  >
                    Create Your First Card
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate('/gallery')}
                    className="px-6 py-3 bg-white text-cardshow-dark font-medium rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    View Gallery
                  </button>
                </div>
              </div>
              <div className="flex justify-center animate-fade-in">
                <div className="relative">
                  {/* Card Stack Effect */}
                  <div className="absolute top-4 -left-4 w-full aspect-[2.5/3.5] bg-cardshow-blue/10 rounded-xl rotate-[-5deg] shadow-sm"></div>
                  <div className="absolute top-2 -right-4 w-full aspect-[2.5/3.5] bg-cardshow-blue/20 rounded-xl rotate-[5deg] shadow-sm"></div>
                  
                  {/* Main Card */}
                  <div className="relative w-full max-w-xs aspect-[2.5/3.5] bg-white rounded-xl overflow-hidden shadow-card">
                    <img 
                      src="https://images.unsplash.com/photo-1559583109-3e7968e11385?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                      alt="Sample card" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white font-semibold">Sample Card</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-cardshow-dark">How It Works</h2>
              <p className="mt-4 text-lg text-cardshow-slate max-w-2xl mx-auto">
                Transform your physical cards into digital treasures in three simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white border border-gray-100 shadow-subtle hover:shadow-card transition-shadow">
                <div className="w-16 h-16 flex items-center justify-center bg-cardshow-blue-light rounded-full mb-6">
                  <Upload className="h-8 w-8 text-cardshow-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload</h3>
                <p className="text-cardshow-slate">
                  Upload photos or scans of your physical cards to digitize your collection
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white border border-gray-100 shadow-subtle hover:shadow-card transition-shadow">
                <div className="w-16 h-16 flex items-center justify-center bg-cardshow-blue-light rounded-full mb-6">
                  <Grid className="h-8 w-8 text-cardshow-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Organize</h3>
                <p className="text-cardshow-slate">
                  Sort your cards into collections, add tags, and keep your digital collection organized
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white border border-gray-100 shadow-subtle hover:shadow-card transition-shadow">
                <div className="w-16 h-16 flex items-center justify-center bg-cardshow-blue-light rounded-full mb-6">
                  <Share2 className="h-8 w-8 text-cardshow-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Share</h3>
                <p className="text-cardshow-slate">
                  Share your digital cards with friends and fellow collectors on social media
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <button
                onClick={() => navigate('/editor')}
                className="px-6 py-3 bg-cardshow-blue text-white font-medium rounded-lg shadow-sm hover:bg-opacity-90 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-cardshow-slate text-sm">
                &copy; {new Date().getFullYear()} Cardshow. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-cardshow-slate text-sm hover:text-cardshow-blue transition-colors">Privacy Policy</a>
              <a href="#" className="text-cardshow-slate text-sm hover:text-cardshow-blue transition-colors">Terms of Service</a>
              <a href="#" className="text-cardshow-slate text-sm hover:text-cardshow-blue transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
