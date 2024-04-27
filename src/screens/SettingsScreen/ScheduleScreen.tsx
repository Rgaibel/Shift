import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {generateSchedule} from './scheduleGenerator';
import {PLACES, TIMES} from './constants';

const ScheduleScreen = () => {
  const [schedule] = useState(generateSchedule());

  // Calculate row height dynamically
  const rowHeight = 65; // Example fixed row height, adjust as needed
  const headerHeight = 50; // Height for the header, slightly larger
  const totalHeight = headerHeight + rowHeight * PLACES.length; // Total height calculation

  return (
    <View style={[styles.container, {maxHeight: totalHeight}]}>
      <View style={styles.fixedColumn}>
        <Text style={[styles.headerCell, {height: headerHeight}]}>
          Place / Time
        </Text>
        {PLACES.map(place => (
          <Text key={place} style={[styles.positionCell, {height: rowHeight}]}>
            {place}
          </Text>
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <View>
          <View style={styles.row}>
            {TIMES.map(time => (
              <Text key={time} style={[styles.header, {height: headerHeight}]}>
                {time}
              </Text>
            ))}
          </View>
          {PLACES.map((_, placeIndex) => (
            <View key={PLACES[placeIndex]} style={styles.row}>
              {schedule.map(timeSlot => (
                <Text
                  key={timeSlot[placeIndex].time}
                  style={[styles.cell, {height: rowHeight}]}>
                  {timeSlot[placeIndex].person}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#F0F4F8', // Light background color for contrast
  },
  fixedColumn: {
    // paddingHorizontal: 10, // Adjusted for spacing
    backgroundColor: '#ffffff', // White background to stand out
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerCell: {
    fontWeight: '600', // Slightly bolder
    color: '#333', // Dark text for contrast
    padding: 15,
    backgroundColor: 'yellow', // Subtle background color for header
    // borderTopRightRadius: 20, // Rounded corners for the top header cell
    // borderTopLeftRadius: 20,
  },
  header: {
    fontWeight: '600',
    color: '#333',
    padding: 15,
    backgroundColor: '#E1E8EE', // Consistent with headerCell
    minWidth: 130, // Slightly wider for better layout
    textAlign: 'center', // Center-align text
    borderRightWidth: 0, // Removing border for a cleaner look
  },
  cell: {
    color: '#4F4F4F', // Darker text for better readability
    padding: 15,
    minWidth: 130, // Consistent with header
    textAlign: 'center', // Center-align text
    backgroundColor: '#FFFFFF', // White cells to stand out against background
    marginBottom: 2, // Space between rows
    borderRightWidth: 0, // Removing border for a cleaner look
    flexWrap: 'wrap',
    maxWidth: 130,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0, // Removing border for a cleaner look
  },
  positionCell: {
    color: 'pink', // You can adjust the color as needed
    padding: 15,
    minWidth: 120, // Consistent with other cells
    textAlign: 'left', // Align text to the left
    backgroundColor: '#FFFFFF', // Keeping the cell background consistent
  },
});

export default ScheduleScreen;
