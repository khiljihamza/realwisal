import React from 'react';
import { cn } from '@/utils/cn';

export interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = true,
  reviewCount,
  interactive = false,
  onRatingChange,
  className
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Stars */}
      <div 
        className="flex items-center gap-0.5"
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: maxRating }, (_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= displayRating;
          const isPartial = !isFilled && starRating - 0.5 <= displayRating;
          
          return (
            <button
              key={index}
              className={cn(
                'relative transition-transform',
                interactive && 'hover:scale-110 cursor-pointer',
                !interactive && 'cursor-default'
              )}
              onClick={() => handleStarClick(starRating)}
              onMouseEnter={() => handleStarHover(starRating)}
              disabled={!interactive}
              aria-label={`${starRating} star${starRating !== 1 ? 's' : ''}`}
            >
              {/* Background star */}
              <svg
                className={cn(
                  sizes[size],
                  'text-gray-200 fill-current'
                )}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              
              {/* Filled star */}
              {(isFilled || isPartial) && (
                <svg
                  className={cn(
                    sizes[size],
                    'absolute inset-0 text-yellow-400 fill-current',
                    isPartial && 'clip-path-half'
                  )}
                  style={isPartial ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Rating number and review count */}
      {showNumber && (
        <div className={cn('flex items-center gap-1', textSizes[size])}>
          <span className="font-medium text-gray-900">
            {rating.toFixed(1)}
          </span>
          {reviewCount !== undefined && (
            <span className="text-gray-500">
              ({reviewCount.toLocaleString()})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Compact rating for product cards
export const CompactRating: React.FC<{
  rating: number;
  reviewCount: number;
  className?: string;
}> = ({ rating, reviewCount, className }) => (
  <div className={cn('flex items-center gap-1 text-xs', className)}>
    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-600 text-white rounded">
      <span className="font-medium">{rating.toFixed(1)}</span>
      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
    <span className="text-gray-500">({reviewCount.toLocaleString()})</span>
  </div>
);

// Rating breakdown for product pages
export const RatingBreakdown: React.FC<{
  ratings: { [key: number]: number };
  totalReviews: number;
}> = ({ ratings, totalReviews }) => (
  <div className="space-y-2">
    {[5, 4, 3, 2, 1].map((star) => {
      const count = ratings[star] || 0;
      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
      
      return (
        <div key={star} className="flex items-center gap-2 text-sm">
          <span className="w-6 text-gray-600">{star}</span>
          <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="w-10 text-gray-500 text-right">{count}</span>
        </div>
      );
    })}
  </div>
);
