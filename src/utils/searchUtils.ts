import { Platform, SearchResult, DbPlatform, convertDbPlatformToPlatform, convertDummyPlatformToPlatform } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

// Client-side search function (for fallback and immediate filtering)
// Function to calculate a relevance score based on search terms
const calculateRelevanceScore = (platform: Platform, searchQuery: string): number => {
  if (!searchQuery.trim()) return 0;
  
  const query = searchQuery.toLowerCase();
  const words = query.split(/\s+/);
  let score = 0;

  // Check name match
  if (platform.name.toLowerCase().includes(query)) {
    score += 10;
  }

  // Check description match
  if (platform.description.toLowerCase().includes(query)) {
    score += 5;
  }

  // Check tag matches
  platform.tags.forEach(tag => {
    if (tag.toLowerCase().includes(query)) {
      score += 8;
    }
    
    // Check if any word in the query matches the tag
    words.forEach(word => {
      if (tag.toLowerCase().includes(word) && word.length > 2) {
        score += 3;
      }
    });
  });

  // Check feature matches
  platform.features.forEach(feature => {
    if (feature.toLowerCase().includes(query)) {
      score += 6;
    }
    
    // Check if any word in the query matches the feature
    words.forEach(word => {
      if (feature.toLowerCase().includes(word) && word.length > 2) {
        score += 2;
      }
    });
  });

  // Additional context-based scoring
  if (query.includes('free') && platform.pricing.hasFree) {
    score += 7;
  }

  if (query.includes('api') && platform.apiAvailable) {
    score += 7;
  }

  if ((query.includes('image') || query.includes('picture') || query.includes('photo')) && 
      (platform.tags.some(tag => tag.toLowerCase().includes('image')))) {
    score += 7;
  }

  if ((query.includes('language') || query.includes('text') || query.includes('chat') || query.includes('write')) && 
      (platform.tags.some(tag => tag.toLowerCase().includes('language') || tag.toLowerCase().includes('nlp')))) {
    score += 7;
  }

  // Handle some complex queries (this would be much more sophisticated with a real LLM)
  if (query.includes('business') || query.includes('enterprise')) {
    if (platform.tags.includes('Enterprise')) {
      score += 6;
    }
  }

  if (query.includes('developer') || query.includes('coding') || query.includes('code')) {
    if (platform.tags.some(tag => tag.includes('API') || tag.includes('Open Source'))) {
      score += 6;
    }
  }

  return score;
};

// Client-side search function (for fallback and immediate filtering)
export const searchPlatforms = (platforms: Platform[], query: string): Platform[] => {
  if (!query.trim()) return platforms;

  const results: SearchResult[] = platforms.map(platform => ({
    platform,
    score: calculateRelevanceScore(platform, query)
  }));

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);

  // Filter out very low relevance results
  const filteredResults = results.filter(result => result.score > 0);

  // Return just the platforms in ranked order
  return filteredResults.map(result => result.platform);
};

// Server-side search with Supabase full-text search
export const searchPlatformsDatabase = async (query: string): Promise<Platform[]> => {
  try {
    if (!query.trim()) {
      const { data } = await supabase.from('platforms').select('*');
      return data ? data.map(convertDbPlatformToPlatform) : [];
    }

    // First try text search on multiple columns
    const searchQuery = query.trim().toLowerCase();
    
    let { data, error } = await supabase
    .rpc('search_platforms_by_tag', { search_tag: searchQuery }) // Call the SQL function
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error searching platforms by tags:', error);
    throw error;
  }

    // If no tag matches, try searching by name and description
    if (!data || data.length === 0) {
      // Try searching by name and description
      const { data: textResults, error: textError } = await supabase
        .from('platforms')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order('rating', { ascending: false });
      
      if (textError) {
        console.error('Error searching platforms by name/description:', textError);
      } else if (textResults && textResults.length > 0) {
        data = textResults;
      }
    }


    // Fallback to client-side search if no results from database
    if (!data || data.length === 0) {
      const allPlatforms = await supabase.from('platforms').select('*');
      if (allPlatforms.data) {
        const platforms = allPlatforms.data.map(convertDbPlatformToPlatform);
        return searchPlatforms(platforms, query);
      }
    }
    
    return data ? data.map(convertDbPlatformToPlatform) : [];
  } catch (error) {
    console.error('Error with database search:', error);
    // Fallback to fetching all platforms and searching client-side
    const { data } = await supabase.from('platforms').select('*');
    const platforms = data ? data.map(convertDbPlatformToPlatform) : [];
    return searchPlatforms(platforms, query);
  }
};

// Feature-based search - find platforms based on specific features
export const searchPlatformsByFeature = async (feature: string): Promise<Platform[]> => {
  try {
    // Use explicit typing to avoid deep type instantiation
    const { data, error } = await supabase
      .from('platforms')
      .select('*')
      .contains('features', [feature]);
    
    if (error) {
      console.error('Error searching platforms by feature:', error);
      throw error;
    }
    
    // Use explicit conversion to Platform[] to avoid type issues
    return (data || []).map(convertDbPlatformToPlatform);
  } catch (error) {
    console.error('Error with feature search:', error);
    return [];
  }
};

// Free platform search - find platforms with free tier
export const searchFreePlatforms = async (): Promise<Platform[]> => {
  try {
    // Use a more explicit approach to avoid excessive type instantiation
    const { data, error } = await supabase
      .from('platforms')
      .select('*');
    
    if (error) {
      console.error('Error searching free platforms:', error);
      throw error;
    }
    
    // Filter the platforms with free tier after fetching them
    // This avoids the complex type inference with the JSON query
    const freePlatforms = data ? data.filter(platform => {
      try {
        // Parse the pricing JSON and check if hasFree is true
        if (typeof platform.pricing === 'object' && platform.pricing !== null) {
          const pricing = platform.pricing as { hasFree?: boolean };
          return pricing.hasFree === true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }) : [];
    
    // Convert to Platform[] type
    return freePlatforms.map(convertDbPlatformToPlatform);
  } catch (error) {
    console.error('Error with free platform search:', error);
    return [];
  }
};

// API availability search - find platforms with API
export const searchPlatformsWithAPI = async (): Promise<Platform[]> => {
  try {
    // Use explicit typing to avoid deep type instantiation
    const { data, error } = await supabase
      .from('platforms')
      .select('*')
      .eq('apiavailable', true);
    
    if (error) {
      console.error('Error searching platforms with API:', error);
      throw error;
    }
    
    // Use explicit conversion to Platform[] to avoid type issues
    return (data || []).map(convertDbPlatformToPlatform);
  } catch (error) {
    console.error('Error with API platform search:', error);
    return [];
  }
};
