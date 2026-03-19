import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePluginStore } from '../core/plugins/PluginStore';
import { PluginCard } from '../components/PluginCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';
import { PluginId } from '../core/plugins/PluginInterface';

export default function PluginStoreScreen() {
  const { registryEntries, registryLoading, registryError, fetchRegistry, enabledPluginIds, enable, disable } =
    usePluginStore();

  useEffect(() => {
    fetchRegistry();
  }, []);

  const handleToggle = async (id: string, shouldEnable: boolean) => {
    if (shouldEnable) {
      await enable(id as PluginId);
    } else {
      await disable(id as PluginId);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={registryLoading}
          onRefresh={() => fetchRegistry(true)}
          tintColor={Colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Plugin Store</Text>
        <Text style={styles.subtitle}>Enable features for your workflow</Text>
      </View>

      {registryError && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={16} color={Colors.warning} />
          <Text style={styles.errorText}>Could not reach registry. Showing cached data.</Text>
        </View>
      )}

      {registryLoading && registryEntries.length === 0 ? (
        <View>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} lines={3} />)}
        </View>
      ) : registryEntries.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cloud-offline-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No plugins available</Text>
          <Pressable style={styles.retryBtn} onPress={() => fetchRegistry(true)}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Text style={styles.countLabel}>
            {enabledPluginIds.size} of {registryEntries.length} enabled
          </Text>
          {registryEntries.map((entry) => (
            <PluginCard
              key={entry.id}
              entry={entry}
              enabled={enabledPluginIds.has(entry.id as PluginId)}
              onToggle={handleToggle}
            />
          ))}
        </>
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
  header: { marginBottom: Spacing.lg },
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
  countLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    textAlign: 'right',
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
