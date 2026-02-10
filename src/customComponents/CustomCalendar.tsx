import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, spacing, borderRadius, typography} from '../theme/colors';

interface CustomCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  currentDate,
  selectedDate,
  onDateSelect,
  minDate,
}) => {
  const [displayMonth, setDisplayMonth] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  );

  useEffect(() => {
    // Update display month when selectedDate changes
    setDisplayMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    );
  }, [selectedDate]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const isPastDate = (date: Date) => {
    if (!minDate) {
      return false;
    }
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const compareMinDate = new Date(minDate);
    compareMinDate.setHours(0, 0, 0, 0);
    return compareDate < compareMinDate;
  };

  const handleDatePress = (date: Date) => {
    if (!isPastDate(date)) {
      onDateSelect(date);
    }
  };

  const goToPreviousMonth = () => {
    setDisplayMonth(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setDisplayMonth(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1),
    );
  };

  const days = getDaysInMonth(displayMonth);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goToPreviousMonth}
          style={styles.navButton}
          activeOpacity={0.7}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {monthNames[displayMonth.getMonth()]} {displayMonth.getFullYear()}
        </Text>
        <TouchableOpacity
          onPress={goToNextMonth}
          style={styles.navButton}
          activeOpacity={0.7}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysOfWeekContainer}>
        {daysOfWeek.map(day => (
          <View key={day} style={styles.dayOfWeek}>
            <Text style={styles.dayOfWeekText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {days.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const isDisabled = isPastDate(date);

          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
                isTodayDate && !isSelected && styles.dayCellToday,
                isDisabled && styles.dayCellDisabled,
              ]}
              onPress={() => handleDatePress(date)}
              disabled={isDisabled}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                  isTodayDate && !isSelected && styles.dayTextToday,
                  isDisabled && styles.dayTextDisabled,
                ]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    width: '100%',
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  navButtonText: {
    ...typography.h2,
    color: colors.text,
    fontSize: 28,
    lineHeight: 32,
  },
  monthYear: {
    ...typography.h3,
    flex: 1,
    textAlign: 'center',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  dayOfWeek: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dayOfWeekText: {
    ...typography.label,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs / 2,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  dayText: {
    ...typography.body,
    color: colors.text,
  },
  dayTextSelected: {
    ...typography.bodyBold,
    color: colors.background,
  },
  dayTextToday: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  dayTextDisabled: {
    color: colors.textTertiary,
  },
});

export default CustomCalendar;
