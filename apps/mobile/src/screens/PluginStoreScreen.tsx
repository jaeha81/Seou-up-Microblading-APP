import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Pressable, RefreshControl, ScrollView, SectionList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePluginManager } from '../core/plugins/PluginManager';
import { PluginCard } from '../components/PluginCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';
import type { PluginId, PluginCategory, PluginRegistryEntry } from '../core/plugins/PluginInterface';
import Constants from 'expo-constants';

const CATEGORY_LABELS: Record<PluginCategory, string> = {
  core: 'Core Features',
  business: 'Business Tools',
  community: 'Community',
  management: 'Management',
};

const CATEGORY_ORDER: PluginCategory[] = ['core', 'business', 'community', 'management'];

export default function PluginStoreScreen() {
  const {
    registry,
    registryLoading,
    registryError,
    fetchRegistry,
    enabledIds,
    enable,
    disable,
  } = usePluginManager();

  const [filter, setFilter] = useState<PluginCategory | 'all'>('all');

  useEffect(() => {
    const url = Constants.expoConfig?.extra?.pluginRegistryUrl as string;
    if (url) fetchRegistry(url);
  }, []);

  const handleToggle = useCallback(async (id: string, shouldEnable: boolean) => {
    if (shouldEnable) {
      await enable(id as PluginId);
    } else {
      await disable(id as PluginId);
    }
  }, [enable, disable]);

  const handleRefresh = useCallback(() => {
    const url = Constants.expoConfig?.extra?.pluginRegistryUrl as string;
    if (url) fetchRegistry(url, true);
  }, [fetchRegistry]);

  const grouped = useMemo(() => {
    const filtered = filter === 'all'
      ? registry
      : registry.filter((e) => e.category === filter);

    const groups: Record<string, PluginRegistryEntry[]> = {};
    filtered.forEach((entry) => {
      const cat = entry.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(entry);
    });

    return CATEGORY_ORDER
      .filter((cat) => groups[cat]?.length)
      .map((cat) => ({ title: CATEGORY_LABELS[cat], data: groups[cat] }));
  }, [registry, filter]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={registryLoading}
          onRefresh={handleRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Plugin Store</Text>
        <Text style={styles.subtitle}>Add features to your workflow</Text>
      </View>

      {registryError && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={16} color={Colors.warning} />
          <Text style={styles.errorText}>Could not reach registry. Showing cached data.</Text>
        </View>
      )}

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <Pressable
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </Pressable>
        {CATEGORY_ORDER.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.filterChip, filter === cat && styles.filterChipActive]}
            onPress={() => setFilter(cat)}
          >
            <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>
              {CATEGORY_LABELS[cat]}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {enabledIds.size} enabled / {registry.length} available
        </Text>
      </View>

      {registryLoading && registry.length === 0 ? (
        <View>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} lines={3} />)}
        </View>
      ) : registry.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cloud-offline-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No plugins available</Text>
          <Pressable style={styles.retryBtn} onPress={handleRefresh}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        grouped.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.map((entry) => (
              <PluginCard
                key={entry.id}
                entry={entry}
                enabled={enabledIds.has(entry.id as PluginId)}
                onToggle={handleToggle}
              />
            ))}
          </View>
        ))
      )}

      <View style={styles.footer}>
        <Ionicons name="logo-github" size={16} color={Colors.textMuted} />
        <Text style={styles.footerText}>Plugins are open source on GitHub</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingTop: Spacing.xxl, paddingBottom: Spacing.xl },
  header: { marginBottom: Spacing.md },
  title: { ...Typography.h2, color: Colors.textPrimary },
  subtitle: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 4 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.warning + '18',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  errorText: { ...Typography.bodySmall, color: Colors.warning, flex: 1 },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: { ...Typography.bodySmall, color: Colors.textSecondary },
  filterTextActive: { color: Colors.textInverse, fontWeight: '600' },
  statsBar: {
    marginBottom: Spacing.md,
  },
  statsText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'right',
  },
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  emptyText: { ...Typography.body, color: Colors.textMuted },
  retryBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
  },
  retryBtnText: { ...Typography.button, color: Colors.textSecondary },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  footerText: { ...Typography.caption, color: Colors.textMuted },
});
