
import React from 'react';
import { Filter, Download, Share } from 'lucide-react';

const AssetMarketplace = () => {
  return (
    <div className="flex gap-2">
      <Filter size={18} className="text-gray-500" aria-label="Filter assets" />
      <Download size={18} className="text-gray-500" aria-label="Download asset" />
      <Share size={18} className="text-gray-500" aria-label="Share asset" />
    </div>
  );
};

export default AssetMarketplace;
