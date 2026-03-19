import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../../apps/mobile/src/theme/colors';
import { SkeletonCard } from '../../../../apps/mobile/src/components/SkeletonLoader';
import { getGuides, GuideArticle } from '../api/guideApi';
import type { PluginScreenProps } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

type Category = 'all' | 'startup' | 'technique' | 'marketing';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'startup', label: 'Startup' },
  { value: 'technique', label: 'Technique' },
  { value: 'marketing', label: 'Marketing' },
];

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  startup: 'rocket-outline',
  technique: 'cut-outline',
  marketing: 'megaphone-outline',
};

export default function GuideListScreen({ navigation }: PluginScreenProps) {
  const [articles, setArticles] = useState<GuideArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Category>('all');

  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      const data = await getGuides();
      setArticles(data.filter((a) => a.is_published));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? articles : articles.filter((a) => a.category === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Startup Guide</Text>
        <Text style={styles.subtitle}>Everything you need to launch your microblading business</Text>
      </View>

      <View style={styles.filters}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.value}
            style={[styles.filterPill, filter === cat.value && styles.filterPillActive]}
            onPress={() => setFilter(cat.value)}
          >
            <Text style={[styles.filterLabel, filter === cat.value && styles.filterLabelActive]}>
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} lines={3} />)}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={Colors.primary} />}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => navigation.navigate('GuideDetail', { slug: item.slug })}>
              <View style={styles.cardIcon}>
                <Ionicons
                  name={CATEGORY_ICONS[item.category] ?? 'document-outline'}
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>{item.category}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title_en}</Text>
                <Text style={styles.cardPreview} numberOfLines={2}>
                  {item.body_en.slice(0, 120)}...
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No articles in this category</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.md, paddingTop: Spacing.xxl, paddingBottom: Spacing.sm },
  title: { ...Typography.h2, color: Colors.textPrimary },
  subtitle: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 4 },
  filters: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterLabel: { ...Typography.bodySmall, color: Colors.textSecondary },
  filterLabelActive: { color: Colors.textInverse, fontWeight: '600' },
  skeletonContainer: { padding: Spacing.md },
  list: { padding: Spacing.md, paddingTop: 0 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1 },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  cardBadgeText: { ...Typography.caption, color: Colors.textSecondary, textTransform: 'capitalize' },
  cardTitle: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  cardPreview: { ...Typography.bodySmall, color: Colors.textSecondary },
  empty: { padding: Spacing.xl, alignItems: 'center' },
  emptyText: { ...Typography.body, color: Colors.textMuted },
});
