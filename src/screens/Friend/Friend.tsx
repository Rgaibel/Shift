import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ImageBackground,
  SectionList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {useDispatch, useSelector} from 'react-redux';
import {addFriend, editFriend} from '../../redux/friendsSlice'; // Adjust the path
import {FriendsState} from '../../redux/friendsSlice';
import friendsData from '../../data/friendsData'; // Import hardcoded friends data

type Props = NativeStackScreenProps<RootStackParamList, 'Friend'>;

interface FriendData {
  id: number;
  firstName: string;
  lastName: string;
}

const Friend: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const friendsDataRedux =
    useSelector((state: FriendsState) => state.list) || friendsData;
  const [isModalVisible, setModalVisible] = useState(false);
  const [editedFriend, setEditedFriend] = useState<FriendData>({
    id: 0,
    firstName: '',
    lastName: '',
  });
  const [sortedFriends, setSortedFriends] = useState<FriendData[]>([]);

  useEffect(() => {
    // Sort friendsData alphabetically based on first name
    const sortedData = [...friendsDataRedux].sort((a, b) =>
      a.firstName.localeCompare(b.firstName),
    );
    setSortedFriends(sortedData);
  }, [friendsDataRedux]);

  const openModal = (friend: any) => {
    console.log(friend);
    setEditedFriend(friend);
    setModalVisible(true);
  };

  const closeModal = () => {
    console.log('bye');
    setModalVisible(false);
  };

  const handleSave = () => {
    // Dispatch action to add or edit friend in Redux store
    if (editedFriend.id === 0) {
      dispatch(addFriend(editedFriend));
    } else {
      dispatch(editFriend(editedFriend));
    }

    closeModal();
  };

  const renderFriendItem = ({item}: any) => (
    <View style={styles.friendItem}>
      <Text
        style={styles.friendText}>{`${item.firstName} ${item.lastName}`}</Text>
      <TouchableOpacity onPress={() => openModal(item)}>
        <Text style={styles.editButton}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({
    section: {title},
  }: {
    section: {title: string};
  }) => <Text style={styles.sectionHeader}>{title}</Text>;

  // Create sections based on the first letter of each name
  const sections = sortedFriends.reduce(
    (acc: Record<string, {title: string; data: FriendData[]}>, friend) => {
      const firstLetter = friend.firstName[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = {title: firstLetter, data: []};
      }
      acc[firstLetter].data.push(friend);
      return acc;
    },
    {},
  );

  const sectionData = Object.values(sections).sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/modern-background-connecting-lines-dots.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.mainContainer}>
          <Text style={styles.title}>Friends Screen</Text>
          {sortedFriends.length === 0 ? (
            <Text style={styles.emptyText}>No friends to display</Text>
          ) : (
            <SectionList
              sections={sectionData}
              keyExtractor={item => item.id.toString()}
              renderItem={renderFriendItem}
              renderSectionHeader={renderSectionHeader}
            />
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Friend</Text>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  value={editedFriend.firstName}
                  onChangeText={text =>
                    setEditedFriend({...editedFriend, firstName: text})
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={editedFriend.lastName}
                  onChangeText={text =>
                    setEditedFriend({...editedFriend, lastName: text})
                  }
                />
                <Button title="Save" onPress={handleSave} />
                <Button title="Cancel" onPress={closeModal} />
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#231F20',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
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
    color: '#fff',
  },
  editButton: {
    color: 'blue',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  sectionHeader: {
    backgroundColor: '#eee',
    padding: 8,
    fontSize: 18,
  },
});

export default Friend;
