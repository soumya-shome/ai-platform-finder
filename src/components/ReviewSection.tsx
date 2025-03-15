
import React, { useState } from 'react';
import { Review } from '@/types/supabase';
import Rating from './Rating';
import ReviewForm from './ReviewForm';
import { flagReview } from '@/utils/reviewService'; // Updated import from reviewService
import { useToast } from '@/hooks/use-toast';

interface ReviewSectionProps {
  reviews: Review[];
  platformId: string;
  onReviewAdded?: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, platformId, onReviewAdded }) => {
  const [sortOption, setSortOption] = useState<'recent' | 'rating'>('recent');
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);
  const { toast } = useToast();
  
  const sortedReviews = [...localReviews].sort((a, b) => {
    if (sortOption === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  const handleFlagReview = async (reviewId: string) => {
    try {
      const success = await flagReview(reviewId);
      if (success) {
        setLocalReviews(prevReviews => 
          prevReviews.map(review => 
            review.id === reviewId ? { ...review, flagged: true } : review
          )
        );
        toast({
          title: "Review flagged",
          description: "Thank you for your feedback. This review has been flagged for moderation.",
        });
      }
    } catch (error) {
      console.error("Error flagging review:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to flag this review. Please try again later.",
      });
    }
  };

  const handleReviewSubmitted = () => {
    if (onReviewAdded) {
      onReviewAdded();
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Reviews (0)</h3>
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-6">No reviews yet. Be the first to leave a review!</p>
          <ReviewForm platformId={platformId} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Reviews ({localReviews.length})
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as 'recent' | 'rating')}
            className="text-sm bg-transparent border border-input rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div 
            key={review.id} 
            className={`border border-border rounded-lg p-4 bg-white dark:bg-gray-900 ${review.flagged ? 'opacity-60' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{review.userName}</div>
                <div className="flex items-center mt-1">
                  <Rating value={review.rating} />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {!review.flagged && (
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  aria-label="Report review"
                  onClick={() => handleFlagReview(review.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                    <path d="M12 3c-1.1 0-2 .9-2 2v.5S9 7 7 8.5c-1.5 1-2 2.5-2 3.5v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4c0-1-.5-2.5-2-3.5-2-1.5-3-3-3-3V5c0-1.1-.9-2-2-2z"></path>
                  </svg>
                </button>
              )}
            </div>
            
            <p className="mt-3 text-sm">{review.comment}</p>
            
            {review.flagged && (
              <div className="mt-2 text-xs text-muted-foreground italic">
                This review has been flagged for moderation
              </div>
            )}
          </div>
        ))}
      </div>
      
      <ReviewForm platformId={platformId} onReviewSubmitted={handleReviewSubmitted} />
    </div>
  );
};

export default ReviewSection;
