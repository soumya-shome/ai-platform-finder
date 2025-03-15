
import { supabase } from '@/integrations/supabase/client';
import { Platform, Review } from '@/types/supabase';

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
    }).filter(review => review !== null);
    
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
