
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { migrateDataToSupabase } from '@/utils/supabaseClient';
import { supabase } from '@/integrations/supabase/client';
import { Platform, Review } from '@/types/supabase';

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
      // Import data only when button is clicked to avoid SSR issues
      const { platforms: dummyPlatforms, reviews: dummyReviews } = await import('@/utils/dummyData');
      
      // Convert dummy data to the expected types
      const platforms: Platform[] = dummyPlatforms.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        logo: p.logo,
        url: p.website,  // Map website field to url
        tags: p.tags,
        features: p.features,
        pricing: p.pricing.hasPaid !== undefined 
          ? {
              hasFree: p.pricing.hasFree,
              freeDescription: p.pricing.startingPrice,
              paidPlans: p.pricing.hasPaid ? [{ 
                name: 'Basic', 
                price: p.pricing.startingPrice || '', 
                description: 'Basic plan' 
              }] : []
            }
          : p.pricing,
        rating: p.rating,
        reviewCount: p.reviewCount,
        apiAvailable: p.apiAvailable,
      }));
      
      const reviews: Review[] = dummyReviews.map(r => ({
        id: r.id,
        platformId: r.platformId,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        date: r.date,
        flagged: r.flagged
      }));
      
      const success = await migrateDataToSupabase(platforms, reviews);
      
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
