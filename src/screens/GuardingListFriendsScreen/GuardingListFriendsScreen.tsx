import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {useSelector} from 'react-redux';
import {FriendsState} from '../../redux/friendsSlice';
import friendsData from '../../data/friendsData'; // Import hardcoded friends data

type Props = NativeStackScreenProps<
  RootStackParamList,
  'GuardingListFriendsScreen'
>;

const GuardingListFriendsScreen: React.FC<Props> = ({route, navigation}) => {
  const {startDate, endDate, numCycles} = route.params;
  const friendsDataRedux =
    useSelector((state: FriendsState) => state.list) || friendsData;
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  const createGuardingList = () => {
    navigation.navigate('GuardingListEditScreen', {
      selectedFriends,
      startDate,
      endDate,
      numCycles,
    });
  };

  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriends(prevSelectedFriends =>
      prevSelectedFriends.includes(friendId)
        ? prevSelectedFriends.filter(id => id !== friendId)
        : [...prevSelectedFriends, friendId],
    );
  };

  const renderFriendItem = ({
    item,
  }: {
    item: {id: number; firstName: string; lastName: string};
  }) => (
    <TouchableOpacity onPress={() => toggleFriendSelection(item.id)}>
      <View style={styles.friendItem}>
        <Text
          style={
            styles.friendText
          }>{`${item.firstName} ${item.lastName}`}</Text>
        <CheckBox
          checked={selectedFriends.includes(item.id)}
          onPress={() => toggleFriendSelection(item.id)}
          containerStyle={styles.checkBoxContainer}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Start Date: {startDate ? new Date(startDate).toLocaleString() : 'N/A'}
      </Text>
      <Text style={styles.label}>
        End Date: {endDate ? new Date(endDate).toLocaleString() : 'N/A'}
      </Text>

      <FlatList
        data={friendsDataRedux}
        keyExtractor={item => item.id.toString()}
        renderItem={renderFriendItem}
      />

      <Button title="Create" onPress={createGuardingList} />
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
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  checkBoxContainer: {
    marginLeft: 'auto', // This will move the checkbox to the right
  },
});

export default GuardingListFriendsScreen;
