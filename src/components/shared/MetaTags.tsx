
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface MetaTagsProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'profile';
  canonicalPath?: string;
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
}) => {
  const location = useLocation();
  const currentPath = canonicalPath || location.pathname;
  const canonicalUrl = `${BASE_URL}${currentPath}`;
  
  const pageTitle = title ? `${title} | CardShow` : DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const pageImage = imageUrl ? `${BASE_URL}${imageUrl}` : `${BASE_URL}${DEFAULT_IMAGE}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
    </Helmet>
  );
};

export default MetaTags;
