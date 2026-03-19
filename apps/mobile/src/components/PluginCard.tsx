import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing } from '../theme/colors';
import type { PluginRegistryEntry } from '../core/plugins/PluginInterface';

type PluginCardProps = {
  entry: PluginRegistryEntry;
  enabled: boolean;
  onToggle: (id: string, enabled: boolean) => void;
};

function PluginCardInner({ entry, enabled, onToggle }: PluginCardProps) {
  return (
    <View style={[styles.card, enabled && styles.cardEnabled]}>
      <View style={styles.row}>
        <View style={[styles.iconBadge, enabled && styles.iconBadgeEnabled]}>
          <Ionicons
            name={entry.iconName as keyof typeof Ionicons.glyphMap}
            size={22}
            color={enabled ? Colors.textInverse : Colors.textSecondary}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{entry.name}</Text>
          <Text style={styles.desc} numberOfLines={2}>{entry.description}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.version}>v{entry.version}</Text>
            {entry.size && <Text style={styles.size}>{entry.size}</Text>}
            {entry.permissions && entry.permissions.length > 0 && (
              <View style={styles.permBadge}>
                <Ionicons name="key-outline" size={10} color={Colors.textMuted} />
                <Text style={styles.permText}>{entry.permissions.length}</Text>
              </View>
            )}
          </View>
        </View>
        <Pressable
          style={[styles.toggle, enabled ? styles.toggleOn : styles.toggleOff]}
          onPress={() => onToggle(entry.id, !enabled)}
          hitSlop={8}
        >
          <Text style={[styles.toggleText, enabled ? styles.toggleTextOn : styles.toggleTextOff]}>
            {enabled ? 'ON' : 'OFF'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export const PluginCard = memo(PluginCardInner);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardEnabled: {
    borderColor: Colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeEnabled: {
    backgroundColor: Colors.primary,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  desc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  version: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  size: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  permBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  permText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    minWidth: 52,
    alignItems: 'center',
  },
  toggleOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleOff: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
  toggleText: {
    ...Typography.caption,
    fontWeight: '700',
  },
  toggleTextOn: { color: Colors.textInverse },
  toggleTextOff: { color: Colors.textMuted },
});
