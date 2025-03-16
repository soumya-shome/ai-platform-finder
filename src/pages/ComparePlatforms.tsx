
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Platform } from '@/types/supabase';
import { getPlatformById } from '@/utils/platformService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Rating from '@/components/Rating';
import TagBadge from '@/components/TagBadge';

const ComparePlatforms = () => {
  const [searchParams] = useSearchParams();
  const ids = searchParams.getAll('id');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        setIsLoading(true);
        
        if (ids.length === 0) {
          setPlatforms([]);
          setIsLoading(false);
          return;
        }
        
        const platformsData = await Promise.all(
          ids.map(async (id) => {
            try {
              return await getPlatformById(id);
            } catch (error) {
              console.error(`Error fetching platform with id ${id}:`, error);
              return null;
            }
          })
        );
        
        // Filter out null values
        const validPlatforms = platformsData.filter(p => p !== null) as Platform[];
        setPlatforms(validPlatforms);
      } catch (error) {
        console.error('Error loading platforms for comparison:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load platforms for comparison",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlatforms();
  }, [ids, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-8">Platform Comparison</h1>
          <div className="p-8">Loading platforms for comparison...</div>
        </div>
      </Layout>
    );
  }

  if (platforms.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Platform Comparison</h1>
          <div className="p-8 text-center border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-4">No platforms selected for comparison</p>
            <Link to="/directory">
              <Button>Browse Platforms</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Platform Comparison</h1>
        
        <div className="grid grid-cols-1 overflow-x-auto">
          {/* Platform headers */}
          <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-6">
            <div className="font-semibold">Platform</div>
            {platforms.map(platform => (
              <div key={platform.id} className="text-center">
                <div className="flex flex-col items-center mb-2">
                  <div className="h-12 w-12 rounded-md overflow-hidden border flex items-center justify-center bg-white mb-2">
                    <img
                      src={platform.logo}
                      alt={`${platform.name} logo`}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <Link to={`/platform/${platform.id}`} className="font-semibold hover:text-primary transition-colors">
                    {platform.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="mb-6" />
          
          {/* Basic info */}
          <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-4">
            <div className="font-semibold">Rating</div>
            {platforms.map(platform => (
              <div key={`${platform.id}-rating`} className="text-center">
                <div className="flex justify-center">
                  <Rating value={platform.rating} />
                </div>
                <div className="text-sm text-muted-foreground">
                  ({platform.reviewCount} reviews)
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-4">
            <div className="font-semibold">Tags</div>
            {platforms.map(platform => (
              <div key={`${platform.id}-tags`} className="flex flex-wrap justify-center gap-1">
                {platform.tags.slice(0, 3).map(tag => (
                  <TagBadge key={tag} tag={tag} interactive={false} />
                ))}
                {platform.tags.length > 3 && (
                  <span className="text-sm text-muted-foreground">+{platform.tags.length - 3}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-4">
            <div className="font-semibold">API Available</div>
            {platforms.map(platform => (
              <div key={`${platform.id}-api`} className="text-center">
                {platform.apiAvailable ? (
                  <span className="text-green-600">Yes</span>
                ) : (
                  <span className="text-muted-foreground">No</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-4">
            <div className="font-semibold">Pricing</div>
            {platforms.map(platform => (
              <div key={`${platform.id}-pricing`} className="text-center">
                <div>
                  {platform.pricing.hasFree && "Free Tier"}
                  {platform.pricing.hasFree && platform.pricing.paidPlans && platform.pricing.paidPlans.length > 0 && " / "}
                  {platform.pricing.paidPlans && platform.pricing.paidPlans.length > 0 && "Paid Plans"}
                </div>
                {platform.pricing.paidPlans && platform.pricing.paidPlans.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    From {platform.pricing.paidPlans[0].price}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <Separator className="my-6" />
          
          {/* Features */}
          <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-6">
            <div className="font-semibold">Features</div>
            {platforms.map(platform => (
              <div key={`${platform.id}-features`} className="text-center">
                <ul className="list-disc text-left pl-6 space-y-1">
                  {platform.features.map((feature, idx) => (
                    <li key={idx} className="text-sm">{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <Separator className="my-6" />
          
          {/* Description */}
          <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))] gap-4">
            <div className="font-semibold">Description</div>
            {platforms.map(platform => (
              <div key={`${platform.id}-desc`} className="text-sm">
                {platform.description}
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link to="/directory">
              <Button variant="outline">Back to Directory</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComparePlatforms;
