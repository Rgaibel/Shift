import React, {useEffect, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'GuardingListEditScreen'
>;

interface Person {
  timeIndex: number;
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
    {time: string; person: string; place: string; color: string}[][]
  >([]);

  const dispatch = useDispatch();

  const setData = (newData: any) => {
    dispatch({type: 'SET_DATA', payload: newData});
  };

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

      let currentList = [];
      let lastFormattedTime = null;

      for (let i = 0; i < cycles; i++) {
        // Distribute the shifts among the selected friends based on the number of locations
        for (let j = 0; j < locationList.length; j++) {
          const friendIndex =
            (i * locationList.length + j) % selectedFriends.length;
          const friendId = selectedFriends[friendIndex];
          const startTime = new Date(
            startDateTime.getTime() + i * minutesPerCycle * 60000,
          );

          const formattedTime = startTime.toLocaleTimeString([], {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          if (formattedTime !== lastFormattedTime) {
            if (currentList.length > 0) {
              resultLists.push(currentList);
              currentList = [];
            }
            lastFormattedTime = formattedTime;
          }

          currentList.push({
            time: formattedTime,
            person: `${friendsDataRedux[friendId - 1].firstName} ${
              friendsDataRedux[friendId - 1].lastName
            }`,
            place: locationList[j],
            color: generateUniqueColor(friendId),
          });
        }
      }

      if (currentList.length > 0) {
        resultLists.push(currentList);
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

  // console.log(guardingLists);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [personToSwap, setPersonToSwap] = useState<Person | null>(null);

  const handlePersonLongPress = (timeIndex: number, place: number) => {
    if (selectedPerson === null) {
      setSelectedPerson({timeIndex: timeIndex, place: place});
    } else {
      setPersonToSwap({timeIndex: timeIndex, place: place});
      Alert.alert(
        'Swap Confirmation',
        `Do you want to swap ${
          guardingLists[selectedPerson.timeIndex][selectedPerson.place].person
        } with ${guardingLists[timeIndex][place].person}?`,
        [
          {text: 'No', onPress: () => setPersonToSwap(null)},
          {
            text: 'Yes',
            onPress: () =>
              swapPersons(
                selectedPerson.timeIndex,
                selectedPerson.place,
                timeIndex,
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
    const tempColor = newGuardingLists[guardingList1][index1].color;
    newGuardingLists[guardingList1][index1].color =
      newGuardingLists[guardingList2][index2].color;
    newGuardingLists[guardingList2][index2].color = tempColor;

    const tempPerson = newGuardingLists[guardingList1][index1].person;
    newGuardingLists[guardingList1][index1].person =
      newGuardingLists[guardingList2][index2].person;
    newGuardingLists[guardingList2][index2].person = tempPerson;
    setGuardingLists(newGuardingLists);
    setSelectedPerson(null);
    setPersonToSwap(null);
  };

  const generateUniqueColor = (friendId: number) => {
    const baseColors = [
      '#FF663333',
      '#FFB39933',
      '#FF33FF33',
      '#FFFF9933',
      '#00B3E633',
      '#E6B33333',
      '#3366E633',
      '#99996633',
      '#99FF9933',
      '#B34D4D33',
      '#80B30033',
      '#80990033',
      '#E6B3B333',
      '#6680B333',
      '#6699133a',
      '#FF99E633',
      '#CCFF133a',
      '#FF1A6633',
      '#E633133a',
      '#33FFCC33',
      '#66994D33',
      '#B366CC33',
      '#4D800033',
      '#B3330033',
      '#CC80CC33',
      '#66664D33',
      '#991AFF33',
      '#E666FF33',
      '#4DB3FF33',
      '#1AB39933',
      '#E666B333',
      '#3399133a',
      '#CC999933',
      '#B3B3133a',
      '#00E68033',
      '#4D806633',
      '#80998033',
      '#E6FF8033',
      '#1AFF3333',
      '#99993333',
      '#FF338033',
      '#CCCC0033',
      '#66E64D33',
      '#4D80CC33',
      '#9900B333',
      '#E64D6633',
      '#4DB38033',
      '#FF4D4D33',
      '#99E6E633',
      '#6666FF33',
    ];

    return baseColors[friendId % baseColors.length];
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
              <GuardingList
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
          //store the guardingLists data in an sqlite watermelon DB here
          navigation.navigate('HomeScreen');
        }}
      />
    </View>
  );
};

const GuardingList: React.FC<{
  timeIndex: number;
  list: {time: string; person: string; place: string; color: string}[];
  handlePersonLongPress: (guardingList: number, place: number) => void;
  selectedPerson: Person | null;
  personToSwap: Person | null;
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
      <GuardingListItem
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

const GuardingListItem: React.FC<{
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
  timeCell: {
    minWidth: 120,
    maxWidth: 120,
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

export default GuardingListEditScreen;
