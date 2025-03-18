
import { supabase } from '@/integrations/supabase/client';
import { 
  Platform, 
  convertDbPlatformToPlatform,
  convertPlatformToDbPlatform
} from '@/types/supabase';
import { getReviewsByPlatformId } from './reviewService';

// Platform-related database operations
export const getPlatforms = async (includeUnapproved = false): Promise<Platform[]> => {
  let query = supabase
    .from('platforms')
    .select('*');
  
  // Only include approved platforms unless specifically requested
  if (!includeUnapproved) {
    query = query.eq('approved', true);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching platforms:', error);
    throw error;
  }
  
  const platforms = data ? data.map(convertDbPlatformToPlatform) : [];
  
  // Update each platform with accurate review data
  const updatedPlatforms = await Promise.all(
    platforms.map(async (platform) => {
      const reviewData = await calculatePlatformReviewData(platform.id);
      return {
        ...platform,
        rating: reviewData.averageRating,
        reviewCount: reviewData.reviewCount
      };
    })
  );
  
  return updatedPlatforms;
};

export const getPlatformsByIds = async (ids: string[]): Promise<Platform[]> => {
  if (ids.length === 0) return [];

  // Fetch platforms from Supabase
  const { data, error } = await supabase
    .from("platforms")
    .select("*")
    .in("id", ids)
    .eq('approved', true);

  if (error) {
    console.error("Error fetching platforms:", error);
    return [];
  }

  // Convert data from DB format to frontend format
  const platforms = data.map(convertDbPlatformToPlatform);

  return platforms;
};

export const getPlatformById = async (id: string): Promise<Platform | null> => {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching platform with id ${id}:`, error);
    return null;
  }
  
  if (!data) return null;
  
  const platform = convertDbPlatformToPlatform(data);
  
  // Update with accurate review data
  const reviewData = await calculatePlatformReviewData(id);
  return {
    ...platform,
    rating: reviewData.averageRating,
    reviewCount: reviewData.reviewCount
  };
};

export const getPlatformsByTag = async (tag: string): Promise<Platform[]> => {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .contains('tags', [tag])
    .eq('approved', true);
  
  if (error) {
    console.error(`Error fetching platforms with tag ${tag}:`, error);
    return [];
  }
  
  const platforms = data ? data.map(convertDbPlatformToPlatform) : [];
  
  // Update each platform with accurate review data
  const updatedPlatforms = await Promise.all(
    platforms.map(async (platform) => {
      const reviewData = await calculatePlatformReviewData(platform.id);
      return {
        ...platform,
        rating: reviewData.averageRating,
        reviewCount: reviewData.reviewCount
      };
    })
  );
  
  return updatedPlatforms;
};

export const getAllTags = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('platforms')
    .select('tags');
  
  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
  
  const tagsSet = new Set<string>();
  data?.forEach(platform => {
    platform.tags.forEach((tag: string) => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet);
};

export const getPredefinedTags = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('predefined_tags')
    .select('name')
    .order('name');
  
  if (error) {
    console.error('Error fetching predefined tags:', error);
    return [];
  }
  
  return data ? data.map(tag => tag.name) : [];
};

export const addNewPlatform = async (platformData: Omit<Platform, 'id' | 'rating' | 'reviewCount'>): Promise<Platform | null> => {
  const newPlatform = {
    name: platformData.name,
    description: platformData.description,
    logo: platformData.logo || null,
    url: platformData.url,
    tags: platformData.tags,
    features: platformData.features,
    pricing: platformData.pricing,
    rating: 0,
    reviewcount: 0,
    apiavailable: platformData.apiAvailable,
    approved: false // New platforms start as unapproved
  };
  
  const { data, error } = await supabase
    .from('platforms')
    .insert(newPlatform)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding platform:', error);
    return null;
  }
  
  return data ? convertDbPlatformToPlatform(data) : null;
};

// Function to update a platform
export const updatePlatform = async (id: string, platformData: Platform): Promise<boolean> => {
  const dbPlatform = convertPlatformToDbPlatform({
    ...platformData,
    id // Ensure we're using the correct ID
  });
  
  // Remove fields that shouldn't be updated directly
  delete dbPlatform.created_at;
  delete dbPlatform.rating;
  delete dbPlatform.reviewcount;
  
  const { error } = await supabase
    .from('platforms')
    .update(dbPlatform)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating platform:', error);
    return false;
  }
  
  return true;
};

// Function to approve a platform
export const approvePlatform = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('platforms')
    .update({ approved: true })
    .eq('id', id);
  
  if (error) {
    console.error('Error approving platform:', error);
    return false;
  }
  
  return true;
};

// Function to delete a platform
export const deletePlatform = async (id: string): Promise<boolean> => {
  const { data, error } = await supabase
    .rpc('delete_platform', {
      platform_id: id
    });
  
  if (error) {
    console.error('Error deleting platform:', error);
    return false;
  }
  
  return data === true;
};

// Helper function to calculate platform rating and review count from reviews
export const calculatePlatformReviewData = async (platformId: string): Promise<{ averageRating: number; reviewCount: number }> => {
  const reviews = await getReviewsByPlatformId(platformId);
  
  if (reviews.length === 0) {
    return { averageRating: 0, reviewCount: 0 };
  }
  
  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  return {
    averageRating: Number(averageRating.toFixed(1)),
    reviewCount: reviews.length
  };
};

// Export for searchPlatformsDatabase from searchUtils
export { searchPlatformsDatabase } from './searchUtils';
