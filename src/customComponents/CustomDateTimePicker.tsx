// CustomDateTimePicker.tsx
import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export interface CustomDateTimePickerProps {
  isVisible: boolean;
  value: Date;
  mode: 'date' | 'time' | 'datetime'; // Adjust according to your use case
  display: 'default' | 'spinner' | 'calendar';
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  isVisible,
  value,
  mode,
  display,
  onDateChange,
  onClose,
}) => {
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode={mode}
      display={display}
      date={value}
      is24Hour
      onConfirm={date => {
        onDateChange(date);
        onClose();
      }}
      onCancel={onClose}
    />
  );
};

export default CustomDateTimePicker;
