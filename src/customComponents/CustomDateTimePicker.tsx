// CustomDateTimePicker.tsx
import React, {useState} from 'react';
import {View, StyleSheet, Modal, TouchableOpacity, Text} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomCalendar from './CustomCalendar';
import {colors, spacing, borderRadius, typography} from '../theme/colors';

export interface CustomDateTimePickerProps {
  isVisible: boolean;
  value: Date;
  mode: 'date' | 'time' | 'datetime';
  display?: 'default' | 'spinner' | 'calendar';
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  isVisible,
  value,
  mode,
  onDateChange,
  onClose,
}) => {
  const [currentDate, setCurrentDate] = useState(value);
  const [selectedDate, setSelectedDate] = useState(value);
  const [showNativeTimePicker, setShowNativeTimePicker] = useState(false);

  React.useEffect(() => {
    if (isVisible) {
      setCurrentDate(value);
      setSelectedDate(value);
      setShowNativeTimePicker(mode === 'time');
    } else {
      // Reset state when modal closes
      setShowNativeTimePicker(false);
    }
  }, [isVisible, value, mode]);

  const handleDateSelect = (date: Date) => {
    const newDate = new Date(date);
    // Preserve the time from currentDate if in datetime mode
    if (mode === 'datetime') {
      newDate.setHours(currentDate.getHours());
      newDate.setMinutes(currentDate.getMinutes());
      setCurrentDate(newDate);
      setSelectedDate(newDate);
      // Show time picker modal on top of calendar
      setShowNativeTimePicker(true);
    } else {
      setCurrentDate(newDate);
      setSelectedDate(newDate);
      onDateChange(newDate);
      handleClose();
    }
  };

  const handleTimeConfirm = (selectedTime: Date) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(selectedTime.getHours());
    newDate.setMinutes(selectedTime.getMinutes());
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
    setShowNativeTimePicker(false);
    // Update the parent with the new date/time
    onDateChange(newDate);
    // Close the main calendar modal
    handleClose();
  };

  const handleTimeCancel = () => {
    setShowNativeTimePicker(false);
    // Keep the calendar modal open so user can select a different date
  };

  const handleClose = () => {
    // Reset internal state first
    setShowNativeTimePicker(false);
    // Then notify parent to close modal
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'datetime'
                ? 'Select Date'
                : mode === 'date'
                ? 'Select Date'
                : 'Select Time'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {mode !== 'time' && (
            <View style={styles.calendarContainer}>
              <CustomCalendar
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </View>
          )}

          {mode === 'time' && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  onDateChange(currentDate);
                  handleClose();
                }}
                activeOpacity={0.8}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Native time picker modal - shown separately when needed */}
      <DateTimePickerModal
        isVisible={showNativeTimePicker}
        mode="time"
        date={currentDate}
        onConfirm={handleTimeConfirm}
        onCancel={handleTimeCancel}
        display="spinner"
        themeVariant="dark"
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '90%',
    minHeight: 400,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.round,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButtonText: {
    ...typography.h2,
    color: colors.text,
    lineHeight: 28,
    marginTop: -2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.md,
    flexGrow: 1,
  },
  calendarContainer: {
    paddingHorizontal: spacing.sm,
    width: '100%',
    paddingVertical: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
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
  confirmButtonText: {
    ...typography.bodyBold,
    color: colors.background,
  },
});

export default CustomDateTimePicker;
