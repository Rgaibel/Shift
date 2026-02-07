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
  scheduleMode?: 'cycles' | 'maxGuardTime';
  maxGuardTimeHours?: string;
  locationList: string[] | undefined;
};

export const useGuardingList = ({
  selectedFriends = [],
  startDate,
  endDate,
  numCycles,
  scheduleMode = 'cycles',
  maxGuardTimeHours,
  locationList = [],
}: UseGuardingListProps) => {
  const [guardingLists, setGuardingLists] = useState<Person[][]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonIndex | null>(
    null,
  );
  const [personToSwap, setPersonToSwap] = useState<PersonIndex | null>(null);

  useEffect(() => {
    const splitFriendsIntoLists = () => {
      const startDateTime = new Date(startDate ?? 0);
      const endDateTime = new Date(endDate ?? 0);

      const resultLists = [];

      const totalMinutes =
        (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);

      // Calculate how many time slots we need per cycle
      // When there are multiple locations, we need fewer slots because each slot covers all locations
      // Each person guards once total
      // Number of slots = number of people / number of locations (rounded up)
      const peoplePerLocation = Math.ceil(
        selectedFriends.length / locationList.length,
      );
      const slotsPerCycle = peoplePerLocation;

      let cycles: number;
      let minutesPerSlot: number;
      let minutesPerCycle: number;

      if (scheduleMode === 'maxGuardTime') {
        // Max Guard Time Mode: Calculate cycles from max guard time
        const maxGuardTimeMinutes = Number(maxGuardTimeHours);
        if (isNaN(maxGuardTimeMinutes) || maxGuardTimeMinutes <= 0) {
          throw new Error('Invalid max guard time. Must be greater than 0.');
        }

        minutesPerSlot = maxGuardTimeMinutes * 60;
        minutesPerCycle = minutesPerSlot * slotsPerCycle;
        cycles = Math.ceil(totalMinutes / minutesPerCycle);

        if (cycles <= 0) {
          throw new Error(
            'Calculated cycles would be 0 or negative. Please adjust the max guard time or time period.',
          );
        }
      } else {
        // Cycles Mode: Use existing logic
        cycles = Number(numCycles);
        if (isNaN(cycles) || cycles <= 0) {
          throw new Error('Invalid number of cycles');
        }

        minutesPerCycle = totalMinutes / cycles;
        minutesPerSlot = minutesPerCycle / slotsPerCycle;
      }

      for (let cycleIndex = 0; cycleIndex < cycles; cycleIndex++) {
        for (let slotIndex = 0; slotIndex < slotsPerCycle; slotIndex++) {
          // Calculate the start time for this slot
          const slotStartTime = new Date(
            startDateTime.getTime() +
              (cycleIndex * minutesPerCycle + slotIndex * minutesPerSlot) *
                60000,
          );

          const formattedTime = slotStartTime.toLocaleTimeString([], {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          // Create a list entry for all locations at this time slot
          // Each location gets one person assigned
          const currentList = locationList.map((location, locationIndex) => {
            // Calculate which person guards this location at this time slot
            // People are distributed: first N go to location 0, next N to location 1, etc.
            // At each time slot, assign one person per location
            // Formula: personIndex = slotIndex * numLocations + locationIndex
            const personIndexForSlot =
              slotIndex * locationList.length + locationIndex;

            // Only assign if we have a person for this slot and location
            if (personIndexForSlot < selectedFriends.length) {
              const friendIndex =
                (cycleIndex * selectedFriends.length + personIndexForSlot) %
                selectedFriends.length;
              const friendId = selectedFriends[friendIndex];
              return {
                time: formattedTime,
                person: `${friendsData[friendId - 1].firstName} ${
                  friendsData[friendId - 1].lastName
                }`,
                place: location,
                color: generateUniqueColor(friendId),
              };
            } else {
              // No more people to assign
              return {
                time: formattedTime,
                person: '',
                place: location,
                color: '#CCCCCC',
              };
            }
          });

          resultLists.push(currentList);
        }
      }

      return resultLists;
    };

    setGuardingLists(splitFriendsIntoLists());
  }, [
    selectedFriends,
    startDate,
    endDate,
    numCycles,
    scheduleMode,
    maxGuardTimeHours,
    locationList,
  ]);

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
