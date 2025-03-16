
import React from 'react';
import { Link } from 'react-router-dom';
import { Platform } from '@/types/supabase';
import { Button } from './ui/button';
import Rating from './Rating';
import TagBadge from './TagBadge';
import { ExternalLink, PlusCircle, Check } from 'lucide-react';
import { useCompare } from './PlatformCompare';
import { cn } from '@/lib/utils';

interface PlatformListItemProps {
  platform: Platform;
  className?: string;
}

const PlatformListItem: React.FC<PlatformListItemProps> = ({ platform, className }) => {
  const { addToCompare, isInCompare } = useCompare();
  const inCompareList = isInCompare(platform.id);
  
  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex-shrink-0 flex items-center sm:items-start">
        <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden border border-border bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
          <img
            src={platform.logo}
            alt={`${platform.name} logo`}
            className="h-8 w-8 object-contain"
          />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <Link to={`/platform/${platform.id}`} className="group">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {platform.name}
          </h3>
        </Link>
        
        <div className="flex items-center mt-1 mb-2">
          <Rating value={platform.rating} />
          <span className="ml-2 text-sm text-muted-foreground">
            ({platform.reviewCount})
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {platform.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {platform.tags.slice(0, 5).map((tag) => (
            <TagBadge key={tag} tag={tag} interactive={false} />
          ))}
          {platform.tags.length > 5 && (
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-muted-foreground bg-muted">
              +{platform.tags.length - 5}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm">
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
      </div>
      
      <div className="flex sm:flex-col justify-between gap-2 ml-auto">
        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-muted hover:bg-muted/80 h-9 px-4 py-2"
        >
          Visit
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
        
        <Button
          variant="outline"
          className={inCompareList ? "text-green-600 border-green-600" : ""}
          onClick={() => addToCompare(platform)}
        >
          {inCompareList ? (
            <>
              <Check className="mr-1 h-4 w-4" />
              Added
            </>
          ) : (
            <>
              <PlusCircle className="mr-1 h-4 w-4" />
              Compare
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PlatformListItem;
