
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { RequireAdmin } from '@/contexts/AdminContext';
import { Review, Platform } from '@/types/supabase';
import { getFlaggedReviews, approveReview, rejectReview } from '@/utils/adminService';
import { getPlatforms, approvePlatform, deletePlatform } from '@/utils/platformService';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Pencil, 
  Database, 
  Trash2, 
  AlertTriangle
} from 'lucide-react';
import Rating from '@/components/Rating';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminPage = () => {
  const [flaggedReviews, setFlaggedReviews] = useState<(Review & { platformName?: string })[]>([]);
  const [allPlatforms, setAllPlatforms] = useState<Platform[]>([]);
  const [pendingPlatforms, setPendingPlatforms] = useState<Platform[]>([]);
  const [approvedPlatforms, setApprovedPlatforms] = useState<Platform[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(true);
  const [platformToDelete, setPlatformToDelete] = useState<Platform | null>(null);
  const { toast } = useToast();

  const loadFlaggedReviews = async () => {
    try {
      setIsLoadingReviews(true);
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
      setIsLoadingReviews(false);
    }
  };

  const loadPlatforms = async () => {
    try {
      setIsLoadingPlatforms(true);
      const data = await getPlatforms(true); // Include unapproved platforms
      setAllPlatforms(data);
      
      // Separate approved and pending platforms
      setPendingPlatforms(data.filter(p => !p.approved));
      setApprovedPlatforms(data.filter(p => p.approved));
    } catch (error) {
      console.error('Error loading platforms:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load platforms",
      });
    } finally {
      setIsLoadingPlatforms(false);
    }
  };

  useEffect(() => {
    loadFlaggedReviews();
    loadPlatforms();
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

  const handleApprovePlatform = async (platformId: string) => {
    try {
      const success = await approvePlatform(platformId);
      if (success) {
        toast({
          title: "Platform approved",
          description: "The platform has been approved and is now publicly visible.",
        });
        // Refresh all platforms to accurately reflect the updated approval state
        await loadPlatforms();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to approve the platform.",
        });
      }
    } catch (error) {
      console.error('Error approving platform:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while approving the platform.",
      });
    }
  };

  const handleDeletePlatform = async () => {
    if (!platformToDelete) return;
    
    try {
      const success = await deletePlatform(platformToDelete.id);
      if (success) {
        toast({
          title: "Platform deleted",
          description: `${platformToDelete.name} has been permanently deleted.`,
        });
        setPlatformToDelete(null);
        await loadPlatforms();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the platform.",
        });
      }
    } catch (error) {
      console.error('Error deleting platform:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while deleting the platform.",
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

          <Tabs defaultValue="pending" className="w-full mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">Pending Platforms</TabsTrigger>
              <TabsTrigger value="platforms">Approved Platforms</TabsTrigger>
              <TabsTrigger value="reviews">Flagged Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Pending Platforms</h2>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span className="text-muted-foreground">Platforms awaiting approval</span>
                </div>
              </div>
              
              {isLoadingPlatforms ? (
                <div className="p-8 text-center">Loading pending platforms...</div>
              ) : pendingPlatforms.length === 0 ? (
                <div className="p-8 text-center border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No pending platforms found</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableCaption>List of platforms waiting for approval</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>API</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingPlatforms.map((platform) => (
                        <TableRow key={platform.id}>
                          <TableCell className="font-medium">{platform.name}</TableCell>
                          <TableCell>
                            <a href={platform.url} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:underline truncate block max-w-[200px]">
                              {platform.url}
                            </a>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {platform.tags.join(', ')}
                          </TableCell>
                          <TableCell>
                            {platform.apiAvailable ? 'Yes' : 'No'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprovePlatform(platform.id)}
                                className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Link to={`/admin/edit-platform/${platform.id}`}>
                                <Button variant="outline" size="sm">
                                  <Pencil className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPlatformToDelete(platform)}
                                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="platforms">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Approved Platforms</h2>
                <Link to="/submit">
                  <Button>
                    <Database className="h-4 w-4 mr-2" />
                    Add New Platform
                  </Button>
                </Link>
              </div>
              
              {isLoadingPlatforms ? (
                <div className="p-8 text-center">Loading platforms...</div>
              ) : approvedPlatforms.length === 0 ? (
                <div className="p-8 text-center border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No approved platforms found</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableCaption>List of all approved platforms in the database</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Reviews</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>API</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedPlatforms.map((platform) => (
                        <TableRow key={platform.id}>
                          <TableCell className="font-medium">{platform.name}</TableCell>
                          <TableCell>
                            <Rating value={platform.rating} />
                          </TableCell>
                          <TableCell>{platform.reviewCount}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {platform.tags.join(', ')}
                          </TableCell>
                          <TableCell>
                            {platform.apiAvailable ? 'Yes' : 'No'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link to={`/admin/edit-platform/${platform.id}`}>
                                <Button variant="outline" size="sm">
                                  <Pencil className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPlatformToDelete(platform)}
                                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reviews">
              <h2 className="text-2xl font-semibold mb-4">Flagged Reviews</h2>
              
              {isLoadingReviews ? (
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
            </TabsContent>
          </Tabs>
        </div>
      </Layout>

      {/* Delete Platform Confirmation Dialog */}
      <AlertDialog open={!!platformToDelete} onOpenChange={(open) => !open && setPlatformToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this platform?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {platformToDelete?.name} and all its associated reviews. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePlatform}
              className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RequireAdmin>
  );
};

export default AdminPage;
