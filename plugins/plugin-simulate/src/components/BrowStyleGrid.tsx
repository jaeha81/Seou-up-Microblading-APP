import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Typography, BorderRadius } from '../../../../apps/mobile/src/theme/colors';
import type { EyebrowStyle } from '../api/simulationApi';

type Props = {
  styles: EyebrowStyle[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

const STYLE_COLORS = [
  '#c9a96e', '#8b4a6b', '#5d8a6b', '#6b7a8d',
  '#a05050', '#5a6b8a', '#7a8a5a', '#8a6b5a',
  '#6b5a8a', '#8a7a5a', '#5a8a7a', '#7a5a6b',
];

export function BrowStyleGrid({ styles: browStyles, selectedId, onSelect }: Props) {
  return (
    <FlatList
      data={browStyles}
      keyExtractor={(item) => String(item.id)}
      numColumns={3}
      scrollEnabled={false}
      renderItem={({ item, index }) => {
        const isSelected = item.id === selectedId;
        const bgColor = STYLE_COLORS[index % STYLE_COLORS.length];
        return (
          <Pressable
            style={[
              gridStyles.cell,
              isSelected && gridStyles.cellSelected,
              isSelected && { borderColor: bgColor },
            ]}
            onPress={() => onSelect(item.id)}
          >
            <View style={[gridStyles.preview, { backgroundColor: bgColor + (isSelected ? 'ff' : '55') }]}>
              <View style={gridStyles.browLine} />
            </View>
            <Text
              style={[gridStyles.label, isSelected && { color: bgColor, fontWeight: '700' }]}
              numberOfLines={2}
            >
              {item.name_en}
            </Text>
          </Pressable>
        );
      }}
      columnWrapperStyle={gridStyles.row}
    />
  );
}

const gridStyles = StyleSheet.create({
  row: { gap: 8, marginBottom: 8 },
  cell: {
    flex: 1,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Colors.card,
    padding: 8,
  },
  cellSelected: {
    backgroundColor: Colors.primaryLight + '22',
  },
  preview: {
    width: '100%',
    height: 56,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  browLine: {
    width: '70%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
