import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../../apps/mobile/src/theme/colors';
import { SkeletonBox, SkeletonCard } from '../../../../apps/mobile/src/components/SkeletonLoader';
import { getStats, getUsers, getFeedbacks, deactivateUser, AdminStats, AdminUser, AdminFeedback } from '../api/adminApi';
import type { PluginScreenProps } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

type Tab = 'stats' | 'users' | 'feedbacks';

export default function AdminScreen({ }: PluginScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      if (activeTab === 'stats') {
        const data = await getStats();
        setStats(data);
      } else if (activeTab === 'users') {
        const data = await getUsers();
        setUsers(data);
      } else {
        const data = await getFeedbacks();
        setFeedbacks(data);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [activeTab]);

  const handleDeactivate = async (userId: number) => {
    await deactivateUser(userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_active: false } : u));
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={Colors.primary} />}
    >
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.tabs}>
        {(['stats', 'users', 'feedbacks'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        activeTab === 'stats' ? (
          <View style={styles.statsGrid}>
            {[1, 2, 3].map((i) => <SkeletonBox key={i} width="30%" height={80} borderRadius={BorderRadius.md} />)}
          </View>
        ) : (
          <View>{[1, 2, 3, 4].map((i) => <SkeletonCard key={i} lines={2} />)}</View>
        )
      ) : activeTab === 'stats' && stats ? (
        <View style={styles.statsGrid}>
          {[
            { label: 'Users', value: stats.total_users, icon: 'people-outline' as const },
            { label: 'Simulations', value: stats.total_simulations, icon: 'camera-outline' as const },
            { label: 'Feedbacks', value: stats.total_feedbacks, icon: 'chatbubble-outline' as const },
          ].map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Ionicons name={item.icon} size={20} color={Colors.primary} />
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      ) : activeTab === 'users' ? (
        <View>
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, user.is_active ? styles.badgeActive : styles.badgeInactive]}>
                    <Text style={styles.badgeText}>{user.is_active ? 'Active' : 'Inactive'}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{user.role}</Text>
                  </View>
                </View>
              </View>
              {user.is_active && (
                <Pressable style={styles.deactivateBtn} onPress={() => handleDeactivate(user.id)}>
                  <Text style={styles.deactivateBtnText}>Deactivate</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View>
          {feedbacks.map((fb) => (
            <View key={fb.id} style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{fb.category}</Text>
                </View>
                {fb.rating != null && (
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color={Colors.primary} />
                    <Text style={styles.ratingText}>{fb.rating}/5</Text>
                  </View>
                )}
              </View>
              <Text style={styles.feedbackMessage}>{fb.message}</Text>
              {fb.email && <Text style={styles.feedbackEmail}>{fb.email}</Text>}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingTop: Spacing.xxl, paddingBottom: Spacing.xl },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.lg },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.md, padding: 4, marginBottom: Spacing.lg },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: BorderRadius.sm },
  tabActive: { backgroundColor: Colors.surface, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  tabText: { ...Typography.bodySmall, color: Colors.textMuted },
  tabTextActive: { color: Colors.textPrimary, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  statValue: { ...Typography.h2, color: Colors.textPrimary },
  statLabel: { ...Typography.caption, color: Colors.textSecondary },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userInfo: { flex: 1 },
  userName: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary },
  userEmail: { ...Typography.bodySmall, color: Colors.textSecondary, marginBottom: 6 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  badge: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeActive: { backgroundColor: Colors.success + '22' },
  badgeInactive: { backgroundColor: Colors.error + '22' },
  badgeText: { ...Typography.caption, color: Colors.textSecondary, textTransform: 'capitalize' },
  deactivateBtn: {
    borderWidth: 1,
    borderColor: Colors.error + '60',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deactivateBtnText: { ...Typography.caption, color: Colors.error, fontWeight: '600' },
  feedbackCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { ...Typography.caption, color: Colors.primary },
  feedbackMessage: { ...Typography.body, color: Colors.textSecondary, lineHeight: 20 },
  feedbackEmail: { ...Typography.caption, color: Colors.textMuted, marginTop: 4 },
});
