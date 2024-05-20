import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

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
  }) =>
    item.time === time ? (
      // eslint-disable-next-line react/react-in-jsx-scope
      <TouchableOpacity
        style={[
          styles.cell,
          styles.itemCell,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor:
              (isSelected || isSwappable) && isSelected !== isSwappable
                ? 'green'
                : item.color,
          },
        ]}
        onLongPress={() => handlePersonLongPress(timeIndex, idx)}>
        <Text>{item.person}</Text>
      </TouchableOpacity>
    ) : null,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 0,
    textAlign: 'left',
    minWidth: 120,
    maxWidth: 120,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    minWidth: 120,
    maxWidth: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
  },
  listCell: {
    flex: 1,
    flexDirection: 'column',
  },
});
