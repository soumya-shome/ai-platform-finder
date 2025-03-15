
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { RequireAdmin } from '@/contexts/AdminContext';
import { Review } from '@/types/supabase';
import { getFlaggedReviews, approveReview, rejectReview } from '@/utils/adminService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import Rating from '@/components/Rating';

const AdminPage = () => {
  const [flaggedReviews, setFlaggedReviews] = useState<(Review & { platformName?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadFlaggedReviews = async () => {
    try {
      setIsLoading(true);
      const reviews = await getFlaggedReviews();
      setFlaggedReviews(reviews);
    } catch (error) {
      console.error('Error loading flagged reviews:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load flagged reviews",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFlaggedReviews();
  }, []);

  const handleApproveReview = async (reviewId: string) => {
    try {
      const success = await approveReview(reviewId);
      if (success) {
        toast({
          title: "Review approved",
          description: "The review has been approved and is now visible.",
        });
        await loadFlaggedReviews();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to approve the review.",
        });
      }
    } catch (error) {
      console.error('Error approving review:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while approving the review.",
      });
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    try {
      const success = await rejectReview(reviewId);
      if (success) {
        toast({
          title: "Review rejected",
          description: "The review has been rejected and will remain hidden.",
        });
        await loadFlaggedReviews();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to reject the review.",
        });
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while rejecting the review.",
      });
    }
  };

  return (
    <RequireAdmin>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Flagged Reviews</h2>
            
            {isLoading ? (
              <div className="p-8 text-center">Loading flagged reviews...</div>
            ) : flaggedReviews.length === 0 ? (
              <div className="p-8 text-center border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No flagged reviews found</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableCaption>List of reviews that have been flagged by users</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="w-[350px]">Comment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flaggedReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.userName}</TableCell>
                        <TableCell>{review.platformName}</TableCell>
                        <TableCell>
                          <Rating value={review.rating} />
                        </TableCell>
                        <TableCell className="max-w-[350px] truncate">
                          {review.comment}
                        </TableCell>
                        <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveReview(review.id)}
                              className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectReview(review.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </RequireAdmin>
  );
};

export default AdminPage;
