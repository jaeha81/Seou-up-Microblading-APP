import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../../apps/mobile/src/theme/colors';
import { SkeletonBox } from '../../../../apps/mobile/src/components/SkeletonLoader';
import { getSimulation, Simulation } from '../api/simulationApi';
import type { PluginScreenProps } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

const POLL_INTERVAL = 2000;
const POLL_MAX = 15;

export default function SimulateResultScreen({ navigation, route }: PluginScreenProps) {
  const simulationId = route.params?.simulationId as number;
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollCount = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetch = async () => {
    try {
      const data = await getSimulation(simulationId);
      setSimulation(data);
      if (data.status === 'processing' || data.status === 'pending') {
        if (pollCount.current < POLL_MAX) {
          pollCount.current += 1;
          pollTimer.current = setTimeout(fetch, POLL_INTERVAL);
        } else {
          setError('Simulation is taking longer than expected. Please check back later.');
        }
      }
    } catch {
      setError('Could not retrieve simulation result.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [simulationId]);

  const isProcessing = simulation?.status === 'processing' || simulation?.status === 'pending';
  const isCompleted = simulation?.status === 'completed';
  const isFailed = simulation?.status === 'failed';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Pressable style={styles.backRow} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={18} color={Colors.primary} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.title}>Simulation Result</Text>

      {loading ? (
        <View style={styles.card}>
          <SkeletonBox width="70%" height={20} style={styles.mb16} />
          <SkeletonBox width="100%" height={14} style={styles.mb8} />
          <SkeletonBox width="85%" height={14} />
        </View>
      ) : error ? (
        <View style={styles.errorCard}>
          <Ionicons name="warning-outline" size={32} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={() => { setLoading(true); setError(null); fetch(); }}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      ) : isProcessing ? (
        <View style={styles.card}>
          <ActivityIndicator size="large" color={Colors.primary} style={styles.mb16} />
          <Text style={styles.processingTitle}>Processing...</Text>
          <Text style={styles.processingBody}>Your simulation is running. This usually takes a few seconds.</Text>
        </View>
      ) : isFailed ? (
        <View style={styles.errorCard}>
          <Ionicons name="close-circle-outline" size={32} color={Colors.error} />
          <Text style={styles.errorText}>Simulation failed. Please try again.</Text>
          <Pressable style={styles.retryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.retryBtnText}>Try Again</Text>
          </Pressable>
        </View>
      ) : isCompleted ? (
        <View>
          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.successText}>Simulation Complete</Text>
          </View>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Style Applied</Text>
            <Text style={styles.resultValue}>Style #{simulation?.eyebrow_style_id}</Text>
          </View>
          <View style={styles.disclaimerBox}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.info} />
            <Text style={styles.disclaimerText}>
              This simulation is for visualization only. Not a medical or cosmetic procedure guarantee.
              Always consult a certified microblading professional before any treatment.
            </Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingTop: Spacing.xxl, paddingBottom: Spacing.xl },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.lg },
  backText: { ...Typography.body, color: Colors.primary },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.lg },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  mb16: { marginBottom: 16 },
  mb8: { marginBottom: 8 },
  processingTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.sm },
  processingBody: { ...Typography.bodySmall, color: Colors.textSecondary, textAlign: 'center' },
  errorCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.error + '40',
    alignItems: 'center',
    gap: Spacing.md,
  },
  errorText: { ...Typography.body, color: Colors.error, textAlign: 'center' },
  retryBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
  },
  retryBtnText: { ...Typography.button, color: Colors.textSecondary },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  successText: { ...Typography.body, fontWeight: '600', color: Colors.success },
  resultCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  resultLabel: { ...Typography.bodySmall, color: Colors.textMuted, marginBottom: 4 },
  resultValue: { ...Typography.h3, color: Colors.textPrimary },
  disclaimerBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.info + '12',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  disclaimerText: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
});
