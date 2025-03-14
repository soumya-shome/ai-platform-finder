export interface Platform {
  id: string;
  name: string;
  logo: string;
  description: string;
  shortDescription: string;
  features: string[];
  tags: string[];
  pricing: {
    hasFree: boolean;
    hasPaid: boolean;
    startingPrice?: string;
  };
  apiAvailable: boolean;
  website: string;
  rating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  platformId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  flagged: boolean;
}

export const platforms: Platform[] = [
  {
    id: "openai",
    name: "OpenAI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1280px-OpenAI_Logo.svg.png",
    description: "OpenAI is an AI research and deployment company. Their mission is to ensure that artificial general intelligence benefits all of humanity. They provide various models like GPT-4 and DALL-E through their platform.",
    shortDescription: "Cutting-edge language and image models for developers and businesses",
    features: [
      "Natural language processing",
      "Image generation",
      "Text completion",
      "Code generation",
      "Fine-tuning capabilities"
    ],
    tags: ["Language Models", "Image Generation", "API", "Enterprise", "GPT"],
    pricing: {
      hasFree: true,
      hasPaid: true,
      startingPrice: "$0.0005 / 1K tokens"
    },
    apiAvailable: true,
    website: "https://openai.com",
    rating: 4.8,
    reviewCount: 354
  },
  {
    id: "anthropic",
    name: "Anthropic",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Anthropic_logo.svg/1280px-Anthropic_logo.svg.png",
    description: "Anthropic is an AI safety company that develops reliable, interpretable, and steerable AI systems. They're the creators of Claude, an AI assistant designed to be helpful, harmless, and honest.",
    shortDescription: "Creators of Claude, focused on AI safety and human values alignment",
    features: [
      "Conversational AI",
      "Document analysis",
      "Content generation",
      "Summarization",
      "Constitutional AI approach"
    ],
    tags: ["Language Models", "Safety", "API", "Enterprise", "Claude"],
    pricing: {
      hasFree: true,
      hasPaid: true,
      startingPrice: "$0.0003 / 1K tokens"
    },
    apiAvailable: true,
    website: "https://anthropic.com",
    rating: 4.7,
    reviewCount: 236
  },
  {
    id: "stability-ai",
    name: "Stability AI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Stability_AI_logo.svg/1024px-Stability_AI_logo.svg.png",
    description: "Stability AI is focused on open-source generative AI development. They're the creators of Stable Diffusion, one of the most popular image generation models available.",
    shortDescription: "Open-source generative AI focused on image and video generation",
    features: [
      "Image generation",
      "Image editing",
      "Style transfer",
      "Inpainting",
      "Open-source model releases"
    ],
    tags: ["Image Generation", "Video Generation", "Open Source", "API", "Stable Diffusion"],
    pricing: {
      hasFree: true,
      hasPaid: true,
      startingPrice: "$0.002 / image"
    },
    apiAvailable: true,
    website: "https://stability.ai",
    rating: 4.5,
    reviewCount: 187
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    logo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
    description: "Hugging Face is an AI community and platform that provides tools for building, training and deploying ML models. They host thousands of pre-trained models and datasets for NLP, computer vision, and more.",
    shortDescription: "Community-driven AI platform with thousands of open-source models",
    features: [
      "Model hosting",
      "Model training",
      "Dataset hosting",
      "Collaborative development",
      "Spaces for demos"
    ],
    tags: ["Open Source", "Community", "NLP", "Computer Vision", "Model Repository"],
    pricing: {
      hasFree: true,
      hasPaid: true,
      startingPrice: "$9/month"
    },
    apiAvailable: true,
    website: "https://huggingface.co",
    rating: 4.9,
    reviewCount: 421
  },
  {
    id: "midjourney",
    name: "Midjourney",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Midjourney_Emblem.png/800px-Midjourney_Emblem.png",
    description: "Midjourney is an independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species. Their eponymous tool generates images from natural language descriptions.",
    shortDescription: "Discord-based AI image generation with stunning artistic quality",
    features: [
      "Text-to-image generation",
      "Style customization",
      "High resolution outputs",
      "Community features",
      "Discord integration"
    ],
    tags: ["Image Generation", "Discord", "Art", "Creative"],
    pricing: {
      hasFree: false,
      hasPaid: true,
      startingPrice: "$10/month"
    },
    apiAvailable: false,
    website: "https://midjourney.com",
    rating: 4.6,
    reviewCount: 329
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    logo: "https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/l4epqkj4xbrrgra3jzus",
    description: "Perplexity AI offers an AI-powered answer engine that provides relevant information through a conversational interface. It combines web search with large language models to deliver accurate, up-to-date responses.",
    shortDescription: "AI search engine that provides conversational, cited answers",
    features: [
      "Web search integration",
      "Cited sources",
      "Conversational interface",
      "Real-time information",
      "Follow-up questions"
    ],
    tags: ["Search", "Information Retrieval", "Conversational", "Research"],
    pricing: {
      hasFree: true,
      hasPaid: true,
      startingPrice: "$20/month"
    },
    apiAvailable: true,
    website: "https://perplexity.ai",
    rating: 4.4,
    reviewCount: 156
  },
  {
    id: "replicate",
    name: "Replicate",
    logo: "https://replicate.com/static/favicon.2fde5ee2e85f.png",
    description: "Replicate is a platform that lets you run machine learning models with a cloud API. They host thousands of open-source models for tasks like image generation, audio processing, and text analysis.",
    shortDescription: "Run open-source machine learning models with a simple API",
    features: [
      "Model API hosting",
      "Pay-per-use pricing",
      "Model deployment",
      "Version control for models",
      "Web interface for testing"
    ],
    tags: ["API", "Model Hosting", "MLOps", "Open Source"],
    pricing: {
      hasFree: true,
      hasPaid: true,
      startingPrice: "$0.001 / second"
    },
    apiAvailable: true,
    website: "https://replicate.com",
    rating: 4.5,
    reviewCount: 89
  },
  {
    id: "pinecone",
    name: "Pinecone",
    logo: "https://app.pinecone.io/images/favicon-192.png",
    description: "Pinecone is a vector database that makes it simple to build high-performance vector search applications. It's designed for machine learning applications and similarity search at scale.",
    shortDescription: "Managed vector database for AI and ML applications",
    features: [
      "Vector similarity search",
      "Real-time updates",
      "Horizontal scaling",
      "Hybrid search",
      "Cross-region replication"
    ],
    tags: ["Vector Database", "Infrastructure", "Embeddings", "Search"],
    pricing: {
      hasFree: true,
      hasPaid: true,
      startingPrice: "$0.096 / hour"
    },
    apiAvailable: true,
    website: "https://pinecone.io",
    rating: 4.3,
    reviewCount: 67
  }
];

