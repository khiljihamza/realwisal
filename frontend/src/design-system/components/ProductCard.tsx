import React from 'react';
import { Badge, DiscountBadge, StockBadge, FreeShippingBadge } from './Badge';
import { CompactRating } from './RatingStars';
import { FiHeart, FiShoppingCart, FiEye, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  showWishlist?: boolean;
  showQuickView?: boolean;
  onAddToCart?: (product: Product) => void;
  onWishlistToggle?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  showWishlist = true,
  showQuickView = true,
  onAddToCart,
  onWishlistToggle,
  onQuickView,
  className
}) => {
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false);

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
    : 0;

  const finalPrice = product.discountPrice || product.originalPrice;
  const hasDiscount = product.discountPrice && product.discountPrice < product.originalPrice;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onWishlistToggle?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  if (variant === 'compact') {
    return (
      <div className={cn('group cursor-pointer', className)}>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {/* Image */}
          <img
            src={product.images[0]?.url}
            alt={product.name}
            className={cn(
              'w-full h-full object-cover transition-all duration-300 group-hover:scale-105',
              !isImageLoaded && 'opacity-0'
            )}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Image skeleton */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && <DiscountBadge percentage={discountPercentage} />}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="warning" size="sm">Low Stock</Badge>
            )}
          </div>

          {/* Wishlist */}
          {showWishlist && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <svg
                className={cn(
                  'w-4 h-4 transition-colors',
                  isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                ₹{finalPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {product.ratings > 0 && (
            <CompactRating rating={product.ratings} reviewCount={product.reviews.length} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200',
        variant === 'featured' && 'shadow-md',
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Main Image */}
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className={cn(
            'w-full h-full object-cover transition-all duration-500 group-hover:scale-110',
            !isImageLoaded && 'opacity-0'
          )}
          onLoad={() => setIsImageLoaded(true)}
        />

        {/* Image Skeleton */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && <DiscountBadge percentage={discountPercentage} />}
          <StockBadge stock={product.stock} />
          {finalPrice >= 500 && <FreeShippingBadge />}
        </div>

        {/* Wishlist Button */}
        {showWishlist && (
          <button
            onClick={handleWishlistToggle}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200',
              isWishlisted 
                ? 'bg-red-50 text-red-600 border-2 border-red-200' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-600'
            )}
          >
            <svg
              className={cn('w-5 h-5', isWishlisted && 'fill-current')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}

        {/* Hover Actions */}
        <div className={cn(
          'absolute inset-x-3 bottom-3 transform transition-all duration-300',
          showActions ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        )}>
          <div className="flex gap-2">
            {showQuickView && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleQuickView}
                className="flex-1 backdrop-blur-sm bg-white/90 border-white/50"
              >
                Quick View
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 backdrop-blur-sm"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand/Shop */}
        {product.shop && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              {product.shop.name}
            </span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.ratings > 0 && (
          <div className="flex items-center justify-between">
            <CompactRating rating={product.ratings} reviewCount={product.reviews.length} />
            {product.sold_out > 100 && (
              <Badge variant="secondary" size="sm">
                {product.sold_out}+ sold
              </Badge>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{finalPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {hasDiscount && (
              <div className="text-xs text-green-600 font-medium">
                You save ₹{(product.originalPrice - finalPrice).toLocaleString()}
              </div>
            )}
          </div>

          {/* Mobile Add to Cart */}
          <div className="md:hidden">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="px-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Card Skeleton for loading states
export const ProductCardSkeleton: React.FC<{ variant?: 'default' | 'compact' }> = ({ 
  variant = 'default' 
}) => {
  if (variant === 'compact') {
    return (
      <div className="animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-lg" />
        <div className="mt-3 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="h-6 bg-gray-200 rounded w-20" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
};
