import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { addReview } from "@/utils/reviewService";
import Rating from "./Rating";
import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";

const reviewFormSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(500, "Comment cannot exceed 500 characters"),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  platformId: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ platformId, onReviewSubmitted }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      userName: "",
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const newReview = await addReview({
        platformId,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
      });

      if (newReview) {
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!",
        });
        form.reset();
        setShowForm(false);
        if (onReviewSubmitted) onReviewSubmitted();
      } else {
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: "Unable to submit your review. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "An error occurred while submitting your review.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      {!showForm ? (
        <div className="text-center">
          <Button onClick={() => setShowForm(true)}>Write a Review</Button>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Rating 
                        value={field.value} 
                        onChange={field.onChange}
                        size="md"
                        interactive={true}
                      />
                    </FormControl>
                    <FormDescription>Select a rating from 1 to 5 stars</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your experience with this platform..." 
                        {...field} 
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Your review helps others make better decisions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
