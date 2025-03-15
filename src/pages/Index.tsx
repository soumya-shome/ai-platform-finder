import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import PlatformCard from '@/components/PlatformCard';
import TagBadge from '@/components/TagBadge';
import {  getPlatforms } from '@/utils/supabaseClient';

const Index = () => {
  const navigate = useNavigate();
  const [featuredPlatforms, setFeaturedPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch platforms when the component mounts
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const data = await getPlatforms(); // Fetch platforms from your API
        setFeaturedPlatforms(data.slice(0, 4)); // Show only top 4 platforms
      } catch (err) {
        console.error("Error fetching platforms:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  return (
    <Layout>
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950"></div>
        
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
              {/* Replace static tags with dynamic tags if available */}
              {["Machine Learning", "NLP", "Computer Vision", "Automation"].map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Platforms Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured AI Platforms</h2>
            <button 
              onClick={() => navigate('/directory')}
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center"
            >
              View all platforms
            </button>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading platforms...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPlatforms.length > 0 ? (
                featuredPlatforms.map((platform) => <PlatformCard key={platform.id} platform={platform} />)
              ) : (
                <p className="text-center text-muted-foreground">No platforms found.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;