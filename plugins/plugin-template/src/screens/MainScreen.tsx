/**
 * Plugin Main Screen Template
 *
 * This is the entry point screen for your plugin.
 * Follow these optimization guidelines:
 * - Use SkeletonCard/SkeletonBox while loading
 * - Use useCallback for event handlers
 * - Use FlatList with keyExtractor for lists
 * - Cache API responses via the plugin API service
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../../apps/mobile/src/theme/colors';
import { SkeletonCard } from '../../../../apps/mobile/src/components/SkeletonLoader';
import type { PluginScreenProps } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

export default function MainScreen({ navigation }: PluginScreenProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data async
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>My Plugin</Text>
      <Text style={styles.subtitle}>Plugin description here</Text>

      {loading ? (
        <View>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.card}>
            <Ionicons name="checkmark-circle-outline" size={24} color={Colors.success} />
            <Text style={styles.cardText}>Plugin is working!</Text>
          </View>
          <Text style={styles.hint}>
            Edit this screen in plugins/plugin-yourname/src/screens/MainScreen.tsx
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingTop: Spacing.xxl, paddingBottom: Spacing.xl },
  title: { ...Typography.h2, color: Colors.textPrimary },
  subtitle: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.xl },
  content: { gap: Spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardText: { ...Typography.body, color: Colors.textPrimary },
  hint: { ...Typography.bodySmall, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center' },
});
