
import { supabase } from '@/integrations/supabase/client';
import { Review, convertDbReviewToReview } from '@/types/supabase';

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
  const dbReview = {
    id: crypto.randomUUID(),
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
