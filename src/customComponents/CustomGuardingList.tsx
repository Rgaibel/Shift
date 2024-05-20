import {StyleSheet, Text, View} from 'react-native';
import {PersonIndex} from '../types/guardingList';
import React from 'react';
import {CustomGuardingListItem} from './CustomGuardingListItem';

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
    borderBottomColor: '#eee',
  },
  cell: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 0,
    textAlign: 'left',
    minWidth: 120,
    maxWidth: 120,
  },
  timeCell: {
    minWidth: 120,
    maxWidth: 120,
  },
});
