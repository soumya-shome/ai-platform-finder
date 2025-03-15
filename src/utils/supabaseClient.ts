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

export const addNewPlatform = async (platformData: Omit<Platform, 'id' | 'rating' | 'reviewCount'>): Promise<Platform | null> => {
  const newPlatform: Omit<DbPlatform, 'id'> = {
    name: platformData.name,
    description: platformData.description,
    logo: platformData.logo || null,
    url: platformData.url,
    tags: platformData.tags,
    features: platformData.features,
    pricing: platformData.pricing,
    rating: 0,
    reviewcount: 0,
    apiavailable: platformData.apiAvailable
  };
  
  const { data, error } = await supabase
    .from('platforms')
    .insert(newPlatform)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding platform:', error);
    return null;
  }
  
  return data ? convertDbPlatformToPlatform(data) : null;
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
  const dbReview: DbReview = {
    id: crypto.randomUUID(), // Generate a new UUID
    platformid: review.platformId,
    username: review.userName,
    rating: review.rating,
    comment: review.comment || null,
    date: new Date().toISOString(),
    flagged: false
  };
  
  const { data: reviewData, error: reviewError } = await supabase
    .from('reviews')
    .insert(dbReview)
    .select()
    .single();
  
  if (reviewError) {
    console.error('Error adding review:', reviewError);
    return null;
  }
  
  if (reviewData) {
    try {
      const { data: platformData } = await supabase
        .from('platforms')
        .select('rating, reviewcount')
        .eq('id', review.platformId)
        .single();
      
      if (platformData) {
        const currentReviewCount = platformData.reviewcount;
        const currentRating = platformData.rating;
        
        const newReviewCount = currentReviewCount + 1;
        const newRating = ((currentRating * currentReviewCount) + review.rating) / newReviewCount;
        
        await supabase
          .from('platforms')
          .update({
            rating: newRating,
            reviewcount: newReviewCount
          })
          .eq('id', review.platformId);
      }
    } catch (err) {
      console.error('Error updating platform rating:', err);
    }
  }
  
  return reviewData ? convertDbReviewToReview(reviewData) : null;
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
    const dbPlatforms = platforms.map(platform => {
      return {
        name: platform.name,
        description: platform.description,
        logo: platform.logo || null,
        url: platform.url || platform.website || '',
        tags: platform.tags,
        features: platform.features,
        pricing: platform.pricing,
        rating: platform.rating,
        reviewcount: platform.reviewCount,
        apiavailable: platform.apiAvailable
      };
    });
    
    const { data: insertedPlatforms, error: platformsError } = await supabase
      .from('platforms')
      .insert(dbPlatforms)
      .select();
    
    if (platformsError) {
      console.error('Error migrating platforms:', platformsError);
      return false;
    }
    
    const platformIdMap = new Map<string, string>();
    
    platforms.forEach((oldPlatform, index) => {
      if (insertedPlatforms && insertedPlatforms[index]) {
        platformIdMap.set(oldPlatform.id, insertedPlatforms[index].id);
      }
    });
    
    const dbReviews = reviews.map(review => {
      const newPlatformId = platformIdMap.get(review.platformId);
      
      if (!newPlatformId) {
        console.error(`Could not find new ID for platform ${review.platformId}`);
        return null;
      }
      
      return {
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
