
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { migrateDataToSupabase } from '@/utils/supabaseClient';
import { supabase } from '@/integrations/supabase/client';
import { Platform, Review } from '@/types/supabase';

// Sample data to initialize the database with
const samplePlatforms: Platform[] = [
  {
    id: "openai",
    name: "OpenAI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1280px-OpenAI_Logo.svg.png",
    description: "OpenAI is an AI research and deployment company. Their mission is to ensure that artificial general intelligence benefits all of humanity. They provide various models like GPT-4 and DALL-E through their platform.",
    shortDescription: "Cutting-edge language and image models for developers and businesses",
    features: [
      "Natural language processing",
      "Image generation",
      "Text completion",
      "Code generation",
      "Fine-tuning capabilities"
    ],
    tags: ["Language Models", "Image Generation", "API", "Enterprise", "GPT"],
    pricing: {
      hasFree: true,
      paidPlans: [
        {
          name: "Pay as you go",
          price: "$0.0005 / 1K tokens",
          description: "Pay only for what you use"
        }
      ]
    },
    apiAvailable: true,
    url: "https://openai.com",
    rating: 4.8,
    reviewCount: 0
  },
  {
    id: "anthropic",
    name: "Anthropic",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Anthropic_logo.svg/1280px-Anthropic_logo.svg.png",
    description: "Anthropic is an AI safety company that develops reliable, interpretable, and steerable AI systems. They're the creators of Claude, an AI assistant designed to be helpful, harmless, and honest.",
    shortDescription: "Creators of Claude, focused on AI safety and human values alignment",
    features: [
      "Conversational AI",
      "Document analysis",
      "Content generation",
      "Summarization",
      "Constitutional AI approach"
    ],
    tags: ["Language Models", "Safety", "API", "Enterprise", "Claude"],
    pricing: {
      hasFree: true,
      paidPlans: [
        {
          name: "Pay as you go",
          price: "$0.0003 / 1K tokens",
          description: "Pay only for what you use"
        }
      ]
    },
    apiAvailable: true,
    url: "https://anthropic.com",
    rating: 4.7,
    reviewCount: 0
  }
];

const sampleReviews: Review[] = [
  {
    id: "r1",
    platformId: "openai",
    userName: "DevMaster",
    rating: 5,
    comment: "GPT-4 has been a game-changer for my business. The API is reliable and the documentation is excellent.",
    date: "2023-12-15",
    flagged: false
  },
  {
    id: "r2",
    platformId: "anthropic",
    userName: "SafetyFirst",
    rating: 5,
    comment: "Claude is the most aligned and safe AI assistant I've used. Excellent for content that needs nuance.",
    date: "2023-12-03",
    flagged: false
  }
];

const DatabaseInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if database has been initialized
    const checkInitialization = async () => {
      try {
        const { count, error } = await supabase
          .from('platforms')
          .select('*', { count: 'exact', head: true });
        
        if (!error && count && count > 0) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error checking database initialization:', error);
      }
    };
    
    checkInitialization();
  }, []);

  const handleInitializeDatabase = async () => {
    setIsInitializing(true);
    
    try {
      const success = await migrateDataToSupabase(samplePlatforms, sampleReviews);
      
      if (success) {
        setIsInitialized(true);
        toast({
          title: "Database initialized",
          description: "Sample data has been migrated to the database",
        });
      } else {
        toast({
          title: "Initialization failed",
          description: "Failed to migrate data to the database",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      toast({
        title: "Initialization error",
        description: "An error occurred while initializing the database",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  if (isInitialized) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-primary/90 text-primary-foreground rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="font-medium mb-2">Database Setup</h3>
      <p className="text-sm mb-3">
        Initialize the database with sample AI platform data
      </p>
      <Button 
        onClick={handleInitializeDatabase}
        disabled={isInitializing}
        className="w-full bg-white text-primary hover:bg-white/90"
      >
        {isInitializing ? "Initializing..." : "Initialize Database"}
      </Button>
    </div>
  );
};

export default DatabaseInitializer;
