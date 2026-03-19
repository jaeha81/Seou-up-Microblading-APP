import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../../apps/mobile/src/theme/colors';
import { SkeletonGrid } from '../../../../apps/mobile/src/components/SkeletonLoader';
import { BrowStyleGrid } from '../components/BrowStyleGrid';
import { getStyles, createSimulation, uploadPhoto, EyebrowStyle } from '../api/simulationApi';
import type { PluginScreenProps } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

export default function SimulateScreen({ navigation }: PluginScreenProps) {
  const [browStyles, setBrowStyles] = useState<EyebrowStyle[]>([]);
  const [loadingStyles, setLoadingStyles] = useState(true);
  const [selectedStyleId, setSelectedStyleId] = useState<number | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getStyles();
        setBrowStyles(data.filter((s) => s.is_active));
      } catch {
        Alert.alert('Error', 'Could not load eyebrow styles. Check your connection.');
      } finally {
        setLoadingStyles(false);
      }
    })();
  }, []);

  const pickPhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }, []);

  const runSimulation = useCallback(async () => {
    if (!selectedStyleId) {
      Alert.alert('Select Style', 'Please select an eyebrow style first.');
      return;
    }
    if (!photoUri) {
      Alert.alert('Add Photo', 'Please pick a photo first.');
      return;
    }
    setSubmitting(true);
    try {
      const { id } = await createSimulation(selectedStyleId);
      await uploadPhoto(id, photoUri);
      navigation.navigate('SimulateResult', { simulationId: id });
    } catch {
      Alert.alert('Error', 'Simulation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedStyleId, photoUri, navigation]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Brow Simulation</Text>
      <Text style={styles.disclaimer}>
        For visualization purposes only. Consult a certified professional before any procedure.
      </Text>

      <Text style={styles.sectionLabel}>1. Choose Style</Text>
      {loadingStyles ? (
        <SkeletonGrid count={12} columns={3} />
      ) : (
        <BrowStyleGrid
          styles={browStyles}
          selectedId={selectedStyleId}
          onSelect={setSelectedStyleId}
        />
      )}

      <Text style={styles.sectionLabel}>2. Add Your Photo</Text>
      <Pressable style={styles.photoArea} onPress={pickPhoto}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="image-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.photoPlaceholderText}>Tap to select photo</Text>
          </View>
        )}
      </Pressable>

      <Pressable
        style={[
          styles.runButton,
          (!selectedStyleId || !photoUri || submitting) && styles.runButtonDisabled,
        ]}
        onPress={runSimulation}
        disabled={!selectedStyleId || !photoUri || submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={Colors.textInverse} />
        ) : (
          <>
            <Ionicons name="sparkles" size={18} color={Colors.textInverse} />
            <Text style={styles.runButtonText}>Run Simulation</Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingTop: Spacing.xxl, paddingBottom: Spacing.xl },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.xs },
  disclaimer: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
    fontStyle: 'italic',
  },
  sectionLabel: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  photoArea: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  photoPlaceholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  photoPlaceholderText: { ...Typography.bodySmall, color: Colors.textMuted },
  photoPreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
  },
  runButtonDisabled: { opacity: 0.5 },
  runButtonText: { ...Typography.button, color: Colors.textInverse },
});
