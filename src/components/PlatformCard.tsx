
import React from 'react';
import { Link } from 'react-router-dom';
import { Platform } from '@/utils/dummyData';
import TagBadge from './TagBadge';
import Rating from './Rating';
import { cn } from '@/lib/utils';

interface PlatformCardProps {
  platform: Platform;
  className?: string;
  compact?: boolean;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, className, compact = false }) => {
  return (
    <Link
      to={`/platform/${platform.id}`}
      className={cn(
        "group block rounded-xl overflow-hidden border border-border bg-white dark:bg-gray-900 shadow-smooth",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden border border-border bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <img
              src={platform.logo}
              alt={`${platform.name} logo`}
              className="h-8 w-8 object-contain"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
              {platform.name}
            </h3>
            <div className="flex items-center mt-1">
              <Rating value={platform.rating} />
              <span className="ml-2 text-sm text-muted-foreground">
                ({platform.reviewCount})
              </span>
            </div>
          </div>
        </div>
        
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {platform.shortDescription}
        </p>
        
        {!compact && (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {platform.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag} tag={tag} interactive={false} />
              ))}
              {platform.tags.length > 3 && (
                <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-muted-foreground bg-muted">
                  +{platform.tags.length - 3}
                </span>
              )}
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm">
              <div className="flex items-center">
                <span className={cn(
                  "inline-block w-2 h-2 rounded-full mr-2",
                  platform.apiAvailable ? "bg-green-500" : "bg-gray-300"
                )}></span>
                <span className={platform.apiAvailable ? "text-green-700 dark:text-green-300" : "text-muted-foreground"}>
                  {platform.apiAvailable ? "API Available" : "No API"}
                </span>
              </div>
              
              <div>
                <span className="text-muted-foreground">
                  {platform.pricing.hasFree && "Free"} 
                  {platform.pricing.hasFree && platform.pricing.hasPaid && " / "} 
                  {platform.pricing.hasPaid && "Paid"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

export default PlatformCard;
