
import React from 'react';

const SiteFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CardShow</h3>
            <p className="text-gray-400">
              The ultimate platform for digital card collectors and enthusiasts.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/gallery" className="text-gray-400 hover:text-white">Gallery</a></li>
              <li><a href="/collections" className="text-gray-400 hover:text-white">Collections</a></li>
              <li><a href="/ar-card-viewer" className="text-gray-400 hover:text-white">AR Viewer</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">
              Have questions or feedback? Reach out to our team.
            </p>
            <a href="mailto:support@cardshow.app" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
              support@cardshow.app
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} CardShow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
