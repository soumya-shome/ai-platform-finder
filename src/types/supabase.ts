
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
