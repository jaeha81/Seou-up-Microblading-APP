import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';

export function OfflineBanner() {
  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={14} color={Colors.textInverse} />
      <Text style={styles.text}>No internet connection. Using cached data.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.textMuted,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
  },
  text: {
    ...Typography.caption,
    color: Colors.textInverse,
  },
});
