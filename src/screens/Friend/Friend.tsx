import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  SectionList,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {useDispatch, useSelector} from 'react-redux';
import {addFriend, editFriend} from '../../redux/friendsSlice';
import {AppState} from '../../store/reducers';
import friendsData from '../../data/friendsData';
import {colors, spacing, borderRadius, typography} from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Friend'>;

interface FriendData {
  id: number;
  firstName: string;
  lastName: string;
}

const Friend: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const friendsDataRedux =
    useSelector((state: AppState) => state.friends?.list) || friendsData;
  const [isModalVisible, setModalVisible] = useState(false);
  const [editedFriend, setEditedFriend] = useState<FriendData>({
    id: 0,
    firstName: '',
    lastName: '',
  });
  const [sortedFriends, setSortedFriends] = useState<FriendData[]>([]);

  useEffect(() => {
    const sortedData = [...friendsDataRedux].sort((a, b) =>
      a.firstName.localeCompare(b.firstName),
    );
    setSortedFriends(sortedData);
  }, [friendsDataRedux]);

  const openModal = (friend: any) => {
    setEditedFriend(friend);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditedFriend({
      id: 0,
      firstName: '',
      lastName: '',
    });
  };

  const handleSave = () => {
    if (editedFriend.firstName.trim() && editedFriend.lastName.trim()) {
      if (editedFriend.id === 0) {
        dispatch(addFriend(editedFriend));
      } else {
        dispatch(editFriend(editedFriend));
      }
      closeModal();
    }
  };

  const renderFriendItem = ({item}: any) => (
    <TouchableOpacity
      onPress={() => openModal(item)}
      activeOpacity={0.7}
      style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.firstName[0]}
            {item.lastName[0]}
          </Text>
        </View>
        <View>
          <Text style={styles.friendName}>
            {item.firstName} {item.lastName}
          </Text>
        </View>
      </View>
      <Text style={styles.editButton}>Edit</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section: {title},
  }: {
    section: {title: string};
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

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
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Friends</Text>
          <Text style={styles.subtitle}>
            {sortedFriends.length} friend{sortedFriends.length !== 1 ? 's' : ''}
          </Text>
        </View>
        {sortedFriends.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No friends to display</Text>
            <Text style={styles.emptySubtext}>
              Tap "Add Friend" to get started
            </Text>
          </View>
        ) : (
          <SectionList
            sections={sectionData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderFriendItem}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            openModal({
              id: 0,
              firstName: '',
              lastName: '',
            })
          }
          activeOpacity={0.8}>
          <Text style={styles.addButtonText}>+ Add Friend</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editedFriend.id === 0 ? 'Add Friend' : 'Edit Friend'}
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                placeholderTextColor={colors.textTertiary}
                value={editedFriend.firstName}
                onChangeText={text =>
                  setEditedFriend({...editedFriend, firstName: text})
                }
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                placeholderTextColor={colors.textTertiary}
                value={editedFriend.lastName}
                onChangeText={text =>
                  setEditedFriend({...editedFriend, lastName: text})
                }
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
                activeOpacity={0.7}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
                activeOpacity={0.8}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  sectionHeader: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  sectionHeaderText: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '600',
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.bodyBold,
    color: colors.background,
  },
  friendName: {
    ...typography.bodyBold,
  },
  editButton: {
    ...typography.body,
    color: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.h3,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  addButton: {
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
  addButtonText: {
    ...typography.bodyBold,
    color: colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
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
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    ...typography.bodyBold,
    color: colors.background,
  },
});

export default Friend;
