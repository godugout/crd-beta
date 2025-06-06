
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Linkedin, Sparkles } from 'lucide-react';
import { footerLinks } from '@/config/navigation';

const SiteFooter = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[var(--bg-tertiary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] text-white py-20 overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[var(--brand-primary)]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-[var(--brand-accent)]/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Enhanced Brand Section */}
          <div className="space-y-6">
            <div className="relative">
              <h3 className="text-3xl font-black text-white tracking-tight">
                Card<span className="text-brand-gradient">Show</span>
              </h3>
              {/* Sharp accent corner */}
              <div className="absolute -top-1 -right-8 w-4 h-4 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] clip-corner-tr opacity-70"></div>
            </div>
            
            <p className="text-[var(--text-secondary)] max-w-xs leading-relaxed font-medium">
              Cards Rendered Digitally<sup className="text-xs">™</sup> - The ultimate platform for card collectors and creators.
            </p>
            
            {/* Enhanced Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Github, href: "#", color: "hover:text-white" },
                { icon: Twitter, href: "#", color: "hover:text-[var(--brand-primary)]" },
                { icon: Instagram, href: "#", color: "hover:text-[var(--brand-accent)]" },
                { icon: Linkedin, href: "#", color: "hover:text-[var(--brand-secondary)]" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className={`w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/60 ${social.color} transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-110`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          {/* Enhanced Navigation Sections */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-white relative">
              Quick Links
              <div className="absolute -top-1 -right-4 w-3 h-3 bg-[var(--brand-primary)] clip-corner-tr opacity-60"></div>
            </h4>
            <ul className="space-y-4">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] transition-colors duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-xl mb-6 text-white relative">
              Features
              <div className="absolute -top-1 -right-4 w-3 h-3 bg-[var(--brand-accent)] clip-corner-tr opacity-60"></div>
            </h4>
            <ul className="space-y-4">
              {footerLinks.features.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-[var(--text-tertiary)] hover:text-[var(--brand-accent)] transition-colors duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-xl mb-6 text-white relative">
              Support
              <div className="absolute -top-1 -right-4 w-3 h-3 bg-[var(--brand-success)] clip-corner-tr opacity-60"></div>
            </h4>
            <p className="text-[var(--text-tertiary)] mb-6 leading-relaxed">
              Have questions or feedback? Our team is here to help you create amazing digital cards.
            </p>
            <a 
              href="mailto:support@cardshow.app" 
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white font-semibold rounded-lg hover:shadow-[var(--shadow-brand)] transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Contact Us
            </a>
          </div>
        </div>
        
        {/* Enhanced Bottom Section */}
        <div className="border-t border-white/10 mt-16 pt-8">
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className="tag-pill hover:bg-[var(--brand-primary)]/20 hover:border-[var(--brand-primary)]/30 hover:text-[var(--brand-primary)] transition-all duration-300"
              >
                <span className="text-[var(--brand-primary)] inline-block mr-2 text-xs">●</span> 
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-center text-[var(--text-quaternary)] font-medium">
            © {new Date().getFullYear()} CardShow. Cards Rendered Digitally<sup className="text-xs">™</sup>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
