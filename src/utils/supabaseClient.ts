
import { 
  Platform, 
  Review, 
  DbPlatform, 
  DbReview, 
  convertDbPlatformToPlatform, 
  convertReviewToDbReview, 
  convertDbReviewToReview,
  convertDummyPlatformToPlatform
} from '@/types/supabase';
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
  
  return data ? data.map(convertDbPlatformToPlatform) : [];
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
  
  return data ? convertDbPlatformToPlatform(data) : null;
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
  
  return data ? data.map(convertDbPlatformToPlatform) : [];
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
    .eq('platformid', platformId);
  
  if (error) {
    console.error(`Error fetching reviews for platform ${platformId}:`, error);
    return [];
  }
  
  return data ? data.map(convertDbReviewToReview) : [];
};

export const addReview = async (review: Omit<Review, 'id' | 'date' | 'flagged'>): Promise<Review | null> => {
  // Create a complete DbReview object with required fields
  const dbReview: DbReview = {
    id: crypto.randomUUID(), // Generate a new UUID
    platformid: review.platformId,
    username: review.userName,
    rating: review.rating,
    comment: review.comment || null,
    date: new Date().toISOString(),
    flagged: false
  };
  
  const { data, error } = await supabase
    .from('reviews')
    .insert(dbReview)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding review:', error);
    return null;
  }
  
  return data ? convertDbReviewToReview(data) : null;
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
  try {
    // Convert Platform objects to DbPlatform objects
    // IMPORTANT: Generate new UUIDs instead of using the string IDs from dummy data
    const dbPlatforms = platforms.map(platform => {
      // Generate a new UUID for each platform
      const newId = crypto.randomUUID();
      
      return {
        // Don't send the original string ID - let Supabase generate a UUID
        id: undefined, 
        name: platform.name,
        description: platform.description,
        logo: platform.logo || null,
        url: platform.url || platform.website || '', // Handle both url and website fields
        tags: platform.tags,
        features: platform.features,
        pricing: platform.pricing,
        rating: platform.rating,
        reviewcount: platform.reviewCount,
        apiavailable: platform.apiAvailable
      };
    });
    
    // Insert platforms
    const { data: insertedPlatforms, error: platformsError } = await supabase
      .from('platforms')
      .insert(dbPlatforms)
      .select();
    
    if (platformsError) {
      console.error('Error migrating platforms:', platformsError);
      return false;
    }
    
    // Create a mapping from old platform IDs to new UUIDs
    const platformIdMap = new Map<string, string>();
    
    platforms.forEach((oldPlatform, index) => {
      if (insertedPlatforms && insertedPlatforms[index]) {
        platformIdMap.set(oldPlatform.id, insertedPlatforms[index].id);
      }
    });
    
    // Convert Review objects to DbReview objects with updated platform IDs
    const dbReviews = reviews.map(review => {
      const newPlatformId = platformIdMap.get(review.platformId);
      
      if (!newPlatformId) {
        console.error(`Could not find new ID for platform ${review.platformId}`);
        return null;
      }
      
      return {
        // Don't send the original ID - let Supabase generate a UUID
        id: undefined,
        platformid: newPlatformId,
        username: review.userName,
        rating: review.rating,
        comment: review.comment || null,
        date: review.date,
        flagged: review.flagged
      };
    }).filter(review => review !== null) as DbReview[];
    
    if (dbReviews.length === 0) {
      console.log('No reviews to migrate after platform ID mapping');
      return true;
    }
    
    // Insert reviews
    const { error: reviewsError } = await supabase
      .from('reviews')
      .insert(dbReviews);
    
    if (reviewsError) {
      console.error('Error migrating reviews:', reviewsError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in migration:', error);
    return false;
  }
};

