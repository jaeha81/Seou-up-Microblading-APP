import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../../apps/mobile/src/theme/colors';
import { SkeletonCard } from '../../../../apps/mobile/src/components/SkeletonLoader';
import { getProviders, Provider } from '../api/providersApi';
import type { PluginScreenProps } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

export default function ProvidersScreen({ navigation }: PluginScreenProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      const data = await getProviders();
      setProviders(data.filter((p) => p.is_active));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Providers</Text>
        <Text style={styles.subtitle}>Certified microblading professionals near you</Text>
      </View>

      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={14} color={Colors.info} />
        <Text style={styles.disclaimerText}>
          Independently verify certifications before booking any procedure.
        </Text>
      </View>

      {loading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} lines={3} />)}
        </View>
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={Colors.primary} />
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('ProviderDetail', { providerId: item.id })}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="storefront-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.business_name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.locationText}>{item.city}, {item.country}</Text>
                </View>
                {item.description && (
                  <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="storefront-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Providers Yet</Text>
              <Text style={styles.emptyBody}>Be the first to register your clinic.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.md, paddingTop: Spacing.xxl, paddingBottom: Spacing.xs },
  title: { ...Typography.h2, color: Colors.textPrimary },
  subtitle: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 4 },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.info + '12',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  disclaimerText: { ...Typography.caption, color: Colors.info, flex: 1 },
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
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardName: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 4 },
  locationText: { ...Typography.caption, color: Colors.textMuted },
  cardDesc: { ...Typography.bodySmall, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.sm },
  emptyTitle: { ...Typography.h3, color: Colors.textSecondary },
  emptyBody: { ...Typography.bodySmall, color: Colors.textMuted },
});
