import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanGestureHandler,
  State,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
  backgroundColor?: string;
  showHandle?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  snapPoints = [0.25, 0.5, 0.9],
  initialSnap = 1,
  backgroundColor = '#FFFFFF',
  showHandle = true,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const gestureRef = useRef<PanGestureHandler>(null);
  const currentSnapIndex = useRef(initialSnap);

  const snapPointsPixels = snapPoints.map(point => SCREEN_HEIGHT * (1 - point));

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: snapPointsPixels[currentSnapIndex.current],
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    }
  }, [visible, snapPointsPixels, translateY]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY, velocityY } = event.nativeEvent;
      
      // Find the closest snap point
      let destSnapIndex = currentSnapIndex.current;
      const currentPosition = snapPointsPixels[currentSnapIndex.current] + translationY;
      
      if (Math.abs(velocityY) > 500) {
        // Fast swipe - go to next/previous snap point
        if (velocityY > 0 && currentSnapIndex.current < snapPoints.length - 1) {
          destSnapIndex = currentSnapIndex.current + 1;
        } else if (velocityY < 0 && currentSnapIndex.current > 0) {
          destSnapIndex = currentSnapIndex.current - 1;
        }
      } else {
        // Slow drag - find closest snap point
        let minDistance = Math.abs(currentPosition - snapPointsPixels[0]);
        destSnapIndex = 0;
        
        for (let i = 1; i < snapPointsPixels.length; i++) {
          const distance = Math.abs(currentPosition - snapPointsPixels[i]);
          if (distance < minDistance) {
            minDistance = distance;
            destSnapIndex = i;
          }
        }
      }

      // If trying to go below the lowest snap point, close the sheet
      if (destSnapIndex >= snapPoints.length || 
          (translationY > 100 && currentSnapIndex.current === snapPoints.length - 1)) {
        onClose();
        return;
      }

      currentSnapIndex.current = destSnapIndex;
      
      Animated.spring(translateY, {
        toValue: snapPointsPixels[destSnapIndex],
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
        velocity: velocityY,
      }).start();
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Sheet */}
      <PanGestureHandler
        ref={gestureRef}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor,
              paddingBottom: insets.bottom,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Handle */}
          {showHandle && (
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          )}

          {/* Header */}
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
    maxHeight: SCREEN_HEIGHT * 0.95,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});

// Filter Bottom Sheet Component for E-commerce
export const FilterBottomSheet: React.FC<{
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}> = ({ visible, onClose, onApplyFilters }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 10000]);
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [rating, setRating] = React.useState<number>(0);

  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'];
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony'];

  const handleApply = () => {
    const filters = {
      category: selectedCategory,
      priceRange,
      brands: selectedBrands,
      rating,
    };
    onApplyFilters(filters);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Filters"
      snapPoints={[0.7, 0.9]}
      initialSnap={0}
    >
      <View style={filterStyles.container}>
        {/* Categories */}
        <View style={filterStyles.section}>
          <Text style={filterStyles.sectionTitle}>Category</Text>
          <View style={filterStyles.chipContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  filterStyles.chip,
                  selectedCategory === category && filterStyles.chipSelected,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    filterStyles.chipText,
                    selectedCategory === category && filterStyles.chipTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Brands */}
        <View style={filterStyles.section}>
          <Text style={filterStyles.sectionTitle}>Brands</Text>
          <View style={filterStyles.chipContainer}>
            {brands.map((brand) => (
              <TouchableOpacity
                key={brand}
                style={[
                  filterStyles.chip,
                  selectedBrands.includes(brand) && filterStyles.chipSelected,
                ]}
                onPress={() => {
                  if (selectedBrands.includes(brand)) {
                    setSelectedBrands(selectedBrands.filter(b => b !== brand));
                  } else {
                    setSelectedBrands([...selectedBrands, brand]);
                  }
                }}
              >
                <Text
                  style={[
                    filterStyles.chipText,
                    selectedBrands.includes(brand) && filterStyles.chipTextSelected,
                  ]}
                >
                  {brand}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Apply Button */}
        <TouchableOpacity style={filterStyles.applyButton} onPress={handleApply}>
          <Text style={filterStyles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const filterStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  chipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
