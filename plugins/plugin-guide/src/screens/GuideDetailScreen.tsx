import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../../apps/mobile/src/theme/colors';
import { SkeletonBox } from '../../../../apps/mobile/src/components/SkeletonLoader';
import { getGuide, GuideArticle } from '../api/guideApi';
import type { PluginScreenProps } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

export default function GuideDetailScreen({ navigation, route }: PluginScreenProps) {
  const slug = route.params?.slug as string;
  const [article, setArticle] = useState<GuideArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getGuide(slug);
        setArticle(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Pressable style={styles.backRow} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={18} color={Colors.primary} />
        <Text style={styles.backText}>Guide</Text>
      </Pressable>

      {loading ? (
        <View>
          <SkeletonBox width="80%" height={26} style={styles.mb16} />
          <SkeletonBox width="40%" height={14} style={styles.mb24} />
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonBox key={i} width={i % 3 === 0 ? '70%' : '100%'} height={13} style={styles.mb8} />
          ))}
        </View>
      ) : error || !article ? (
        <View style={styles.errorState}>
          <Ionicons name="warning-outline" size={32} color={Colors.error} />
          <Text style={styles.errorText}>Could not load article.</Text>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
          <Text style={styles.articleTitle}>{article.title_en}</Text>
          <View style={styles.divider} />
          <Text style={styles.articleBody}>{article.body_en}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingTop: Spacing.xxl, paddingBottom: Spacing.xl },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.lg },
  backText: { ...Typography.body, color: Colors.primary },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  mb8: { marginBottom: 8 },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  categoryText: { ...Typography.bodySmall, color: Colors.primaryDark, fontWeight: '600', textTransform: 'capitalize' },
  articleTitle: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.md },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginBottom: Spacing.lg },
  articleBody: { ...Typography.body, color: Colors.textSecondary, lineHeight: 26 },
  errorState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  errorText: { ...Typography.body, color: Colors.error },
  backBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
  },
  backBtnText: { ...Typography.button, color: Colors.textSecondary },
});