export const reviews: Review[] = [
  {
    id: "r1",
    platformId: "openai",
    userName: "DevMaster",
    rating: 5,
    comment: "GPT-4 has been a game-changer for my business. The API is reliable and the documentation is excellent.",
    date: "2023-12-15",
    flagged: false
  },
  {
    id: "r2",
    platformId: "openai",
    userName: "AIResearcher",
    rating: 4,
    comment: "Great capabilities but pricing can get steep for large-scale applications.",
    date: "2023-11-20",
    flagged: false
  },
  {
    id: "r3",
    platformId: "anthropic",
    userName: "SafetyFirst",
    rating: 5,
    comment: "Claude is the most aligned and safe AI assistant I've used. Excellent for content that needs nuance.",
    date: "2023-12-03",
    flagged: false
  },
  {
    id: "r4",
    platformId: "stability-ai",
    userName: "DigitalArtist",
    rating: 4,
    comment: "Stable Diffusion is incredible, but I wish the UI was more intuitive for non-technical users.",
    date: "2023-10-29",
    flagged: false
  },
  {
    id: "r5",
    platformId: "huggingface",
    userName: "MLEngineer",
    rating: 5,
    comment: "The community aspect of Hugging Face is unmatched. So many great models and datasets available for free.",
    date: "2023-11-15",
    flagged: false
  }
];

export const popularTags = [
  "Language Models",
  "Image Generation",
  "API",
  "Open Source",
  "Enterprise",
  "Computer Vision",
  "Search",
  "Infrastructure",
  "NLP",
  "Vector Database",
  "Embeddings",
  "Video Generation",
  "Text-to-Speech",
  "Speech-to-Text"
];

const calculateRelevanceScore = (platform: Platform, searchQuery: string): number => {
  if (!searchQuery.trim()) return 0;
  
  const query = searchQuery.toLowerCase();
  const words = query.split(/\s+/);
  let score = 0;

  // Check name match
  if (platform.name.toLowerCase().includes(query)) {
    score += 10;
  }

  // Check description match
  if (platform.description.toLowerCase().includes(query)) {
    score += 5;
  }

  // Check tag matches
  platform.tags.forEach(tag => {
    if (tag.toLowerCase().includes(query)) {
      score += 8;
    }
    
    // Check if any word in the query matches the tag
    words.forEach(word => {
      if (tag.toLowerCase().includes(word) && word.length > 2) {
        score += 3;
      }
    });
  });

  // Check feature matches
  platform.features.forEach(feature => {
    if (feature.toLowerCase().includes(query)) {
      score += 6;
    }
    
    // Check if any word in the query matches the feature
    words.forEach(word => {
      if (feature.toLowerCase().includes(word) && word.length > 2) {
        score += 2;
      }
    });
  });

  return score;
};

export const searchPlatforms = (platforms: Platform[], query: string): Platform[] => {
  if (!query.trim()) return platforms;

  const results = platforms.map(platform => ({
    platform,
    score: calculateRelevanceScore(platform, query)
  }));

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);

  // Filter out very low relevance results
  const filteredResults = results.filter(result => result.score > 0);

  // Return just the platforms in ranked order
  return filteredResults.map(result => result.platform);
};

export const getAllTags = (): string[] => {
  const tagsSet = new Set<string>();
  platforms.forEach(platform => {
    platform.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet);
};

export const filterPlatformsByTag = (tag: string): Platform[] => {
  return platforms.filter(platform => platform.tags.includes(tag));
};

export const getPlatformById = (id: string): Platform | undefined => {
  return platforms.find(platform => platform.id === id);
};

export const getReviewsByPlatformId = (platformId: string): Review[] => {
  return reviews.filter(review => review.platformId === platformId);
};
