// TimeParameterScreen.tsx
import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';
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

  const navigateToGuardingListFriends = () => {
    navigation.navigate('GuardingListFriendsScreen', {
      startDate: startDate.toISOString(), // Convert to a string
      endDate: endDate.toISOString(),
      numCycles,
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

      <Button title="OK" onPress={navigateToGuardingListFriends} />

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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default TimeParameterScreen;
