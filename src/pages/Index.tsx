
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import PlatformCard from '@/components/PlatformCard';
import TagBadge from '@/components/TagBadge';
import { platforms, popularTags } from '@/utils/dummyData';

const Index = () => {
  const navigate = useNavigate();
  
  const featuredPlatforms = platforms.slice(0, 4);

  return (
    <Layout>
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950"></div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_50%_40%,rgba(30,144,255,0.05)_0%,rgba(30,144,255,0)_100%)]"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Discover the Perfect
              <span className="text-primary ml-2">AI Platform</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the ideal AI solution based on your unique needs with our
              natural language search.
            </p>
          </div>
          
          <div className="mt-10 animate-slide-in flex justify-center">
            <SearchBar 
              size="lg"
              placeholder="Describe what you're looking for in plain language..."
              autofocus={true}
            />
          </div>
          
          <div className="mt-8 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-3">Popular categories:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularTags.slice(0, 8).map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured AI Platforms</h2>
            <button 
              onClick={() => navigate('/directory')}
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center"
            >
              View all platforms
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlatforms.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
            <p className="mt-4 text-muted-foreground">
              Finding the perfect AI platform has never been easier
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-border shadow-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 17.8h2"></path>
                  <rect x="10" y="2" width="4" height="10" rx="2"></rect>
                  <polyline points="12 12 12 16"></polyline>
                  <path d="M8.5 8.5a6 6 0 1 0 7 7 4 4 0 1 1-7-7Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Describe Your Needs</h3>
              <p className="text-muted-foreground">
                Use natural language to describe what you're looking for in an AI platform.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-border shadow-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="10" r="3"></circle>
                  <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Explore Results</h3>
              <p className="text-muted-foreground">
                Browse through AI platforms ranked by relevance to your specific requirements.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-border shadow-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                  <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                  <path d="M6.3 5h11.3a1 1 0 0 1 .97 1.243l-1.5 6a1 1 0 0 1 -.97 .757h-8.26a1 1 0 0 1 -.97 -.757l-1.5 -6a1 1 0 0 1 .97 -1.243z"></path>
                  <path d="M17 8h-6"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Compare & Choose</h3>
              <p className="text-muted-foreground">
                Compare features, pricing, and reviews to find the perfect AI platform for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
