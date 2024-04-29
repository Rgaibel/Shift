// TimeParameterScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import CustomDateTimePicker from '../../customComponents/CustomDateTimePicker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'TimeParameterScreen'>;

const TimeParameterScreen: React.FC<Props> = ({navigation}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numCycles, setNumCycles] = useState('1');
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [locationList, setLocationList] = useState<string[]>(['']);

  const showStartDatePicker = () => {
    setStartDatePickerVisible(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisible(false);
  };

  const handleStartDateChange = (date: Date) => {
    // Automatically update both start and end dates
    setStartDate(date);
    setEndDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisible(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisible(false);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

  const handleAddInput = () => {
    setLocationList([...locationList, '']); // Adds a new input field initialized with an empty string
  };

  const handleRemoveInput = (index: number) => {
    const newList = locationList.filter((_, idx) => idx !== index);
    setLocationList(newList);
  };

  const navigateToGuardingListFriends = () => {
    navigation.navigate('GuardingListFriendsScreen', {
      startDate: startDate.toISOString(), // Convert to a string
      endDate: endDate.toISOString(),
      numCycles,
      locationList,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Start Date: {startDate.toLocaleString()}</Text>
      <Button title="Pick Start Date" onPress={showStartDatePicker} />

      <Text style={styles.label}>End Date: {endDate.toLocaleString()}</Text>
      <Button title="Pick End Date" onPress={showEndDatePicker} />

      <Text style={styles.label}>Number of Cycles:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={numCycles}
        onChangeText={text => setNumCycles(text)}
      />

      <Text style={styles.label}>Locations:</Text>
      {locationList.map((input, index) => (
        <View key={index} style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={'Location ' + (index + 1).toString()}
            value={input}
            onChangeText={text => {
              const newList = [...locationList];
              newList[index] = text;
              setLocationList(newList);
            }}
          />
          {locationList.length > 1 && (
            <TouchableOpacity
              onPress={() => handleRemoveInput(index)}
              style={styles.removeButton}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      <Button title="Add a location" onPress={handleAddInput} />

      <View style={{flex: 1, marginTop: 10}}>
        <Button
          color="green"
          title="OK"
          onPress={navigateToGuardingListFriends}
        />
      </View>

      <CustomDateTimePicker
        isVisible={isStartDatePickerVisible}
        value={startDate}
        mode="datetime"
        display="spinner"
        onDateChange={handleStartDateChange}
        onClose={hideStartDatePicker}
      />

      <CustomDateTimePicker
        isVisible={isEndDatePickerVisible}
        value={endDate}
        mode="datetime"
        display="spinner"
        onDateChange={handleEndDateChange}
        onClose={hideEndDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '60%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  removeButton: {
    backgroundColor: 'red',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
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
});

export default TimeParameterScreen;
