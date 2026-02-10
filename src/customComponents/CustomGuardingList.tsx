import {StyleSheet, Text, View} from 'react-native';
import {PersonIndex} from '../types/guardingList';
import React from 'react';
import {CustomGuardingListItem} from './CustomGuardingListItem';
import {colors, spacing, typography} from '../theme/colors';

export const CustomGuardingList: React.FC<{
  timeIndex: number;
  list: {time: string; person: string; place: string; color: string}[];
  handlePersonLongPress: (guardingList: number, place: number) => void;
  selectedPerson: PersonIndex | null;
  personToSwap: PersonIndex | null;
}> = ({
  timeIndex,
  list,
  handlePersonLongPress,
  selectedPerson,
  personToSwap,
}) => (
  <View style={styles.row}>
    <Text style={[styles.cell, styles.timeCell]}>{list[0].time}</Text>
    {list.map((item, index) => (
      <CustomGuardingListItem
        key={index}
        timeIndex={timeIndex}
        item={item}
        idx={index}
        time={list[0].time}
        handlePersonLongPress={handlePersonLongPress}
        isSelected={
          selectedPerson?.place === index &&
          selectedPerson?.timeIndex === timeIndex
        }
        isSwappable={
          personToSwap?.place === index && personToSwap?.timeIndex === timeIndex
        }
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  cell: {
    padding: spacing.md,
    textAlign: 'left',
    minWidth: 140,
    maxWidth: 140,
    color: colors.text,
  },
  timeCell: {
    ...typography.body,
    minWidth: 140,
    maxWidth: 140,
    color: colors.textSecondary,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
});
