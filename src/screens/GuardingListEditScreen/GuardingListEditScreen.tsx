import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Button,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {FriendsState} from '../../redux/friendsSlice';
import friendsData from '../../data/friendsData'; // Import hardcoded friends data
import {useSelector} from 'react-redux';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'GuardingListEditScreen'
>;

interface Person {
  guardingList: number;
  place: number;
}

const GuardingListEditScreen: React.FC<Props> = ({route, navigation}) => {
  const {
    selectedFriends = [],
    startDate,
    endDate,
    numCycles,
    locationList = [],
  } = route.params;
  const friendsDataRedux =
    useSelector((state: FriendsState) => state.list) || friendsData;
  const [guardingLists, setGuardingLists] = useState<
    {title: string; data: {time: string; person: string; place: string}[]}[]
  >([]);

  useEffect(() => {
    const splitFriendsIntoLists = () => {
      const cycles = Number(numCycles);
      if (isNaN(cycles) || cycles <= 0) {
        throw new Error('Invalid number of cycles');
      }

      const startDateTime = new Date(startDate ?? 0);
      const endDateTime = new Date(endDate ?? 0);

      const resultLists = [];

      const totalMinutes =
        (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
      const minutesPerCycle = totalMinutes / cycles;
      const minutesPerShift =
        (minutesPerCycle / selectedFriends.length) * locationList.length;

      for (let i = 0; i < cycles; i++) {
        const currentList = selectedFriends.map((friendId, friendIndex) => {
          const startTime = new Date(
            startDateTime.getTime() +
              (i * minutesPerCycle +
                Math.floor(friendIndex / locationList.length) *
                  minutesPerShift) *
                60000,
          );

          const formattedStartTime = startTime.toLocaleTimeString([], {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return {
            time: formattedStartTime,
            person: `${friendsDataRedux[friendId - 1].firstName} ${
              friendsDataRedux[friendId - 1].lastName
            }`,
            place: locationList[friendIndex % locationList.length],
          };
        });

        resultLists.push({
          title: `Guarding List ${i + 1}`,
          data: currentList,
        });
      }

      return resultLists;
    };

    setGuardingLists(splitFriendsIntoLists());
  }, [
    selectedFriends,
    startDate,
    endDate,
    numCycles,
    friendsDataRedux,
    locationList,
  ]);

  // console.log(JSON.stringify(guardingLists));

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [personToSwap, setPersonToSwap] = useState<Person | null>(null);

  const handlePersonLongPress = (guardingList: number, place: number) => {
    if (selectedPerson === null) {
      setSelectedPerson({guardingList: guardingList, place: place});
    } else {
      setPersonToSwap({guardingList: guardingList, place: place});
      Alert.alert(
        'Swap Confirmation',
        `Do you want to swap ${
          guardingLists[selectedPerson.guardingList].data[selectedPerson.place]
            .person
        } with ${guardingLists[guardingList].data[place].person}?`,
        [
          {text: 'No', onPress: () => setPersonToSwap(null)},
          {
            text: 'Yes',
            onPress: () =>
              swapPersons(
                selectedPerson.guardingList,
                selectedPerson.place,
                guardingList,
                place,
              ),
          },
        ],
      );
    }
  };

  const swapPersons = (
    guardingList1: number,
    index1: number,
    guardingList2: number,
    index2: number,
  ) => {
    const newGuardingLists = [...guardingLists];
    const temp = newGuardingLists[guardingList1].data[index1].person;
    newGuardingLists[guardingList1].data[index1].person =
      newGuardingLists[guardingList2].data[index2].person;
    newGuardingLists[guardingList2].data[index2].person = temp;
    setGuardingLists(newGuardingLists);
    setSelectedPerson(null);
    setPersonToSwap(null);
  };

  const uniqueTimesPerList = useMemo(() => {
    return guardingLists.map(list => {
      const uniqueTimes = Array.from(new Set(list.data.map(item => item.time)));
      return {
        title: list.title,
        time: uniqueTimes,
      };
    });
  }, [guardingLists]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View style={{flexDirection: 'column'}}>
          <View style={styles.headerRow}>
            <Text style={[styles.cell, {minWidth: 120, maxWidth: 120}]}>
              Time/Place
            </Text>

            {locationList.map((place, index) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  {flex: 1, textAlign: 'center', minWidth: 120, maxWidth: 120},
                ]}>
                {place}
              </Text>
            ))}
          </View>
          <ScrollView style={{flex: 1}}>
            {guardingLists.map((list, index) => (
              <GuardingList
                key={index}
                guardingListIndex={index}
                list={list}
                uniqueTimesPerList={uniqueTimesPerList}
                handlePersonLongPress={handlePersonLongPress}
                selectedPerson={selectedPerson}
                personToSwap={personToSwap}
              />
            ))}
          </ScrollView>
          <Button
            title="Go Home"
            onPress={() => navigation.navigate('HomeScreen')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const GuardingList: React.FC<{
  guardingListIndex: number;
  list: {title: string; data: {time: string; person: string; place: string}[]};
  uniqueTimesPerList: {title: string; time: string[]}[];
  handlePersonLongPress: (guardingList: number, place: number) => void;
  selectedPerson: Person | null;
  personToSwap: Person | null;
}> = ({
  guardingListIndex,
  list,
  uniqueTimesPerList,
  handlePersonLongPress,
  selectedPerson,
  personToSwap,
}) => (
  <View style={[styles.cell, {flex: 1, flexDirection: 'column'}]}>
    <Text style={styles.title}>{list.title}</Text>
    {uniqueTimesPerList
      .find(obj => list.title === obj.title)
      ?.time.map((time, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={[styles.cell, {minWidth: 110, maxWidth: 110}]}>
            {time}
          </Text>
          {list.data.map((item, idx) => (
            <GuardingListItem
              key={idx}
              guardingListIndex={guardingListIndex}
              item={item}
              idx={idx}
              time={time}
              handlePersonLongPress={handlePersonLongPress}
              isSelected={
                selectedPerson?.place === idx &&
                selectedPerson?.guardingList === guardingListIndex
              }
              isSwappable={
                personToSwap?.place === idx &&
                personToSwap?.guardingList === guardingListIndex
              }
            />
          ))}
        </View>
      ))}
  </View>
);

const GuardingListItem: React.FC<{
  key: number;
  guardingListIndex: number;
  item: {time: string; person: string; place: string};
  idx: number;
  time: string;
  handlePersonLongPress: (guardingList: number, place: number) => void;
  isSelected: boolean;
  isSwappable: boolean;
}> = React.memo(
  ({
    guardingListIndex,
    item,
    idx,
    time,
    handlePersonLongPress,
    isSelected,
    isSwappable,
  }) =>
    item.time === time ? (
      <TouchableOpacity
        style={[
          styles.cell,
          {
            flex: 1,
            backgroundColor:
              (isSelected || isSwappable) && isSelected !== isSwappable
                ? 'green'
                : 'white',
          },
        ]}
        onLongPress={() => handlePersonLongPress(guardingListIndex, idx)}>
        <Text>{item.person}</Text>
      </TouchableOpacity>
    ) : null,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    textAlign: 'left',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default GuardingListEditScreen;
