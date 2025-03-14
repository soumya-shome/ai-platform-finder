import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PlatformDetail from '@/components/PlatformDetail';
import ReviewSection from '@/components/ReviewSection';
import PlatformCard from '@/components/PlatformCard';
import { Platform, Review } from '@/types/supabase';
import { getPlatformById, getReviewsByPlatformId, getPlatforms } from '@/utils/supabaseClient';

const PlatformPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarPlatforms, setSimilarPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!id) {
      navigate('/directory');
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch platform details
        const platformData = await getPlatformById(id);
        if (!platformData) {
          navigate('/directory');
          return;
        }
        
        // Add the missing properties needed for PlatformDetail component 
        const enhancedPlatform = {
          ...platformData,
          shortDescription: platformData.description.slice(0, 120) + '...',
          website: platformData.url
        } as Platform & { shortDescription: string; website: string };
        
        setPlatform(enhancedPlatform);
        
        // Fetch reviews for this platform
        const reviewsData = await getReviewsByPlatformId(id);
        setReviews(reviewsData);
        
        // Get similar platforms (based on tags)
        const allPlatforms = await getPlatforms();
        const filtered = allPlatforms
          .filter(p => p.id !== id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(p => ({
            ...p,
            shortDescription: p.description.slice(0, 120) + '...',
            website: p.url
          })) as (Platform & { shortDescription: string; website: string })[];
        
        setSimilarPlatforms(filtered);
      } catch (error) {
        console.error('Error fetching platform data:', error);
        navigate('/directory');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="h-20 w-20 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
              
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!platform) {
    navigate('/directory');
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <a
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            Back to results
          </a>
          
          <PlatformDetail platform={platform as any} />
        </div>
        
        <div className="my-12">
          <ReviewSection reviews={reviews as any} platformId={platform.id} />
        </div>
        
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6">Similar Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarPlatforms.map((platform) => (
              <PlatformCard key={platform.id} platform={platform as any} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlatformPage;
