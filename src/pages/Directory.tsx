import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import PlatformCard from '@/components/PlatformCard';
import TagBadge from '@/components/TagBadge';
import { Platform, convertDummyPlatformToPlatform } from '@/types/supabase';
import { searchPlatforms } from '@/utils/searchUtils';
import { getPlatformsByTag, getAllTags, getPlatforms, searchPlatformsDatabase } from '@/utils/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type EnhancedPlatform = Platform;

const Directory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTag = searchParams.get('tag') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [filteredPlatforms, setFilteredPlatforms] = useState<EnhancedPlatform[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [useDatabase, setUseDatabase] = useState(true);
  const [totalPlatforms, setTotalPlatforms] = useState(0);
  const [page, setPage] = useState(currentPage);
  const platformsPerPage = 9;

  const { toast } = useToast();
  
  useEffect(() => {
    const loadTags = async () => {
      try {
        const dbTags = await getAllTags();
        if (dbTags.length > 0) {
          setAvailableTags(dbTags);
        } else {
          setUseDatabase(false);
          toast({
            title: "Database not initialized",
            description: "Please initialize the database with the button at the bottom-right",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error loading tags:', error);
        setUseDatabase(false);
        toast({
          title: "Database connection issue",
          description: "Please initialize the database with the button at the bottom-right",
          variant: "destructive",
        });
      }
    };
    
    loadTags();
  }, [toast]);
  
  useEffect(() => {
    setQuery(initialQuery);
    setSelectedTag(initialTag);
    setPage(currentPage);
    
    const loadPlatforms = async () => {
      setIsSearching(true);
      
      try {
        if (useDatabase) {
          let results: Platform[] = [];
          
          if (initialTag) {
            results = await getPlatformsByTag(initialTag);
          } else if (initialQuery) {
            results = await searchPlatformsDatabase(initialQuery);
          } else {
            results = await getPlatforms();
          }
          
          setTotalPlatforms(results.length);
          
          const startIdx = (currentPage - 1) * platformsPerPage;
          const endIdx = startIdx + platformsPerPage;
          setFilteredPlatforms(results.slice(startIdx, endIdx));
        } else {
          // Fallback to local data
          const { platforms } = await import('@/utils/dummyData');
          
          if (initialTag) {
            const { filterPlatformsByTag } = await import('@/utils/dummyData');
            const results = filterPlatformsByTag(initialTag);
            const enhancedResults = results.map(p => convertDummyPlatformToPlatform(p));
            setFilteredPlatforms(enhancedResults);
            setTotalPlatforms(results.length);
          } else if (initialQuery) {
            const { searchPlatforms: searchLocalPlatforms } = await import('@/utils/dummyData');
            const results = searchLocalPlatforms(platforms, initialQuery);
            const enhancedResults = results.map(p => convertDummyPlatformToPlatform(p));
            setFilteredPlatforms(enhancedResults);
            setTotalPlatforms(results.length);
          } else {
            const enhancedResults = platforms.map(p => convertDummyPlatformToPlatform(p));
            setFilteredPlatforms(enhancedResults);
            setTotalPlatforms(platforms.length);
          }
        }
      } catch (error) {
        console.error('Error loading platforms:', error);
        setUseDatabase(false);
        
        // Fallback to local data
        const { platforms, filterPlatformsByTag } = await import('@/utils/dummyData');
        
        if (initialTag) {
          const results = filterPlatformsByTag(initialTag);
          const enhancedResults = results.map(p => convertDummyPlatformToPlatform(p));
          setFilteredPlatforms(enhancedResults);
        } else if (initialQuery) {
          const { searchPlatforms: searchLocalPlatforms } = await import('@/utils/dummyData');
          const results = searchLocalPlatforms(platforms, initialQuery);
          const enhancedResults = results.map(p => convertDummyPlatformToPlatform(p));
          setFilteredPlatforms(enhancedResults);
        } else {
          const enhancedResults = platforms.map(p => convertDummyPlatformToPlatform(p));
          setFilteredPlatforms(enhancedResults);
        }
        
        toast({
          title: "Search error",
          description: "Using local data fallback",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    };
    
    loadPlatforms();
  }, [initialQuery, initialTag, currentPage, useDatabase, toast]);
  
  const handleSearch = async (searchQuery: string) => {
    setIsSearching(true);
    setSelectedTag('');
    setQuery(searchQuery);
    setPage(1);
    
    try {
      if (useDatabase) {
        const results = await searchPlatformsDatabase(searchQuery);
        setTotalPlatforms(results.length);
        setFilteredPlatforms(results.slice(0, platformsPerPage));
      } else {
        const { platforms } = await import('@/utils/dummyData');
        const { searchPlatforms: searchLocalPlatforms } = await import('@/utils/dummyData');
        const results = searchLocalPlatforms(platforms, searchQuery);
        const enhancedResults = results.map(p => convertDummyPlatformToPlatform(p));
        setTotalPlatforms(results.length);
        setFilteredPlatforms(enhancedResults.slice(0, platformsPerPage));
      }
      
      setSearchParams({ q: searchQuery, page: '1' });
    } catch (error) {
      console.error('Search error:', error);
      const { platforms } = await import('@/utils/dummyData');
      const { searchPlatforms: searchLocalPlatforms } = await import('@/utils/dummyData');
      const results = searchLocalPlatforms(platforms, searchQuery);
      const enhancedResults = results.map(p => convertDummyPlatformToPlatform(p));
      setFilteredPlatforms(enhancedResults);
      
      toast({
        title: "Search error",
        description: "Using local search fallback",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleTagSelect = async (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag('');
      setPage(1);
      
      try {
        if (useDatabase) {
          const data = await getPlatforms();
          setTotalPlatforms(data.length || 0);
          setFilteredPlatforms(data.slice(0, platformsPerPage));
        } else {
          const { platforms } = await import('@/utils/dummyData');
          const enhancedResults = platforms.map(p => convertDummyPlatformToPlatform(p));
          setFilteredPlatforms(enhancedResults.slice(0, platformsPerPage));
          setTotalPlatforms(platforms.length);
        }
        
        setSearchParams({ page: '1' });
      } catch (error) {
        console.error('Error fetching platforms:', error);
        const { platforms } = await import('@/utils/dummyData');
        const enhancedResults = platforms.map(p => convertDummyPlatformToPlatform(p));
        setFilteredPlatforms(enhancedResults.slice(0, platformsPerPage));
        setTotalPlatforms(platforms.length);
      }
    } else {
      setSelectedTag(tag);
      setQuery('');
      setPage(1);
      
      try {
        if (useDatabase) {
          const results = await getPlatformsByTag(tag);
          setTotalPlatforms(results.length);
          setFilteredPlatforms(results.slice(0, platformsPerPage));
        } else {
          const { filterPlatformsByTag } = await import('@/utils/dummyData');
          const results = filterPlatformsByTag(tag);
          const enhancedResults = results.map(p => convertDummyPlatformToPlatform(p));
          setFilteredPlatforms(enhancedResults.slice(0, platformsPerPage));
          setTotalPlatforms(results.length);
        }
        
        setSearchParams({ tag, page: '1' });
      } catch (error) {
        console.error('Error filtering by tag:', error);
        const { filterPlatformsByTag } = await import('@/utils/dummyData');
        const results = filterPlatformsByTag(tag);
        const enhancedResults = results.map(p => convertDummyPlatformToPlatform(p));
        setFilteredPlatforms(enhancedResults);
        
        toast({
          title: "Tag filtering error",
          description: "Using local data fallback",
          variant: "destructive",
        });
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    
    const startIdx = (newPage - 1) * platformsPerPage;
    const endIdx = startIdx + platformsPerPage;
    
    const params: { [key: string]: string } = { page: newPage.toString() };
    if (query) params.q = query;
    if (selectedTag) params.tag = selectedTag;
    setSearchParams(params);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalPlatforms / platformsPerPage);

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
            {availableTags.map((tag) => (
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
              ({totalPlatforms})
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlatforms.map((platform) => (
                <PlatformCard key={platform.id} platform={platform as any} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          isActive={pageNum === page}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationNext onClick={() => handlePageChange(page + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
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
                setPage(1);
                if (useDatabase) {
                  getPlatforms().then(data => {
                    setTotalPlatforms(data.length);
                    setFilteredPlatforms(data.slice(0, platformsPerPage));
                  });
                } else {
                  import('@/utils/dummyData').then(({ platforms }) => {
                    const enhancedResults = platforms.map(p => convertDummyPlatformToPlatform(p));
                    setFilteredPlatforms(enhancedResults.slice(0, platformsPerPage));
                    setTotalPlatforms(platforms.length);
                  });
                }
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
