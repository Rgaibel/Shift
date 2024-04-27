import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {FriendsState} from '../../redux/friendsSlice';
import friendsData from '../../data/friendsData'; // Import hardcoded friends data
import {useSelector} from 'react-redux';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'GuardingListEditScreen'
>;

const GuardingListEditScreen: React.FC<Props> = ({route, navigation}) => {
  const {
    selectedFriends = [],
    startDate,
    endDate,
    numCycles,
    locationList = [],
  } = route.params;
  console.log('selectedFriends: ', selectedFriends);
  console.log('location List: ', locationList);
  const friendsDataRedux =
    useSelector((state: FriendsState) => state.list) || friendsData;
  console.log('friends: ', friendsDataRedux);
  const [guardingLists, setGuardingLists] = useState<
    {title: string; data: {time: string; name: string}[]}[]
  >([]);

  const friendList = selectedFriends.map(friendId => {
    return `${friendsDataRedux[friendId - 1].firstName} ${
      friendsDataRedux[friendId - 1].lastName
    }`;
  });
  console.log('friendList: ', friendList);

  useEffect(() => {
    // Function to split selectedFriends into guarding lists
    const splitFriendsIntoLists = () => {
      const cycles = Number(numCycles);
      // Ensure numCycles is defined and is a number
      if (typeof cycles === 'number' && cycles > 0) {
        // Convert ISO string dates to Date objects
        const startDateTime = new Date(startDate ?? 0);
        const endDateTime = new Date(endDate ?? 0);

        const resultLists: {
          title: string;
          data: {time: string; name: string}[];
        }[] = [];

        // Calculate total minutes between start and end dates
        const totalMinutes =
          (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
        // Calculate minutes per cycle
        const minutesPerCycle = totalMinutes / cycles;
        const minutesPerShift = minutesPerCycle / selectedFriends.length;

        for (let i = 0; i < cycles; i++) {
          const currentList = selectedFriends.map((friendId, friendIndex) => {
            // Calculate the start time for each friend
            const startTime = new Date(
              startDateTime.getTime() +
                (i * minutesPerCycle + friendIndex * minutesPerShift) * 60000,
            );

            const formattedStartTime = startTime.toLocaleTimeString([], {
              // year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              // second: '2-digit',
            });

            return {
              time: formattedStartTime,
              name:
                friendsDataRedux[friendId - 1].firstName +
                ' ' +
                friendsDataRedux[friendId - 1].lastName,
            };
          });

          resultLists.push({
            title: `Guarding List ${i + 1}`,
            data: currentList,
          });
        }

        return resultLists;
      } else {
        // Handle the case when cycles is undefined or not a number
        return [];
      }
    };

    // Set guarding lists when the component mounts
    setGuardingLists(splitFriendsIntoLists());
  }, [selectedFriends, startDate, endDate, numCycles, friendsDataRedux]);

  console.log('--->', JSON.stringify(guardingLists));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.cell, {minWidth: 100}]}>Time</Text>
        {locationList.map((place, index) => (
          <Text
            key={index}
            style={[styles.cell, {flex: 1, textAlign: 'center'}]}>
            {place}
          </Text>
        ))}
      </View>
      <ScrollView>
        {guardingLists.map((list, index) => (
          <View key={index} style={styles.listContainer}>
            <Text style={styles.title}>{list.title}</Text>
            {list.data.map((item, idx) => (
              <View key={idx} style={styles.row}>
                <Text style={[styles.cell, {flex: 1}]}>{item.time}</Text>
                <Text style={[styles.cell, {flex: 1}]}>{item.name}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <Button
        title="Go Home"
        onPress={() => navigation.navigate('HomeScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  guardingListItem: {
    marginBottom: 16,
  },
  guardingListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  friendText: {
    fontSize: 16,
    color: '#000', // Change text color as needed
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
  listContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F0F0F0', // A light gray background
    borderRadius: 5,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default GuardingListEditScreen;
