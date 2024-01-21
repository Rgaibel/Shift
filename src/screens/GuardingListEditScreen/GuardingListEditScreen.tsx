import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, FlatList} from 'react-native';
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
  const {selectedFriends = [], startDate, endDate, numCycles} = route.params;
  const friendsDataRedux =
    useSelector((state: FriendsState) => state.list) || friendsData;
  const [guardingLists, setGuardingLists] = useState<
    {title: string; data: string[]}[]
  >([]);

  useEffect(() => {
    // Function to split selectedFriends into guarding lists
    const splitFriendsIntoLists = () => {
      const cycles = Number(numCycles);
      // Ensure numCycles is defined and is a number
      if (typeof cycles === 'number' && cycles > 0) {
        // Convert ISO string dates to Date objects
        const startDateTime = new Date(startDate ?? 0);
        const endDateTime = new Date(endDate ?? 0);

        const resultLists: {title: string; data: string[]}[] = [];

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

            return `${formattedStartTime} - ${
              friendsDataRedux[friendId - 1].firstName
            } ${friendsDataRedux[friendId - 1].lastName}`;
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

  const renderGuardingListItem = ({
    item,
  }: {
    item: {title: string; data: string[]};
  }) => (
    <View style={styles.guardingListItem}>
      <Text style={styles.guardingListTitle}>{item.title}</Text>
      {item.data.map((friend, friendIndex) => (
        <Text key={friendIndex} style={styles.friendText}>
          {friend}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={guardingLists}
        keyExtractor={(item, index) => `${index}`}
        renderItem={renderGuardingListItem}
      />
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
});

export default GuardingListEditScreen;
