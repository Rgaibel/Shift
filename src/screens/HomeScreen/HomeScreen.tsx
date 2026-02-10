// HomeScreen.tsx
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {RootState} from './../../store/types';
import {useSelector} from 'react-redux';
import {colors, spacing, borderRadius, typography} from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const navigateToTimeParameter = () => {
    navigation.navigate('TimeParameterScreen');
  };
  const data = useSelector((state: RootState) => state.example.data);
  console.log(data);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Shift Scheduler</Text>
        <Text style={styles.subtitle}>
          Create and manage guard duty schedules
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={navigateToTimeParameter}
          activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Create New Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    minWidth: 200,
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

export default HomeScreen;
