
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Platform } from '@/types/supabase';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { X, GitCompare } from 'lucide-react';

interface PlatformCompareProps {
  onAddPlatform?: (platform: Platform) => void;
}

// Create a context for comparison functionality
export const CompareContext = React.createContext<{
  compareList: Platform[];
  addToCompare: (platform: Platform) => void;
  removeFromCompare: (platformId: string) => void;
  clearCompare: () => void;
  isInCompare: (platformId: string) => boolean;
}>({
  compareList: [],
  addToCompare: () => {},
  removeFromCompare: () => {},
  clearCompare: () => {},
  isInCompare: () => false,
});

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Platform[]>([]);

  // Try to load from localStorage on component mount
  useEffect(() => {
    try {
      const savedCompare = localStorage.getItem('compareList');
      if (savedCompare) {
        setCompareList(JSON.parse(savedCompare));
      }
    } catch (error) {
      console.error('Error loading compare list from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever the compare list changes
  useEffect(() => {
    try {
      localStorage.setItem('compareList', JSON.stringify(compareList));
    } catch (error) {
      console.error('Error saving compare list to localStorage:', error);
    }
  }, [compareList]);

  const addToCompare = (platform: Platform) => {
    setCompareList(prev => {
      if (prev.some(p => p.id === platform.id)) {
        return prev.filter(p => p.id !== platform.id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), platform];
      }
      return [...prev, platform];
    });
  };

  const removeFromCompare = (platformId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== platformId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (platformId: string) => {
    return compareList.some(p => p.id === platformId);
  };

  return (
    <CompareContext.Provider value={{ 
      compareList, 
      addToCompare, 
      removeFromCompare, 
      clearCompare,
      isInCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => React.useContext(CompareContext);

// The actual compare drawer component
const PlatformCompare: React.FC<PlatformCompareProps> = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  
  const handleCompare = () => {
    if (compareList.length < 2) return;
    
    const queryParams = new URLSearchParams();
    compareList.forEach(platform => {
      queryParams.append('id', platform.id);
    });
    
    navigate(`/compare?${queryParams.toString()}`);
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-6 right-6 z-50 shadow-lg flex items-center gap-2"
          disabled={compareList.length === 0}
        >
          <GitCompare className="h-4 w-4" />
          Compare ({compareList.length})
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Compare Platforms ({compareList.length}/4)</SheetTitle>
        </SheetHeader>
        
        {compareList.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Add platforms to compare them
          </div>
        ) : (
          <div className="py-4 space-y-3">
            {compareList.map(platform => (
              <div 
                key={platform.id} 
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md overflow-hidden border flex items-center justify-center bg-white">
                    <img 
                      src={platform.logo} 
                      alt={platform.name} 
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{platform.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {platform.tags.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeFromCompare(platform.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <SheetFooter className="mt-6">
          <div className="flex w-full space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={clearCompare}
              disabled={compareList.length === 0}
            >
              Clear All
            </Button>
            <SheetClose asChild>
              <Button 
                className="flex-1"
                disabled={compareList.length < 2}
                onClick={handleCompare}
              >
                Compare
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PlatformCompare;
