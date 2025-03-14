
export interface Platform {
  id: string;
  name: string;
  description: string;
  logo?: string;
  url: string;
  tags: string[];
  features: string[];
  pricing: {
    hasFree: boolean;
    freeDescription?: string;
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
    url: platform.url,
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
    comment: dbReview.comment,
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
