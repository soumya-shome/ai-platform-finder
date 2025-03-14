
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tag: string;
  className?: string;
  interactive?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  className,
  interactive = true,
  selected = false,
  onSelect
}) => {
  const getTagColor = (tag: string) => {
    // Create a deterministic color based on the tag name
    const hash = tag.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const tagColors = [
      'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'bg-green-100 text-green-800 hover:bg-green-200',
      'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'bg-amber-100 text-amber-800 hover:bg-amber-200',
      'bg-teal-100 text-teal-800 hover:bg-teal-200',
      'bg-rose-100 text-rose-800 hover:bg-rose-200',
      'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
      'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
    ];
    
    return tagColors[Math.abs(hash) % tagColors.length];
  };

  if (interactive) {
    if (onSelect) {
      // Clickable tag with custom handler
      return (
        <button
          onClick={onSelect}
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
            selected 
              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
              : getTagColor(tag),
            className
          )}
        >
          {tag}
        </button>
      );
    } else {
      // Link tag (for filtering)
      return (
        <Link
          to={`/directory?tag=${encodeURIComponent(tag)}`}
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
            getTagColor(tag),
            className
          )}
        >
          {tag}
        </Link>
      );
    }
  }

  // Non-interactive tag
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        getTagColor(tag).split(' ').filter(c => !c.includes('hover:')).join(' '),
        className
      )}
    >
      {tag}
    </span>
  );
};

export default TagBadge;
