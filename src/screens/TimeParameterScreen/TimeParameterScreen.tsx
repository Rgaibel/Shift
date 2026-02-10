// TimeParameterScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CustomDateTimePicker from '../../customComponents/CustomDateTimePicker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {colors, spacing, borderRadius, typography} from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TimeParameterScreen'>;

const TimeParameterScreen: React.FC<Props> = ({navigation}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [scheduleMode, setScheduleMode] = useState<
    'cycles' | 'maxGuardTime' | 'maxGuardTimeMinutes'
  >('cycles');
  const [numCycles, setNumCycles] = useState('1');
  const [maxGuardTimeHours, setMaxGuardTimeHours] = useState('2');
  const [maxGuardTimeMinutes, setMaxGuardTimeMinutes] = useState('120');
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
    setLocationList([...locationList, '']);
  };

  const handleRemoveInput = (index: number) => {
    const newList = locationList.filter((_, idx) => idx !== index);
    setLocationList(newList);
  };

  const navigateToGuardingListFriends = () => {
    navigation.navigate('GuardingListFriendsScreen', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      scheduleMode,
      numCycles: scheduleMode === 'cycles' ? numCycles : undefined,
      maxGuardTimeHours:
        scheduleMode === 'maxGuardTime' ? maxGuardTimeHours : undefined,
      maxGuardTimeMinutes:
        scheduleMode === 'maxGuardTimeMinutes'
          ? maxGuardTimeMinutes
          : undefined,
      locationList,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Schedule Configuration</Text>
        <Text style={styles.screenSubtitle}>
          Set up your guard duty schedule parameters
        </Text>

        {/* Date Selection Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Time Period</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>Start Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={showStartDatePicker}
                activeOpacity={0.7}>
                <Text style={styles.dateButtonText}>
                  {startDate.toLocaleDateString()}
                </Text>
                <Text style={styles.dateTimeText}>
                  {startDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>End Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={showEndDatePicker}
                activeOpacity={0.7}>
                <Text style={styles.dateButtonText}>
                  {endDate.toLocaleDateString()}
                </Text>
                <Text style={styles.dateTimeText}>
                  {endDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Schedule Mode Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Schedule Mode</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioOption,
                scheduleMode === 'cycles' && styles.radioOptionActive,
              ]}
              onPress={() => setScheduleMode('cycles')}
              activeOpacity={0.7}>
              <Text style={styles.radioLabel}>Cycles</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioOption,
                scheduleMode === 'maxGuardTime' && styles.radioOptionActive,
              ]}
              onPress={() => setScheduleMode('maxGuardTime')}
              activeOpacity={0.7}>
              <Text style={styles.radioLabel}>Hours</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioOption,
                scheduleMode === 'maxGuardTimeMinutes' &&
                  styles.radioOptionActive,
              ]}
              onPress={() => setScheduleMode('maxGuardTimeMinutes')}
              activeOpacity={0.7}>
              <Text style={styles.radioLabel}>Minutes</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            {scheduleMode === 'cycles' ? (
              <>
                <Text style={styles.fieldLabel}>Number of Cycles</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={numCycles}
                  onChangeText={text => setNumCycles(text)}
                  placeholder="1"
                  placeholderTextColor={colors.textTertiary}
                />
              </>
            ) : scheduleMode === 'maxGuardTime' ? (
              <>
                <Text style={styles.fieldLabel}>
                  Max Guard Time per Person (hours)
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  value={maxGuardTimeHours}
                  onChangeText={text => setMaxGuardTimeHours(text)}
                  placeholder="2.0"
                  placeholderTextColor={colors.textTertiary}
                />
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>
                  Max Guard Time per Person (minutes)
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={maxGuardTimeMinutes}
                  onChangeText={text => setMaxGuardTimeMinutes(text)}
                  placeholder="120"
                  placeholderTextColor={colors.textTertiary}
                />
              </>
            )}
          </View>
        </View>

        {/* Locations Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Locations</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddInput}
              activeOpacity={0.7}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {locationList.map((input, index) => (
            <View key={index} style={styles.locationRow}>
              <TextInput
                style={styles.locationInput}
                placeholder={`Location ${index + 1}`}
                placeholderTextColor={colors.textTertiary}
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
                  style={styles.removeButton}
                  activeOpacity={0.7}>
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={navigateToGuardingListFriends}
          activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomDateTimePicker
        isVisible={isStartDatePickerVisible}
        value={startDate}
        mode="datetime"
        display="calendar"
        onDateChange={handleStartDateChange}
        onClose={hideStartDatePicker}
      />

      <CustomDateTimePicker
        isVisible={isEndDatePickerVisible}
        value={endDate}
        mode="datetime"
        display="calendar"
        onDateChange={handleEndDateChange}
        onClose={hideEndDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  screenTitle: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  screenSubtitle: {
    ...typography.caption,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateField: {
    flex: 1,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  dateButton: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
  },
  dateButtonText: {
    ...typography.bodyBold,
    marginBottom: spacing.xs / 2,
  },
  dateTimeText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  inputContainer: {
    marginTop: spacing.md,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    color: colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  locationInput: {
    ...typography.body,
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  removeButton: {
    backgroundColor: colors.error,
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    ...typography.h2,
    color: colors.text,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: colors.background,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  radioOption: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 48,
  },
  radioOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
  },
  radioLabel: {
    ...typography.bodyBold,
    color: colors.text,
    textAlign: 'center',
  },
});

export default TimeParameterScreen;
