import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '../theme/colors';

type SkeletonBoxProps = {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function SkeletonBox({ width, height, borderRadius = BorderRadius.sm, style }: SkeletonBoxProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <Animated.View
      style={[styles.base, { width: width as number, height, borderRadius, opacity }, style]}
    />
  );
}

type SkeletonCardProps = {
  lines?: number;
  style?: ViewStyle;
};

export function SkeletonCard({ lines = 3, style }: SkeletonCardProps) {
  return (
    <View style={[styles.card, style]}>
      <SkeletonBox width="60%" height={18} borderRadius={BorderRadius.sm} style={styles.mb12} />
      {Array.from({ length: lines - 1 }, (_, i) => (
        <SkeletonBox
          key={i}
          width={i === lines - 2 ? '45%' : '100%'}
          height={13}
          borderRadius={BorderRadius.sm}
          style={styles.mb8}
        />
      ))}
    </View>
  );
}

export function SkeletonGrid({ count = 6, columns = 2 }: { count?: number; columns?: number }) {
  const itemWidth = `${Math.floor(100 / columns) - 2}%` as const;
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonBox key={i} width={itemWidth} height={80} borderRadius={BorderRadius.md} style={styles.gridItem} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.skeletonBase,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: 16,
    marginBottom: 12,
  },
  mb12: { marginBottom: 12 },
  mb8: { marginBottom: 8 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    margin: 4,
  },
});
