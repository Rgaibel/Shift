import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {useDispatch} from 'react-redux';
import {useGuardingList} from '../../customHooks/useGuardingList';
import {CustomGuardingList} from '../../customComponents/CustomGuardingList';
import {colors, spacing, borderRadius, typography} from '../../theme/colors';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'GuardingListEditScreen'
>;

const GuardingListEditScreen: React.FC<Props> = ({route, navigation}) => {
  const {
    selectedFriends = [],
    startDate,
    endDate,
    numCycles = '',
    scheduleMode,
    maxGuardTimeHours,
    maxGuardTimeMinutes,
    locationList = [],
  } = route.params;

  const {guardingLists, handlePersonLongPress, personToSwap, selectedPerson} =
    useGuardingList({
      selectedFriends,
      startDate,
      endDate,
      numCycles,
      scheduleMode,
      maxGuardTimeHours,
      maxGuardTimeMinutes,
      locationList,
    });

  const dispatch = useDispatch();

  const setData = (newData: any) => {
    dispatch({type: 'SET_DATA', payload: newData});
  };

  const handleSave = () => {
    setData(guardingLists);
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule Preview</Text>
        <Text style={styles.subtitle}>
          Long press on a person to swap assignments
        </Text>
      </View>
      <ScrollView horizontal style={styles.horizontalScroll}>
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
              <CustomGuardingList
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
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSave}
          activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Save Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  horizontalScroll: {
    flex: 1,
  },
  listContainer: {
    flexDirection: 'column',
    minWidth: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingVertical: spacing.md,
  },
  cell: {
    padding: spacing.md,
    textAlign: 'left',
    minWidth: 140,
    maxWidth: 140,
    color: colors.text,
  },
  headerCell: {
    ...typography.bodyBold,
    textAlign: 'center',
    color: colors.text,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
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
});

export default GuardingListEditScreen;
