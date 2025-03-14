
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import PlatformCard from '@/components/PlatformCard';
import TagBadge from '@/components/TagBadge';
import { platforms, getAllTags, filterPlatformsByTag } from '@/utils/dummyData';
import { searchPlatforms } from '@/utils/searchUtils';

const Directory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTag = searchParams.get('tag') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [filteredPlatforms, setFilteredPlatforms] = useState(platforms);
  const [isSearching, setIsSearching] = useState(false);
  
  const allTags = getAllTags();
  
  useEffect(() => {
    // Update state based on URL params
    setQuery(initialQuery);
    setSelectedTag(initialTag);
    
    if (initialTag) {
      setFilteredPlatforms(filterPlatformsByTag(initialTag));
    } else if (initialQuery) {
      setFilteredPlatforms(searchPlatforms(platforms, initialQuery));
    } else {
      setFilteredPlatforms(platforms);
    }
  }, [initialQuery, initialTag]);
  
  const handleSearch = (searchQuery: string) => {
    setIsSearching(true);
    setSelectedTag('');
    setQuery(searchQuery);
    
    setTimeout(() => {
      const results = searchPlatforms(platforms, searchQuery);
      setFilteredPlatforms(results);
      setIsSearching(false);
      
      // Update URL
      setSearchParams({ q: searchQuery });
    }, 300);
  };
  
  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
      // Deselect tag
      setSelectedTag('');
      setFilteredPlatforms(platforms);
      setSearchParams({});
    } else {
      // Select tag
      setSelectedTag(tag);
      setQuery('');
      const results = filterPlatformsByTag(tag);
      setFilteredPlatforms(results);
      
      // Update URL
      setSearchParams({ tag });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">AI Platform Directory</h1>
          <p className="text-muted-foreground">
            Discover and compare AI platforms to find the perfect solution for your needs.
          </p>
        </div>
        
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            initialQuery={query}
            placeholder="Search by description, features, or use case..."
          />
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3">Popular Categories</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <TagBadge
                key={tag}
                tag={tag}
                selected={tag === selectedTag}
                onSelect={() => handleTagSelect(tag)}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">
            {query && `Search results for "${query}"`}
            {selectedTag && `Platforms in "${selectedTag}"`}
            {!query && !selectedTag && 'All Platforms'}
            <span className="text-muted-foreground ml-2">
              ({filteredPlatforms.length})
            </span>
          </h2>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              className="text-sm bg-transparent border border-input rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>
        
        {isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-64 rounded-xl border border-border bg-white dark:bg-gray-900 shadow-sm animate-pulse">
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPlatforms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlatforms.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-muted-foreground/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
              <path d="M8 11h6"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium">No platforms found</h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              We couldn't find any platforms matching your criteria. Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedTag('');
                setFilteredPlatforms(platforms);
                setSearchParams({});
              }}
              className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Directory;
