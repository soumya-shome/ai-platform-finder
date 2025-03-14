
import { Platform } from './dummyData';

// In a real application, this would be connected to an actual LLM
// For the MVP, we'll simulate natural language search with a scoring function

interface SearchResult {
  platform: Platform;
  score: number;
}

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

// Search function that returns ranked platforms based on a query
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
