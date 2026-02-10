import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {colors, spacing, borderRadius, typography} from '../theme/colors';

export const CustomGuardingListItem: React.FC<{
  key: number;
  timeIndex: number;
  item: {time: string; person: string; place: string; color: string};
  idx: number;
  time: string;
  handlePersonLongPress: (guardingList: number, place: number) => void;
  isSelected: boolean;
  isSwappable: boolean;
}> = React.memo(
  ({
    timeIndex,
    item,
    idx,
    time,
    handlePersonLongPress,
    isSelected,
    isSwappable,
  }) => {
    const getBackgroundColor = () => {
      if (isSelected) {
        return colors.primary;
      }
      if (isSwappable) {
        return colors.secondary;
      }
      return item.color || colors.surfaceElevated;
    };

    const dynamicStyles = {
      backgroundColor: getBackgroundColor(),
      borderColor: isSelected || isSwappable ? colors.primary : 'transparent',
      borderWidth: isSelected || isSwappable ? 2 : 0,
    };

    return item.time === time ? (
      <TouchableOpacity
        style={[styles.cell, styles.itemCell, dynamicStyles]}
        onLongPress={() => handlePersonLongPress(timeIndex, idx)}
        activeOpacity={0.7}>
        <Text style={styles.personText}>{item.person}</Text>
      </TouchableOpacity>
    ) : null;
  },
);

const styles = StyleSheet.create({
  cell: {
    padding: spacing.md,
    textAlign: 'left',
    minWidth: 140,
    maxWidth: 140,
  },
  itemCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    margin: spacing.xs,
    minHeight: 50,
  },
  personText: {
    ...typography.bodyBold,
    color: colors.text,
    textAlign: 'center',
  },
});
