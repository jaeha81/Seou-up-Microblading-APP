import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../core/auth/AuthContext';
import { apiClient } from '../core/api/client';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';

const STEPS = [
  {
    title: 'Welcome to Seou-up',
    body: 'Your personal microblading companion. Simulate eyebrow styles, find certified providers, and grow your business.',
  },
  {
    title: 'What You Can Do',
    body: 'Try 12+ eyebrow styles on your photo, access startup guides, connect with certified professionals, and manage consultations.',
  },
  {
    title: 'Legal Notice',
    body: 'Seou-up provides information and simulation support only. We are not a licensed medical or procedure provider. Always consult a certified professional before any cosmetic procedure.',
    requiresConsent: true,
  },
  {
    title: 'You\'re Ready!',
    body: 'Tap below to get started.',
  },
];

export default function OnboardingScreen() {
  const { refreshUser } = useAuth();
  const [step, setStep] = useState(0);
  const [consented, setConsented] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const canProceed = !current.requiresConsent || consented;

  const handleNext = async () => {
    if (!canProceed) return;
    if (isLast) {
      setSubmitting(true);
      try {
        await apiClient.post('/api/auth/consent', { consent_given: true });
        await refreshUser();
      } catch {
        setSubmitting(false);
      }
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progress}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>

        {current.requiresConsent && (
          <Pressable style={styles.consentRow} onPress={() => setConsented((v) => !v)}>
            <View style={[styles.checkbox, consented && styles.checkboxChecked]}>
              {consented && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.consentText}>I understand and accept this disclaimer</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        {step > 0 && (
          <Pressable style={styles.backBtn} onPress={() => setStep((s) => s - 1)}>
            <Text style={styles.backBtnText}>Back</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.nextBtn, (!canProceed || submitting) && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!canProceed || submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.textInverse} />
          ) : (
            <Text style={styles.nextBtnText}>{isLast ? "Let's Go" : 'Next'}</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  progress: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingTop: Spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: { backgroundColor: Colors.primary },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: Colors.textInverse, fontSize: 12, fontWeight: '700' },
  consentText: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1 },
  footer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  backBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backBtnText: { ...Typography.button, color: Colors.textSecondary },
  nextBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText: { ...Typography.button, color: Colors.textInverse },
});
