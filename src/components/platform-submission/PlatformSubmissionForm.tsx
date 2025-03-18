
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { addNewPlatform, getPredefinedTags } from "@/utils/platformService";
import { platformFormSchema, type PlatformFormValues } from "./schema";
import BasicInfoFields from "./BasicInfoFields";
import TagsFields from "./TagsFields";
import FeaturesFields from "./FeaturesFields";
import PricingFields from "./PricingFields";
import FormActions from "./FormActions";

const PlatformSubmissionForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [predefinedTags, setPredefinedTags] = React.useState<string[]>([]);

  useEffect(() => {
    const loadTags = async () => {
      const tags = await getPredefinedTags();
      setPredefinedTags(tags);
    };
    
    loadTags();
  }, []);

  const form = useForm<PlatformFormValues>({
    resolver: zodResolver(platformFormSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: "",
      url: "",
      tags: [],
      customTags: "",
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
      // Combine selected tags and custom tags
      const selectedTags = [...data.tags];
      if (data.customTags) {
        const customTagsArray = data.customTags.split(',').map(tag => tag.trim()).filter(tag => tag);
        selectedTags.push(...customTagsArray);
      }
      
      // Format features as arrays
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
        tags: selectedTags,
        features: featuresArray,
        apiAvailable: data.apiAvailable,
        pricing
      });

      if (newPlatform) {
        toast({
          title: "Platform submitted",
          description: "Thank you for your contribution! Your submission will be reviewed by an admin before appearing in the directory.",
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-card rounded-lg border border-border">
      <h2 className="text-2xl font-bold mb-6">Submit a New AI Platform</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoFields form={form} />
          <TagsFields form={form} predefinedTags={predefinedTags} />
          <FeaturesFields form={form} />
          <PricingFields form={form} />
          <FormActions isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

export default PlatformSubmissionForm;
