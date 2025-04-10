
import React from 'react';
import { Github, Twitter, Instagram, Linkedin } from 'lucide-react';

const SiteFooter = () => {
  return (
    <footer className="bg-litmus-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-litmus-purple to-litmus-purple-secondary bg-clip-text text-transparent">
              CardShow
            </h3>
            <p className="text-gray-400 max-w-xs">
              The ultimate platform for digital card collectors and enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-litmus-purple-light">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</a></li>
              <li><a href="/collections" className="text-gray-400 hover:text-white transition-colors">Collections</a></li>
              <li><a href="/teams" className="text-gray-400 hover:text-white transition-colors">Teams</a></li>
              <li><a href="/community" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-litmus-purple-light">Features</h4>
            <ul className="space-y-3">
              <li><a href="/ar-viewer" className="text-gray-400 hover:text-white transition-colors">AR Viewer</a></li>
              <li><a href="/detector" className="text-gray-400 hover:text-white transition-colors">Card Detection</a></li>
              <li><a href="/animation" className="text-gray-400 hover:text-white transition-colors">Card Effects</a></li>
              <li><a href="/game-day" className="text-gray-400 hover:text-white transition-colors">Game Day Mode</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-litmus-purple-light">Contact</h4>
            <p className="text-gray-400 mb-4">
              Have questions or feedback? Reach out to our team.
            </p>
            <a href="mailto:support@cardshow.app" className="text-litmus-purple-light hover:text-litmus-purple-secondary transition-colors inline-block">
              support@cardshow.app
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 rounded-full border border-litmus-gray-800 hover:border-litmus-purple/50 transition-colors">
              <span className="text-litmus-purple inline-block mr-1">•</span> Team
            </span>
            <span className="inline-block px-4 py-1 rounded-full border border-litmus-gray-800 hover:border-litmus-purple/50 transition-colors mx-2">
              <span className="text-litmus-purple inline-block mr-1">•</span> Privacy
            </span>
            <span className="inline-block px-4 py-1 rounded-full border border-litmus-gray-800 hover:border-litmus-purple/50 transition-colors">
              <span className="text-litmus-purple inline-block mr-1">•</span> Terms
            </span>
          </div>
          <p>© {new Date().getFullYear()} CardShow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
