
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Linkedin } from 'lucide-react';
import { footerLinks } from '@/config/navigation/footerLinks';

const SiteFooter = () => {
  return (
    <footer className="bg-athletics-green dark:bg-athletics-green-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-athletics-gold">
              CardShow
            </h3>
            <p className="text-white/80 max-w-xs">
              Cards Rendered Digitally<sup className="text-xs">TM</sup> - The ultimate platform for card collectors.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-athletics-gold transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-athletics-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-athletics-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-athletics-gold transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-athletics-gold">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/80 hover:text-athletics-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-athletics-gold">Features</h4>
            <ul className="space-y-3">
              {footerLinks.features.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/80 hover:text-athletics-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-athletics-gold">Contact</h4>
            <p className="text-white/80 mb-4">
              Have questions or feedback? Reach out to our team.
            </p>
            <a href="mailto:support@cardshow.app" className="text-athletics-gold hover:text-athletics-gold-light transition-colors inline-block">
              support@cardshow.app
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-white/60">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className="inline-block px-4 py-1 rounded-full border border-white/10 hover:border-athletics-gold/50 transition-colors"
              >
                <span className="text-athletics-gold inline-block mr-1">•</span> {link.label}
              </Link>
            ))}
          </div>
          <p>© {new Date().getFullYear()} CardShow. Cards Rendered Digitally<sup className="text-xs">TM</sup>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
