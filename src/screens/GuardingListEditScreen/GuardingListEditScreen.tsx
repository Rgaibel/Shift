import React from 'react';
import {View, Text, StyleSheet, ScrollView, Button} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {useDispatch} from 'react-redux';
import {useGuardingList} from '../../customHooks/useGuardingList';
import {CustomGuardingList} from '../../customComponents/CustomGuardingList';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'GuardingListEditScreen'
>;

const GuardingListEditScreen: React.FC<Props> = ({route, navigation}) => {
  const {
    selectedFriends = [],
    startDate,
    endDate,
    numCycles = '',
    locationList = [],
  } = route.params;

  const {guardingLists, handlePersonLongPress, personToSwap, selectedPerson} =
    useGuardingList({
      selectedFriends,
      startDate,
      endDate,
      numCycles,
      locationList,
    });

  const dispatch = useDispatch();

  const setData = (newData: any) => {
    dispatch({type: 'SET_DATA', payload: newData});
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View style={styles.listContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.headerCell]}>Time/Place</Text>
            {locationList.map((place, index) => (
              <Text key={index} style={[styles.cell, styles.headerCell]}>
                {place}
              </Text>
            ))}
          </View>
          <ScrollView style={styles.scrollView}>
            {guardingLists.map((list, index) => (
              <CustomGuardingList
                key={index}
                timeIndex={index}
                list={list}
                handlePersonLongPress={handlePersonLongPress}
                selectedPerson={selectedPerson}
                personToSwap={personToSwap}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <Button
        title="Save"
        onPress={() => {
          setData(guardingLists);
          navigation.navigate('HomeScreen'); //navigating to home dismisses all the previous screens could also use (navigation.popToTop())
        }}
      />
    </View>
  );
};

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
  scrollView: {
    flex: 1,
  },
});

export default GuardingListEditScreen;
