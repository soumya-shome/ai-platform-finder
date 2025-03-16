
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { RequireAdmin } from '@/contexts/AdminContext';
import { Platform } from '@/types/supabase';
import { getPlatformById, updatePlatform } from '@/utils/platformService';
import PlatformEditor from '@/components/PlatformEditor';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const EditPlatform = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    const loadPlatform = async () => {
      try {
        if (!id) return;
        setIsLoading(true);
        const data = await getPlatformById(id);
        setPlatform(data);
      } catch (error) {
        console.error('Error loading platform:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load platform details",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPlatform();
  }, [id, toast]);

  const handleSave = async (updatedData: Platform) => {
    try {
      if (!id) return;
      const success = await updatePlatform(id, updatedData);
      if (success) {
        toast({
          title: "Platform updated",
          description: "The platform has been successfully updated",
        });
        navigate(`/platform/${id}`);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update platform",
        });
      }
    } catch (error) {
      console.error('Error updating platform:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while updating the platform",
      });
    }
  };

  return (
    <RequireAdmin>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Edit Platform</h1>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">Loading platform details...</div>
          ) : platform ? (
            <PlatformEditor platform={platform} onSave={handleSave} />
          ) : (
            <div className="p-8 text-center border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">Platform not found</p>
            </div>
          )}
        </div>
      </Layout>
    </RequireAdmin>
  );
};

export default EditPlatform;
