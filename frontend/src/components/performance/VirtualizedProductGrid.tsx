import React, { useState, useCallback, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInView } from 'react-intersection-observer';
import { Product } from '@/types';
import { ProductCard, ProductCardSkeleton } from '@/design-system/components/ProductCard';
import { cn } from '@/utils/cn';

interface VirtualizedProductGridProps {
  products: Product[];
  loading?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onWishlistToggle?: (product: Product) => void;
  className?: string;
}

const ITEM_HEIGHT = 400; // Height of product card
const ITEM_WIDTH = 280; // Width of product card
const GAP = 16; // Gap between items

export const VirtualizedProductGrid: React.FC<VirtualizedProductGridProps> = ({
  products,
  loading = false,
  hasNextPage = false,
  onLoadMore,
  onProductClick,
  onAddToCart,
  onWishlistToggle,
  className
}) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate columns based on container width
  const columnCount = useMemo(() => {
    if (containerWidth === 0) return 1;
    return Math.floor((containerWidth + GAP) / (ITEM_WIDTH + GAP));
  }, [containerWidth]);

  // Calculate row count
  const rowCount = Math.ceil(products.length / columnCount);

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Load more when scrolled to bottom
  React.useEffect(() => {
    if (inView && hasNextPage && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasNextPage, onLoadMore]);

  // Handle container resize
  const handleContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setContainerRef(node);
      
      const updateWidth = () => {
        setContainerWidth(node.clientWidth);
      };
      
      updateWidth();
      
      const resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(node);
      
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Grid item renderer
  const GridItem = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const productIndex = rowIndex * columnCount + columnIndex;
    const product = products[productIndex];

    if (!product) {
      return <div style={style} />;
    }

    return (
      <div
        style={{
          ...style,
          padding: GAP / 2,
        }}
      >
        <ProductCard
          product={product}
          onAddToCart={onAddToCart}
          onWishlistToggle={onWishlistToggle}
          onClick={() => onProductClick?.(product)}
          className="h-full cursor-pointer"
        />
      </div>
    );
  }, [products, columnCount, onAddToCart, onWishlistToggle, onProductClick]);

  // Alternative implementation using react-virtual for better performance
  const AlternativeVirtualGrid: React.FC = () => {
    const parentRef = React.useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
      count: products.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => ITEM_HEIGHT + GAP,
      overscan: 5,
    });

    const items = virtualizer.getVirtualItems();

    return (
      <div
        ref={parentRef}
        className="h-full overflow-auto"
        style={{ contain: 'strict' }}
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
            }}
          >
            {items.map((virtualRow) => {
              const startIndex = virtualRow.index * columnCount;
              const endIndex = Math.min(startIndex + columnCount, products.length);
              const rowProducts = products.slice(startIndex, endIndex);

              return (
                <React.Fragment key={virtualRow.index}>
                  {rowProducts.map((product, colIndex) => (
                    <div
                      key={product._id}
                      style={{
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={onAddToCart}
                        onWishlistToggle={onWishlistToggle}
                        onClick={() => onProductClick?.(product)}
                        className="cursor-pointer"
                      />
                    </div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (containerWidth === 0) {
    return (
      <div
        ref={handleContainerRef}
        className={cn('w-full h-64', className)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={handleContainerRef}
      className={cn('w-full', className)}
    >
      {/* Main Grid */}
      <Grid
        columnCount={columnCount}
        columnWidth={ITEM_WIDTH + GAP}
        height={Math.min(600, rowCount * (ITEM_HEIGHT + GAP))}
        rowCount={rowCount}
        rowHeight={ITEM_HEIGHT + GAP}
        width={containerWidth}
        style={{ overflowX: 'hidden' }}
      >
        {GridItem}
      </Grid>

      {/* Loading More Indicator */}
      {(loading || hasNextPage) && (
        <div
          ref={loadMoreRef}
          className="flex justify-center items-center py-8"
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500">Scroll to load more...</div>
          )}
        </div>
      )}
    </div>
  );
};

// Optimized Product List for Mobile
export const MobileProductList: React.FC<{
  products: Product[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
}> = ({ products, loading, onLoadMore, hasNextPage }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Compact mobile card height
    overscan: 10,
  });

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView && hasNextPage && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasNextPage, onLoadMore]);

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const product = products[virtualItem.index];
          
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ProductCard
                product={product}
                variant="compact"
                className="h-full"
              />
            </div>
          );
        })}
      </div>

      {/* Load more trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {loading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          )}
        </div>
      )}
    </div>
  );
};

// Performance monitoring hook
export const useProductGridPerformance = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    scrollFPS: 0,
    memoryUsage: 0,
  });

  React.useEffect(() => {
    // Monitor performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          setMetrics(prev => ({
            ...prev,
            renderTime: entry.duration,
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, []);

  const measureRender = useCallback((name: string, fn: () => void) => {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }, []);

  return { metrics, measureRender };
};
