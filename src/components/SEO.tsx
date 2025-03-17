
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({
  title = 'AI Platform Finder',
  description = 'Find, compare, and evaluate AI platforms and tools to discover the perfect solution for your needs.',
  keywords = 'AI platforms, artificial intelligence tools, AI comparison, machine learning',
  ogImage = '/og-image.png',
  canonicalUrl,
  type = 'website',
  children,
}) => {
  // Use current URL if canonical URL isn't provided
  const canonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const fullTitle = title === 'AI Platform Finder' ? title : `${title} | AI Platform Finder`;
  
  return (
    <Helmet>
      {/* Basic tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* OpenGraph tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      
      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical link */}
      <link rel="canonical" href={canonical} />
      
      {children}
    </Helmet>
  );
};

export default SEO;
