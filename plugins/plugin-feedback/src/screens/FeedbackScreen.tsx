import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../../apps/mobile/src/theme/colors';
import type { PluginScreenProps, PluginServices } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

type FeedbackCategory = 'general' | 'bug' | 'feature';

const CATEGORIES: { value: FeedbackCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'general', label: 'General', icon: 'chatbubble-outline' },
  { value: 'bug', label: 'Bug Report', icon: 'bug-outline' },
  { value: 'feature', label: 'Feature Request', icon: 'bulb-outline' },
];

let _services: PluginServices | null = null;

export function initFeedbackServices(services: PluginServices): void {
  _services = services;
}

export default function FeedbackScreen({ navigation }: PluginScreenProps) {
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const endpoint = _services?.auth.isAuthenticated
        ? '/api/feedback'
        : '/api/feedback/anonymous';
      await _services?.api.post(endpoint, {
        category,
        rating: rating > 0 ? rating : null,
        message: message.trim(),
        email: email.trim() || null,
      });
      setSubmitted(true);
    } catch {
      setError('Could not submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
        <Text style={styles.successTitle}>Thank You!</Text>
        <Text style={styles.successBody}>Your feedback helps us improve Seou-up.</Text>
        <Pressable
          style={styles.doneBtn}
          onPress={() => { setSubmitted(false); setMessage(''); setRating(0); setCategory('general'); }}
        >
          <Text style={styles.doneBtnText}>Submit Another</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Send Feedback</Text>
        <Text style={styles.subtitle}>Help us improve</Text>

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.value}
              style={[styles.categoryBtn, category === cat.value && styles.categoryBtnActive]}
              onPress={() => setCategory(cat.value)}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={category === cat.value ? Colors.textInverse : Colors.textSecondary}
              />
              <Text style={[styles.categoryBtnText, category === cat.value && styles.categoryBtnTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Rating (optional)</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => setRating(star)} hitSlop={8}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={28}
                color={star <= rating ? Colors.primary : Colors.border}
              />
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Message *</Text>
        <TextInput
          style={styles.textarea}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
          placeholder="Tell us what you think..."
          placeholderTextColor={Colors.textMuted}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Email (optional)</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="For follow-up only"
          placeholderTextColor={Colors.textMuted}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.textInverse} />
          ) : (
            <Text style={styles.submitBtnText}>Send Feedback</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingTop: Spacing.xxl, paddingBottom: Spacing.xl },
  title: { ...Typography.h2, color: Colors.textPrimary },
  subtitle: { ...Typography.bodySmall, color: Colors.textSecondary, marginBottom: Spacing.xl, marginTop: 4 },
  label: { ...Typography.bodySmall, fontWeight: '600', color: Colors.textSecondary, marginTop: Spacing.md, marginBottom: Spacing.xs },
  categoryRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  categoryBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryBtnText: { ...Typography.bodySmall, color: Colors.textSecondary },
  categoryBtnTextActive: { color: Colors.textInverse, fontWeight: '600' },
  starRow: { flexDirection: 'row', gap: Spacing.sm },
  textarea: {
    ...Typography.body,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 120,
    color: Colors.textPrimary,
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    color: Colors.textPrimary,
  },
  error: { ...Typography.bodySmall, color: Colors.error, marginTop: Spacing.xs },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { ...Typography.button, color: Colors.textInverse },
  successContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  successTitle: { ...Typography.h2, color: Colors.textPrimary },
  successBody: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  doneBtn: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
  },
  doneBtnText: { ...Typography.button, color: Colors.textSecondary },
});
