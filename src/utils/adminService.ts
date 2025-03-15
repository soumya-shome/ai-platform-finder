import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/supabase';

// Get all flagged reviews
export const getFlaggedReviews = async (): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, platforms(name)')
    .eq('flagged', true)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching flagged reviews:', error);
    throw error;
  }
  
  return data ? data.map(review => ({
    id: review.id,
    platformId: review.platformid,
    userName: review.username,
    rating: review.rating,
    comment: review.comment || undefined,
    date: review.date || new Date().toISOString(),
    flagged: review.flagged || false,
    platformName: review.platforms?.name
  })) : [];
};

// Approve a review (remove flagged status)
export const approveReview = async (reviewId: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('verify_review', {
    review_id: reviewId,
    is_approved: true
  });
  
  if (error) {
    console.error('Error approving review:', error);
    return false;
  }
  
  return data === true;
};

// Reject a review (keep flagged and mark as reviewed)
export const rejectReview = async (reviewId: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('verify_review', {
    review_id: reviewId,
    is_approved: false
  });
  
  if (error) {
    console.error('Error rejecting review:', error);
    return false;
  }
  
  return data === true;
};
