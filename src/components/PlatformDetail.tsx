
import React from 'react';
import { Platform } from '@/utils/dummyData';
import TagBadge from './TagBadge';
import Rating from './Rating';

interface PlatformDetailProps {
  platform: Platform;
}

const PlatformDetail: React.FC<PlatformDetailProps> = ({ platform }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border border-border bg-white dark:bg-gray-800 flex items-center justify-center">
          <img
            src={platform.logo}
            alt={`${platform.name} logo`}
            className="h-12 w-12 object-contain"
          />
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{platform.name}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              <Rating value={platform.rating} size="md" />
              <span className="ml-2 text-muted-foreground">
                ({platform.reviewCount} reviews)
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {platform.pricing.hasFree && "Free"}
              {platform.pricing.hasFree && platform.pricing.hasPaid && " / "}
              {platform.pricing.hasPaid && `Paid ${platform.pricing.startingPrice ? `(from ${platform.pricing.startingPrice})` : ''}`}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <a
            href={platform.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
          >
            Visit Website
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7"></path>
              <path d="M7 7h10v10"></path>
            </svg>
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            Compare
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="21 8 21 21 3 21 3 8"></polyline>
              <rect x="1" y="3" width="22" height="5"></rect>
              <line x1="10" y1="12" x2="14" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {platform.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-xl font-semibold">About {platform.name}</h2>
            <p>{platform.description}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Key Features</h2>
            <ul className="space-y-2">
              {platform.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary mr-2 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="rounded-xl border border-border overflow-hidden bg-white dark:bg-gray-900">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-medium">Specifications</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">API Access</div>
                <div className="flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full mr-2 ${platform.apiAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>{platform.apiAvailable ? 'Available' : 'Not Available'}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Pricing Model</div>
                <div className="flex flex-wrap gap-2">
                  {platform.pricing.hasFree && (
                    <span className="px-2 py-1 rounded-md text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Free Tier
                    </span>
                  )}
                  {platform.pricing.hasPaid && (
                    <span className="px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      Paid Options
                    </span>
                  )}
                </div>
                {platform.pricing.startingPrice && (
                  <div className="mt-2 text-sm">
                    Starting from <span className="font-medium">{platform.pricing.startingPrice}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformDetail;
