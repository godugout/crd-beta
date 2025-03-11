
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">CardShow</span>
            </div>
            <p className="text-sm mt-2 text-gray-600">The fun way to share your trading card collection</p>
          </div>
          <div className="flex space-x-6">
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-3">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Featured Cards</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Collections</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-3">Help</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">FAQ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} CardShow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
