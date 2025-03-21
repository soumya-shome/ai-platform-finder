import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import PlatformCard from '@/components/PlatformCard';
import PlatformListItem from '@/components/PlatformListItem';
import PlatformCompare from '@/components/PlatformCompare';
import TagBadge from '@/components/TagBadge';
import { Platform } from '@/types/supabase';
import { searchPlatformsDatabase } from '@/utils/searchUtils';
import { getPlatformsByTag, getAllTags, getPlatforms } from '@/utils/platformService';
import { useToast } from '@/components/ui/use-toast';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";

type ViewMode = 'grid' | 'list';

const Directory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTag = searchParams.get('tag') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const initialViewMode = (searchParams.get('view') || 'grid') as ViewMode;
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [totalPlatforms, setTotalPlatforms] = useState(0);
  const [page, setPage] = useState(currentPage);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const platformsPerPage = viewMode === 'grid' ? 9 : 6;

  const { toast } = useToast();
  
  useEffect(() => {
    const loadTags = async () => {
      try {
        const dbTags = await getAllTags();
        if (dbTags.length > 0) {
          setAvailableTags(dbTags);
        } else {
          toast({
            title: "Database not initialized",
            description: "Please initialize the database with the button at the bottom-right",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error loading tags:', error);
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
    setViewMode(initialViewMode);
    
    const loadPlatforms = async () => {
      setIsSearching(true);
      
      try {
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
      } catch (error) {
        console.error('Error loading platforms:', error);
        
        toast({
          title: "Database error",
          description: "Failed to load platforms. Please initialize the database with the button at the bottom-right.",
          variant: "destructive",
        });
        
        setFilteredPlatforms([]);
        setTotalPlatforms(0);
      } finally {
        setIsSearching(false);
      }
    };
    
    loadPlatforms();
  }, [initialQuery, initialTag, currentPage, initialViewMode, toast, platformsPerPage]);
  
  const handleSearch = async (searchQuery: string) => {
    setIsSearching(true);
    setSelectedTag('');
    setQuery(searchQuery);
    setPage(1);
    
    try {
      const results = await searchPlatformsDatabase(searchQuery);
      setTotalPlatforms(results.length);
      setFilteredPlatforms(results.slice(0, platformsPerPage));
      
      setSearchParams({ q: searchQuery, page: '1' });
    } catch (error) {
      console.error('Search error:', error);
      
      toast({
        title: "Search error",
        description: "Failed to search platforms. Please check database connection.",
        variant: "destructive",
      });
      
      setFilteredPlatforms([]);
      setTotalPlatforms(0);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleTagSelect = async (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag('');
      setPage(1);
      
      try {
        const data = await getPlatforms();
        setTotalPlatforms(data.length || 0);
        setFilteredPlatforms(data.slice(0, platformsPerPage));
        
        setSearchParams({ page: '1' });
      } catch (error) {
        console.error('Error fetching platforms:', error);
        
        toast({
          title: "Database error",
          description: "Failed to load platforms. Please check database connection.",
          variant: "destructive",
        });
        
        setFilteredPlatforms([]);
        setTotalPlatforms(0);
      }
    } else {
      setSelectedTag(tag);
      setQuery('');
      setPage(1);
      
      try {
        const results = await getPlatformsByTag(tag);
        setTotalPlatforms(results.length);
        setFilteredPlatforms(results.slice(0, platformsPerPage));
        
        setSearchParams({ tag, page: '1' });
      } catch (error) {
        console.error('Error filtering by tag:', error);
        
        toast({
          title: "Tag filtering error",
          description: "Failed to filter platforms by tag. Please check database connection.",
          variant: "destructive",
        });
        
        setFilteredPlatforms([]);
        setTotalPlatforms(0);
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
    if (viewMode) params.view = viewMode;
    setSearchParams(params);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    if (mode) {
      setViewMode(mode);
      
      const params: { [key: string]: string } = { view: mode };
      if (query) params.q = query;
      if (selectedTag) params.tag = selectedTag;
      params.page = '1';
      setSearchParams(params);
      
      setPage(1);
    }
  };

  const totalPages = Math.ceil(totalPlatforms / platformsPerPage);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Platform Directory</h1>
            <p className="text-muted-foreground">
              Discover and compare AI platforms to find the perfect solution for your needs.
            </p>
          </div>
          <Link to="/submit">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Platform
            </Button>
          </Link>
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
        
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-lg font-medium">
            {query && `Search results for "${query}"`}
            {selectedTag && `Platforms in "${selectedTag}"`}
            {!query && !selectedTag && 'All Platforms'}
            <span className="text-muted-foreground ml-2">
              ({totalPlatforms})
            </span>
          </h2>
          
          <div className="flex items-center gap-4">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => handleViewModeChange(value as ViewMode)}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
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
        </div>
        
        {isSearching ? (
          viewMode === 'grid' ? (
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
          ) : (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-32 rounded-xl border border-border bg-white dark:bg-gray-900 shadow-sm animate-pulse">
                  <div className="p-6 flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : filteredPlatforms.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlatforms.map((platform) => (
                  <PlatformCard key={platform.id} platform={platform} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPlatforms.map((platform) => (
                  <PlatformListItem key={platform.id} platform={platform} />
                ))}
              </div>
            )}
            
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
                getPlatforms().then(data => {
                  setTotalPlatforms(data.length);
                  setFilteredPlatforms(data.slice(0, platformsPerPage));
                });
              }}
              className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
      
      <PlatformCompare />
    </Layout>
  );
};

export default Directory;
