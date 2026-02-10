import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import {colors, spacing, borderRadius, typography} from '../theme/colors';

interface SegmentedControlProps {
  options: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedValue,
  onValueChange,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const segmentWidth = containerWidth > 0 ? containerWidth / options.length : 0;

  useEffect(() => {
    const selectedIndex = options.findIndex(opt => opt.value === selectedValue);
    Animated.spring(slideAnim, {
      toValue: selectedIndex * segmentWidth,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [selectedValue, segmentWidth, options, slideAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Optional: Add haptic feedback here
      },
      onPanResponderMove: (evt, gestureState) => {
        const currentIndex = options.findIndex(
          opt => opt.value === selectedValue,
        );
        const newPosition = currentIndex * segmentWidth + gestureState.dx;
        const clampedPosition = Math.max(
          0,
          Math.min(newPosition, segmentWidth * (options.length - 1)),
        );
        slideAnim.setValue(clampedPosition);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const currentIndex = options.findIndex(
          opt => opt.value === selectedValue,
        );
        const threshold = segmentWidth * 0.3; // 30% of segment width to trigger change

        let newIndex = currentIndex;
        if (Math.abs(gestureState.dx) > threshold) {
          if (gestureState.dx > 0 && currentIndex < options.length - 1) {
            newIndex = currentIndex + 1;
          } else if (gestureState.dx < 0 && currentIndex > 0) {
            newIndex = currentIndex - 1;
          }
        }

        Animated.spring(slideAnim, {
          toValue: newIndex * segmentWidth,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();

        if (newIndex !== currentIndex) {
          onValueChange(options[newIndex].value);
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <View
        style={styles.segmentsContainer}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          if (width > 0 && width !== containerWidth) {
            setContainerWidth(width);
            const selectedIndex = options.findIndex(
              opt => opt.value === selectedValue,
            );
            slideAnim.setValue(selectedIndex * (width / options.length));
          }
        }}
        {...panResponder.panHandlers}>
        {containerWidth > 0 && (
          <Animated.View
            style={[
              styles.slider,
              {
                width: segmentWidth - spacing.xs,
                transform: [{translateX: slideAnim}],
              },
            ]}
          />
        )}
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[styles.segment, containerWidth > 0 && styles.segmentFlex]}
            onPress={() => onValueChange(option.value)}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.segmentLabel,
                selectedValue === option.value && styles.segmentLabelActive,
              ]}>
              {option.label}
            </Text>
            {option.description && (
              <Text
                style={[
                  styles.segmentDescription,
                  selectedValue === option.value &&
                    styles.segmentDescriptionActive,
                ]}>
                {option.description}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  segmentsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.xs / 2,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  slider: {
    position: 'absolute',
    height: '90%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    top: spacing.xs / 2,
    left: spacing.xs / 2,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  segment: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  segmentFlex: {
    flex: 1,
  },
  segmentLabel: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs / 2,
  },
  segmentLabelActive: {
    color: colors.background,
  },
  segmentDescription: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    fontSize: 10,
  },
  segmentDescriptionActive: {
    color: colors.background,
    opacity: 0.9,
  },
});

export default SegmentedControl;
