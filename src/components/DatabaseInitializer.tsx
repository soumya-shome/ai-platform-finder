
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { migrateDataToSupabase } from '@/utils/supabaseClient';
import { platforms, reviews } from '@/utils/dummyData';

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
