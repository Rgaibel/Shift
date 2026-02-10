import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {colors, spacing, borderRadius} from '../theme/colors';

interface SwipeableCardsProps {
  children: React.ReactNode[];
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
}

const SwipeableCards: React.FC<SwipeableCardsProps> = ({
  children,
  onIndexChange,
  initialIndex = 0,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [containerWidth, setContainerWidth] = useState(0);
  const cardWidth = containerWidth;

  useEffect(() => {
    if (scrollViewRef.current && containerWidth > 0) {
      scrollViewRef.current.scrollTo({
        x: initialIndex * cardWidth,
        animated: false,
      });
      setCurrentIndex(initialIndex);
    }
  }, [containerWidth, initialIndex, cardWidth]);

  useEffect(() => {
    if (scrollViewRef.current && containerWidth > 0) {
      scrollViewRef.current.scrollTo({
        x: currentIndex * cardWidth,
        animated: true,
      });
    }
  }, [currentIndex, cardWidth, containerWidth]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (cardWidth === 0) {
      return;
    }
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / cardWidth);
    if (index !== currentIndex && index >= 0 && index < children.length) {
      setCurrentIndex(index);
      onIndexChange?.(index);
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (cardWidth === 0) {
      return;
    }
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / cardWidth);
    if (index >= 0 && index < children.length) {
      setCurrentIndex(index);
      onIndexChange?.(index);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.scrollContainer}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          if (width > 0 && width !== containerWidth) {
            setContainerWidth(width);
          }
        }}>
        {containerWidth > 0 && (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={cardWidth}
            snapToAlignment="start"
            contentContainerStyle={styles.scrollContent}>
            {children.map((child, index) => (
              <View key={index} style={[styles.card, {width: cardWidth}]}>
                {child}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.indicatorContainer}>
        {children.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.indicatorActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  scrollContainer: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
  },
  card: {
    paddingHorizontal: spacing.xs,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
    backgroundColor: colors.borderLight,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
});

export default SwipeableCards;
