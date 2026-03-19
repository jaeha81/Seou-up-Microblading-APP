import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../core/auth/AuthContext';
import { apiClient } from '../core/api/client';
import { CacheService } from '../core/cache/CacheService';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';

type Language = 'en' | 'ko' | 'th' | 'vi';
const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ko', label: 'Korean', native: '한국어' },
  { code: 'th', label: 'Thai', native: 'ภาษาไทย' },
  { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt' },
];

export default function SettingsScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingLang, setSavingLang] = useState(false);

  const handleLanguageChange = async (lang: Language) => {
    if (savingLang || lang === user?.language) return;
    setSavingLang(true);
    try {
      await apiClient.patch('/api/auth/me', { language: lang });
      await CacheService.invalidate('auth:me');
      await refreshUser();
    } finally {
      setSavingLang(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name ?? '—'}</Text>
          <Text style={styles.profileEmail}>{user?.email ?? '—'}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>{user?.role ?? '—'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        <View style={styles.langGrid}>
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              style={[styles.langCard, user?.language === lang.code && styles.langCardActive]}
              onPress={() => handleLanguageChange(lang.code)}
              disabled={savingLang}
            >
              <Text style={[styles.langNative, user?.language === lang.code && styles.langNativeActive]}>
                {lang.native}
              </Text>
              <Text style={[styles.langLabel, user?.language === lang.code && styles.langLabelActive]}>
                {lang.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {savingLang && <ActivityIndicator size="small" color={Colors.primary} style={styles.savingIndicator} />}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Consent</Text>
          <View style={styles.infoValue}>
            <Ionicons
              name={user?.consent_given ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={user?.consent_given ? Colors.success : Colors.error}
            />
            <Text style={[styles.infoText, { color: user?.consent_given ? Colors.success : Colors.error }]}>
              {user?.consent_given ? 'Accepted' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        style={[styles.logoutBtn, loggingOut && styles.logoutBtnDisabled]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator size="small" color={Colors.error} />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={18} color={Colors.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </>
        )}
      </Pressable>

      <Text style={styles.version}>Seou-up Microblading v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingTop: Spacing.xxl, paddingBottom: Spacing.xl },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.lg },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...Typography.h3, color: Colors.textInverse },
  profileInfo: { flex: 1 },
  profileName: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary },
  profileEmail: { ...Typography.bodySmall, color: Colors.textSecondary, marginBottom: 6 },
  rolePill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  rolePillText: { ...Typography.caption, color: Colors.primaryDark, fontWeight: '700', textTransform: 'capitalize' },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  langCard: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  langCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight + '33' },
  langNative: { ...Typography.body, fontWeight: '700', color: Colors.textSecondary, marginBottom: 2 },
  langNativeActive: { color: Colors.primaryDark },
  langLabel: { ...Typography.caption, color: Colors.textMuted },
  langLabelActive: { color: Colors.primary },
  savingIndicator: { marginTop: Spacing.sm, alignSelf: 'center' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: { ...Typography.body, color: Colors.textSecondary },
  infoValue: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { ...Typography.bodySmall, fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    marginBottom: Spacing.lg,
  },
  logoutBtnDisabled: { opacity: 0.5 },
  logoutText: { ...Typography.button, color: Colors.error },
  version: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
});
