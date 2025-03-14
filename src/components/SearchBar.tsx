
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  initialQuery?: string;
  autofocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Describe what you're looking for...",
  onSearch,
  size = 'md',
  className,
  initialQuery = '',
  autofocus = false
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autofocus]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/directory?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg',
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full max-w-3xl relative transition-all duration-300",
        className
      )}
    >
      <div
        className={cn(
          "relative flex items-center w-full overflow-hidden rounded-xl border border-input bg-background transition-all duration-300",
          isFocused ? "ring-2 ring-primary/20 border-primary/50" : "",
          sizeClasses[size]
        )}
      >
        <input
          ref={inputRef}
          type="text"
          className={cn(
            "flex-1 px-4 py-2 bg-transparent focus:outline-none",
            sizeClasses[size]
          )}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {query && (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground p-2"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 h-full flex items-center justify-center transition-colors"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
      <div className="mt-2 text-sm text-muted-foreground text-center">
        Try: "free image generation api" or "language model for business"
      </div>
    </form>
  );
};

export default SearchBar;
