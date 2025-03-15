
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { addNewPlatform } from "@/utils/supabaseClient";

// Define form validation schema
const platformFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(30, "Description must be at least 30 characters").max(1000, "Description cannot exceed 1000 characters"),
  logo: z.string().url("Please provide a valid URL").optional().or(z.literal('')),
  url: z.string().url("Please provide a valid URL"),
  tags: z.string().min(3, "Please provide at least one tag"),
  features: z.string().min(5, "Please provide at least one feature"),
  apiAvailable: z.boolean().default(false),
  pricing: z.object({
    hasFree: z.boolean().default(false),
    freeDescription: z.string().optional(),
    hasPaid: z.boolean().default(false),
    startingPrice: z.string().optional(),
  }),
});

type PlatformFormValues = z.infer<typeof platformFormSchema>;

const PlatformSubmissionForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<PlatformFormValues>({
    resolver: zodResolver(platformFormSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: "",
      url: "",
      tags: "",
      features: "",
      apiAvailable: false,
      pricing: {
        hasFree: false,
        freeDescription: "",
        hasPaid: false,
        startingPrice: "",
      },
    },
  });

  const onSubmit = async (data: PlatformFormValues) => {
    setIsSubmitting(true);
    try {
      // Format tags and features as arrays
      const tagsArray = data.tags.split(',').map(tag => tag.trim());
      const featuresArray = data.features.split('\n').filter(feature => feature.trim() !== '');
      
      // Create pricing object
      const pricing = {
        hasFree: data.pricing.hasFree,
        hasPaid: data.pricing.hasPaid,
        freeDescription: data.pricing.freeDescription || "",
        startingPrice: data.pricing.startingPrice || null,
        paidPlans: [],
      };

      const newPlatform = await addNewPlatform({
        name: data.name,
        description: data.description,
        logo: data.logo || undefined,
        url: data.url,
        tags: tagsArray,
        features: featuresArray,
        apiAvailable: data.apiAvailable,
        pricing
      });

      if (newPlatform) {
        toast({
          title: "Platform submitted",
          description: "Thank you for your contribution!",
        });
        form.reset();
        navigate('/directory');
      } else {
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: "Unable to submit the platform. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting platform:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "An error occurred while submitting the platform.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchHasFree = form.watch("pricing.hasFree");
  const watchHasPaid = form.watch("pricing.hasPaid");

  return (
    <div className="max-w-3xl mx-auto p-6 bg-card rounded-lg border border-border">
      <h2 className="text-2xl font-bold mb-6">Submit a New AI Platform</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter platform name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormDescription>Provide a URL to the platform's logo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the platform in detail..." 
                    {...field} 
                    className="min-h-[150px]"
                  />
                </FormControl>
                <FormDescription>Provide a comprehensive description of the platform</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="productivity, automation, writing" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated tags that describe the platform</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>API Available</FormLabel>
                    <FormDescription>Does this platform offer an API?</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Features</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="List key features, one per line" 
                    {...field} 
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormDescription>Enter each feature on a new line</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-lg font-medium">Pricing Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricing.hasFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Free Tier Available</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pricing.hasPaid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Paid Plans Available</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {watchHasFree && (
              <FormField
                control={form.control}
                name="pricing.freeDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Free Tier Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the free tier limitations and features..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {watchHasPaid && (
              <FormField
                control={form.control}
                name="pricing.startingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Price</FormLabel>
                    <FormControl>
                      <Input placeholder="$9.99/month" {...field} />
                    </FormControl>
                    <FormDescription>Enter the starting price for paid plans</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/directory')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Platform"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PlatformSubmissionForm;
