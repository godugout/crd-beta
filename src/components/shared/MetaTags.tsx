
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface MetaTagsProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'profile';
  canonicalPath?: string;
  keywords?: string[];
  author?: string;
}

const DEFAULT_TITLE = 'CardShow - Digital Trading Card Platform';
const DEFAULT_DESCRIPTION = 'Create, collect and share digital trading cards with CardShow.';
const DEFAULT_IMAGE = '/og-image.png';
const BASE_URL = 'https://cardshow.app'; // Replace with your actual domain

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  imageUrl,
  type = 'website',
  canonicalPath,
  keywords = [],
  author = 'CardShow Team',
}) => {
  const location = useLocation();
  const currentPath = canonicalPath || location.pathname;
  const canonicalUrl = `${BASE_URL}${currentPath}`;
  
  const pageTitle = title ? `${title} | CardShow` : DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const pageImage = imageUrl ? 
    (imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`) : 
    `${BASE_URL}${DEFAULT_IMAGE}`;
  
  const defaultKeywords = [
    'digital cards',
    'trading cards',
    'collectibles',
    'memories',
    'sports cards',
    'card collection'
  ];
  
  const allKeywords = [...new Set([...defaultKeywords, ...keywords])].join(', ');
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content="CardShow" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    </Helmet>
  );
};

export default MetaTags;
