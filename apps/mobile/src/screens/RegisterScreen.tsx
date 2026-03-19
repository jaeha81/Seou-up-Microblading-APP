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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../core/auth/AuthContext';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';

type Role = 'consumer' | 'pro' | 'founder';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Register'> };

const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: 'consumer', label: 'Consumer', desc: 'Try brow simulations' },
  { value: 'pro', label: 'Professional', desc: 'Manage client sessions' },
  { value: 'founder', label: 'Entrepreneur', desc: 'Access startup guides' },
];

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>('consumer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register({ name: name.trim(), email: email.trim().toLowerCase(), password, role });
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg ?? 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Pressable style={styles.back} onPress={() => step === 1 ? navigation.goBack() : setStep(1)}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.stepIndicator}>Step {step} of 2</Text>

        {step === 1 ? (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>I am a...</Text>
            {ROLES.map((r) => (
              <Pressable
                key={r.value}
                style={[styles.roleCard, role === r.value && styles.roleCardSelected]}
                onPress={() => setRole(r.value)}
              >
                <Text style={[styles.roleLabel, role === r.value && styles.roleLabelSelected]}>{r.label}</Text>
                <Text style={styles.roleDesc}>{r.desc}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.button} onPress={() => setStep(2)}>
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={Colors.textMuted}
              editable={!loading}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={Colors.textMuted}
              editable={!loading}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Min. 8 characters"
              placeholderTextColor={Colors.textMuted}
              editable={!loading}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.textInverse} />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </Pressable>
          </View>
        )}

        <Pressable style={styles.link} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Sign in</Text></Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: Spacing.xl, paddingTop: Spacing.xxl },
  back: { marginBottom: Spacing.lg },
  backText: { ...Typography.body, color: Colors.primary },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.xs },
  stepIndicator: { ...Typography.bodySmall, color: Colors.textMuted, marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md },
  form: { gap: Spacing.sm },
  roleCard: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: 4,
  },
  roleCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight + '22' },
  roleLabel: { ...Typography.body, fontWeight: '600', color: Colors.textSecondary, marginBottom: 2 },
  roleLabelSelected: { color: Colors.primaryDark },
  roleDesc: { ...Typography.bodySmall, color: Colors.textMuted },
  label: { ...Typography.bodySmall, fontWeight: '600', color: Colors.textSecondary, marginTop: Spacing.xs, marginBottom: -2 },
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
  error: { ...Typography.bodySmall, color: Colors.error },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { ...Typography.button, color: Colors.textInverse },
  link: { alignItems: 'center', marginTop: Spacing.xl },
  linkText: { ...Typography.bodySmall, color: Colors.textSecondary },
  linkBold: { color: Colors.primary, fontWeight: '600' },
});
