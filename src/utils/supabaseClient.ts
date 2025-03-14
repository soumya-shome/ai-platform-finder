
import { Platform, Review } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

// Export searchPlatformsDatabase function 
export { searchPlatformsDatabase } from './searchUtils';

// Platform-related database operations
export const getPlatforms = async (): Promise<Platform[]> => {
  const { data, error } = await supabase
    .from('platforms')
    .select('*');
  
  if (error) {
    console.error('Error fetching platforms:', error);
    throw error;
  }
  
  return data || [];
};

export const getPlatformById = async (id: string): Promise<Platform | null> => {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching platform with id ${id}:`, error);
    return null;
  }
  
  return data;
};

export const getPlatformsByTag = async (tag: string): Promise<Platform[]> => {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .contains('tags', [tag]);
  
  if (error) {
    console.error(`Error fetching platforms with tag ${tag}:`, error);
    return [];
  }
  
  return data || [];
};

export const getAllTags = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('platforms')
    .select('tags');
  
  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
  
  const tagsSet = new Set<string>();
  data?.forEach(platform => {
    platform.tags.forEach((tag: string) => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet);
};

// Review-related database operations
export const getReviewsByPlatformId = async (platformId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('platformId', platformId);
  
  if (error) {
    console.error(`Error fetching reviews for platform ${platformId}:`, error);
    return [];
  }
  
  return data || [];
};

export const addReview = async (review: Omit<Review, 'id' | 'date' | 'flagged'>): Promise<Review | null> => {
  const newReview = {
    ...review,
    date: new Date().toISOString(),
    flagged: false
  };
  
  const { data, error } = await supabase
    .from('reviews')
    .insert(newReview)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding review:', error);
    return null;
  }
  
  return data;
};

export const flagReview = async (reviewId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('reviews')
    .update({ flagged: true })
    .eq('id', reviewId);
  
  if (error) {
    console.error(`Error flagging review ${reviewId}:`, error);
    return false;
  }
  
  return true;
};

// Data migration function (for initial setup)
export const migrateDataToSupabase = async (
  platforms: Platform[], 
  reviews: Review[]
): Promise<boolean> => {
  // Insert platforms
  const { error: platformsError } = await supabase
    .from('platforms')
    .insert(platforms);
  
  if (platformsError) {
    console.error('Error migrating platforms:', platformsError);
    return false;
  }
  
  // Insert reviews
  const { error: reviewsError } = await supabase
    .from('reviews')
    .insert(reviews);
  
  if (reviewsError) {
    console.error('Error migrating reviews:', reviewsError);
    return false;
  }
  
  return true;
};
