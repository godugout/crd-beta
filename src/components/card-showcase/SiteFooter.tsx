
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Linkedin } from 'lucide-react';
import { footerLinks } from '@/config/navigation';

const SiteFooter = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
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
            <h4 className="font-semibold text-lg mb-4 text-primary/80">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-primary/80">Features</h4>
            <ul className="space-y-3">
              {footerLinks.features.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-primary/80">Contact</h4>
            <p className="text-gray-400 mb-4">
              Have questions or feedback? Reach out to our team.
            </p>
            <a href="mailto:support@cardshow.app" className="text-primary hover:text-primary/80 transition-colors inline-block">
              support@cardshow.app
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className="inline-block px-4 py-1 rounded-full border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <span className="text-primary inline-block mr-1">•</span> {link.label}
              </Link>
            ))}
          </div>
          <p>© {new Date().getFullYear()} CardShow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
