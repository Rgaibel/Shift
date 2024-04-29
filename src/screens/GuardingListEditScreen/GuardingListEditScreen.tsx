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

  console.log(JSON.stringify(guardingLists));

  const uniqueTimesPerList = guardingLists.map(list => {
    const uniqueTimes = Array.from(new Set(list.data.map(item => item.time)));
    return {
      title: list.title,
      time: uniqueTimes,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.cell, {minWidth: 120, maxWidth: 120}]}>
          Time/Place
        </Text>
        {locationList.map((place, index) => (
          <Text
            key={index}
            style={[styles.cell, {flex: 1, textAlign: 'center'}]}>
            {place}
          </Text>
        ))}
      </View>
      <ScrollView style={{flex: 1}}>
        {guardingLists.map((list, index) => (
          <View
            key={index}
            style={[styles.cell, {flex: 1, flexDirection: 'column'}]}>
            <Text style={styles.title}>{list.title}</Text>
            {uniqueTimesPerList
              .find(obj => list.title === obj.title)
              ?.time.map((time, idx) => (
                <View key={idx} style={styles.row}>
                  <Text style={[styles.cell, {minWidth: 110, maxWidth: 110}]}>
                    {time}
                  </Text>
                  {list.data.map((item, idx) =>
                    item.time === time ? (
                      <Text
                        key={idx}
                        style={[styles.cell, {flex: 1, textAlign: 'center'}]}>
                        {item.person}
                      </Text>
                    ) : null,
                  )}
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
