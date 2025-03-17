
import React from 'react';
import Navbar from './Navbar';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEO from './SEO';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'AI Platform Finder',
  description = 'Find, compare, and evaluate AI platforms and tools to discover the perfect solution for your needs.',
  keywords = 'AI platforms, artificial intelligence tools, AI comparison, machine learning'
}) => {
  const location = useLocation();
  const fullTitle = title === 'AI Platform Finder' ? title : `${title} | AI Platform Finder`;
  const canonicalUrl = `https://aiplatformfinder.com${location.pathname}`;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        canonicalUrl={canonicalUrl}
      />
      
      <Navbar />
      <main className="flex-1 transition-all duration-300 animate-fade-in">
        {children}
      </main>
      <footer className="py-6 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI Platform Finder
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/sitemap-html" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
