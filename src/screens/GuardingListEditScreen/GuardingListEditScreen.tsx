import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, FlatList} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'GuardingListEditScreen'
>;

const GuardingListEditScreen: React.FC<Props> = ({route, navigation}) => {
  const {selectedFriends = [], startDate, endDate, numCycles} = route.params;

  const [guardingLists, setGuardingLists] = useState<
    {title: string; data: string[]}[]
  >([]);

  useEffect(() => {
    // Function to split selectedFriends into guarding lists
    const splitFriendsIntoLists = () => {
      // Ensure numCycles is defined and is a number
      if (typeof numCycles === 'number' && numCycles > 0) {
        // Convert ISO string dates to Date objects
        const startDateTime = new Date(startDate ?? 0);
        const endDateTime = new Date(endDate ?? 0);

        const friendsPerCycle = Math.ceil(selectedFriends.length / numCycles);

        console.log(selectedFriends);

        const resultLists: {title: string; data: string[]}[] = [];
        let currentIndex = 0;

        // Calculate total minutes between start and end dates
        const totalMinutes =
          (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);

        for (let i = 0; i < numCycles; i++) {
          // Calculate minutes per cycle
          const minutesPerCycle = totalMinutes / numCycles;

          // Calculate minutes per friend
          const minutesPerFriend = minutesPerCycle / friendsPerCycle;

          const currentList = selectedFriends
            .slice(currentIndex, currentIndex + friendsPerCycle)
            .map((friendId, friendIndex) => {
              // Calculate the start time for each friend
              const startTime = new Date(
                startDateTime.getTime() +
                  i * minutesPerCycle +
                  friendIndex * minutesPerFriend,
              );
              const formattedStartTime = startTime.toLocaleTimeString();

              // You can get friend details from your Redux state
              // For now, just use the friendId as a placeholder
              return `Friend ${friendId} - ${formattedStartTime}`;
            });

          console.log(currentList);
          resultLists.push({
            title: `Guarding List ${i + 1}`,
            data: currentList,
          });
          currentIndex += friendsPerCycle;
        }

        return resultLists;
      } else {
        // Handle the case when numCycles is undefined or not a number
        return [];
      }
    };

    // Set guarding lists when the component mounts
    setGuardingLists(splitFriendsIntoLists());
  }, [selectedFriends, startDate, endDate, numCycles]);

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
