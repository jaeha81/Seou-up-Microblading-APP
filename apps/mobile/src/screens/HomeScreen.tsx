import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAuth } from '../core/auth/AuthContext';
import { usePluginRegistry } from '../core/plugins/PluginRegistry';
import { usePluginStore } from '../core/plugins/PluginStore';
import { CacheService } from '../core/cache/CacheService';
import { apiClient } from '../core/api/client';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';
import { MainTabParamList } from '../navigation/AppNavigator';

type Props = { navigation: BottomTabNavigationProp<MainTabParamList, 'Home'> };

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { enabledPlugins } = usePluginRegistry();
  const { fetchRegistry } = usePluginStore();

  useEffect(() => {
    fetchRegistry();
    CacheService.prefetch(
      'eyebrow-styles',
      () => apiClient.get('/api/eyebrow-styles'),
      CacheService.TTL.LONG,
    );
    CacheService.prefetch(
      'guides',
      () => apiClient.get('/api/guides'),
      CacheService.TTL.MEDIUM,
    );
  }, []);

  const greeting = user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>What would you like to do?</Text>
        </View>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role ?? '—'}</Text>
        </View>
      </View>

      {enabledPlugins.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Features</Text>
          <View style={styles.grid}>
            {enabledPlugins.map((plugin) => (
              <Pressable
                key={plugin.manifest.id}
                style={styles.featureCard}
                onPress={() => navigation.navigate(plugin.manifest.id)}
              >
                <View style={styles.featureIcon}>
                  <Ionicons
                    name={plugin.manifest.iconName as keyof typeof Ionicons.glyphMap}
                    size={26}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.featureName}>{plugin.manifest.displayName}</Text>
                <Text style={styles.featureDesc} numberOfLines={2}>{plugin.manifest.description}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="extensions-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No Features Active</Text>
          <Text style={styles.emptyBody}>Enable plugins from the Plugin Store to get started.</Text>
          <Pressable style={styles.ctaButton} onPress={() => navigation.navigate('PluginStore')}>
            <Text style={styles.ctaButtonText}>Open Plugin Store</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickRow}>
          <Pressable style={styles.quickCard} onPress={() => navigation.navigate('PluginStore')}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.quickLabel}>Add Plugins</Text>
          </Pressable>
          <Pressable style={styles.quickCard} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="person-outline" size={20} color={Colors.primary} />
            <Text style={styles.quickLabel}>Profile</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingTop: Spacing.xxl, paddingBottom: Spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  greeting: { ...Typography.h2, color: Colors.textPrimary },
  subtitle: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
  roleBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  roleText: { ...Typography.caption, color: Colors.primaryDark, fontWeight: '700', textTransform: 'capitalize' },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  featureCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight + '44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  featureName: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  featureDesc: { ...Typography.bodySmall, color: Colors.textSecondary },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  emptyTitle: { ...Typography.h3, color: Colors.textSecondary, marginTop: Spacing.md, marginBottom: Spacing.sm },
  emptyBody: { ...Typography.bodySmall, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: Spacing.xl },
  ctaButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
  },
  ctaButtonText: { ...Typography.button, color: Colors.textInverse },
  quickRow: { flexDirection: 'row', gap: Spacing.sm },
  quickCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickLabel: { ...Typography.bodySmall, fontWeight: '600', color: Colors.textPrimary },
});
