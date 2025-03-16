
import React from 'react';
import { Link } from 'react-router-dom';
import { Platform } from '@/types/supabase';
import TagBadge from './TagBadge';
import Rating from './Rating';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { PlusCircle, Check } from 'lucide-react';
import { useCompare } from './PlatformCompare';

interface PlatformCardProps {
  platform: Platform;
  className?: string;
  compact?: boolean;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, className, compact = false }) => {
  const { addToCompare, isInCompare } = useCompare();
  const inCompareList = isInCompare(platform.id);
  
  return (
    <div className={cn(
      "group rounded-xl overflow-hidden border border-border bg-white dark:bg-gray-900 shadow-smooth",
      className
    )}>
      <Link to={`/platform/${platform.id}`} className="block p-6">
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
          {platform.description}
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
                  {platform.pricing.hasFree && platform.pricing.paidPlans && platform.pricing.paidPlans.length > 0 && " / "} 
                  {platform.pricing.paidPlans && platform.pricing.paidPlans.length > 0 && "Paid"}
                </span>
              </div>
            </div>
          </>
        )}
      </Link>
      
      <div className="px-6 pb-4">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full",
            inCompareList ? "text-green-600 border-green-600" : ""
          )}
          onClick={() => addToCompare(platform)}
        >
          {inCompareList ? (
            <>
              <Check className="mr-1 h-4 w-4" />
              Added to Compare
            </>
          ) : (
            <>
              <PlusCircle className="mr-1 h-4 w-4" />
              Add to Compare
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PlatformCard;
