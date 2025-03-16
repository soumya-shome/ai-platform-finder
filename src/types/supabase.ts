export interface Platform {
  id: string;
  name: string;
  description: string;
  logo?: string;
  url: string;  // This is called url in Supabase but website in dummyData
  website?: string; // Adding this for compatibility with dummyData
  tags: string[];
  features: string[];
  pricing: {
    hasFree: boolean;
    freeDescription?: string;
    hasPaid?: boolean; // Adding this property
    startingPrice?: string; // Adding this property
    paidPlans?: {
      name: string;
      price: string;
      description: string;
    }[];
  };
  rating: number;
  reviewCount: number;
  apiAvailable: boolean;
  created_at?: string;
  // UI-specific fields
  shortDescription?: string;
}

export interface Review {
  id: string;
  platformId: string;
  userName: string;
  rating: number;
  comment?: string;
  date: string;
  flagged: boolean;
}

export interface SearchResult {
  platform: Platform;
  score: number;
}

// Type mappings for Supabase
export interface DbPlatform {
  id: string;
  name: string;
  description: string;
  logo?: string | null;
  url: string;
  tags: string[];
  features: string[];
  pricing: any;
  rating: number;
  reviewcount: number;
  apiavailable: boolean;
  created_at?: string | null;
}

export interface DbReview {
  id: string;
  platformid: string;
  username: string;
  rating: number;
  comment?: string | null;
  date?: string | null;
  flagged?: boolean | null;
}

// Conversion functions
export function convertDbPlatformToPlatform(dbPlatform: DbPlatform): Platform {
  return {
    id: dbPlatform.id,
    name: dbPlatform.name,
    description: dbPlatform.description,
    logo: dbPlatform.logo || undefined,
    url: dbPlatform.url,
    tags: dbPlatform.tags,
    features: dbPlatform.features,
    pricing: dbPlatform.pricing,
    rating: dbPlatform.rating,
    reviewCount: dbPlatform.reviewcount,
    apiAvailable: dbPlatform.apiavailable,
    created_at: dbPlatform.created_at
  };
}

export function convertPlatformToDbPlatform(platform: Platform): DbPlatform {
  return {
    id: platform.id,
    name: platform.name,
    description: platform.description,
    logo: platform.logo,
    url: platform.url || platform.website || '', // Handle both url and website fields
    tags: platform.tags,
    features: platform.features,
    pricing: platform.pricing,
    rating: platform.rating,
    reviewcount: platform.reviewCount,
    apiavailable: platform.apiAvailable,
    created_at: platform.created_at
  };
}

export function convertDbReviewToReview(dbReview: DbReview): Review {
  return {
    id: dbReview.id,
    platformId: dbReview.platformid,
    userName: dbReview.username,
    rating: dbReview.rating,
    comment: dbReview.comment || undefined,
    date: dbReview.date || new Date().toISOString(),
    flagged: dbReview.flagged || false
  };
}

export function convertReviewToDbReview(review: Review): DbReview {
  return {
    id: review.id,
    platformid: review.platformId,
    username: review.userName,
    rating: review.rating,
    comment: review.comment,
    date: review.date,
    flagged: review.flagged
  };
}

// Function to convert dummyData Platform to our Platform type
export function convertDummyPlatformToPlatform(dummyPlatform: any): Platform {
  return {
    id: dummyPlatform.id,
    name: dummyPlatform.name,
    description: dummyPlatform.description,
    logo: dummyPlatform.logo,
    url: dummyPlatform.website || '', // Map website to url
    website: dummyPlatform.website,
    tags: dummyPlatform.tags,
    features: dummyPlatform.features,
    pricing: dummyPlatform.pricing,
    rating: dummyPlatform.rating,
    reviewCount: dummyPlatform.reviewCount,
    apiAvailable: dummyPlatform.apiAvailable,
    shortDescription: dummyPlatform.shortDescription
  };
}

// Function to convert dummyData Review to our Review type
export function convertDummyReviewToReview(dummyReview: any): Review {
  return {
    id: dummyReview.id,
    platformId: dummyReview.platformId,
    userName: dummyReview.userName,
    rating: dummyReview.rating,
    comment: dummyReview.comment,
    date: dummyReview.date,
    flagged: dummyReview.flagged
  };
}
