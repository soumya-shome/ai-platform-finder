
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { RequireAdmin } from '@/contexts/AdminContext';
import { Platform } from '@/types/supabase';
import { getPlatformById, updatePlatform, approvePlatform } from '@/utils/platformService';
import PlatformEditor from '@/components/PlatformEditor';
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleApprove = async () => {
    try {
      if (!id || !platform) return;
      const success = await approvePlatform(id);
      
      if (success) {
        setPlatform({
          ...platform,
          approved: true
        });
        
        toast({
          title: "Platform approved",
          description: "The platform has been approved and is now visible in the directory.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to approve platform",
        });
      }
    } catch (error) {
      console.error('Error approving platform:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while approving the platform",
      });
    }
  };

  return (
    <RequireAdmin>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Edit Platform</h1>
            </div>
            
            {platform && !platform.approved && (
              <Button 
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Platform
              </Button>
            )}
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
