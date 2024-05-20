import {useEffect, useState} from 'react';
import friendsData from './../data/friendsData'; // Import hardcoded friends data
import {generateUniqueColor} from './../utils/generateUniqueColor';
import {Alert} from 'react-native';
import {PersonIndex, Person} from '../types/guardingList';

type UseGuardingListProps = {
  selectedFriends: number[] | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  numCycles: string | undefined;
  locationList: string[] | undefined;
};

export const useGuardingList = ({
  selectedFriends = [],
  startDate,
  endDate,
  numCycles,
  locationList = [],
}: UseGuardingListProps) => {
  const [guardingLists, setGuardingLists] = useState<Person[][]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonIndex | null>(
    null,
  );
  const [personToSwap, setPersonToSwap] = useState<PersonIndex | null>(null);

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
            person: `${friendsData[friendId - 1].firstName} ${
              friendsData[friendId - 1].lastName
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
  }, [selectedFriends, startDate, endDate, numCycles, locationList]);

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
    location1: number,
    index1: number,
    location2: number,
    index2: number,
  ) => {
    const newGuardingLists = [...guardingLists];
    const tempColor = newGuardingLists[location1][index1].color;
    newGuardingLists[location1][index1].color =
      newGuardingLists[location2][index2].color;
    newGuardingLists[location2][index2].color = tempColor;

    const tempPerson = newGuardingLists[location1][index1].person;
    newGuardingLists[location1][index1].person =
      newGuardingLists[location2][index2].person;
    newGuardingLists[location2][index2].person = tempPerson;
    setGuardingLists(newGuardingLists);
    setSelectedPerson(null);
    setPersonToSwap(null);
  };

  return {guardingLists, handlePersonLongPress, personToSwap, selectedPerson};
};
