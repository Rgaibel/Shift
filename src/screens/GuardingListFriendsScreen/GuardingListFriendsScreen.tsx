import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import friendsData from '../../data/friendsData';
import {colors, spacing, borderRadius, typography} from '../../theme/colors';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'GuardingListFriendsScreen'
>;

const GuardingListFriendsScreen: React.FC<Props> = ({route, navigation}) => {
  const {...params} = route.params;
  const friendsDataRedux = friendsData;
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  const createGuardingList = () => {
    if (selectedFriends.length === 0) {
      return;
    }
    navigation.navigate('GuardingListEditScreen', {
      selectedFriends,
      ...params,
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
  }) => {
    const isSelected = selectedFriends.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleFriendSelection(item.id)}
        activeOpacity={0.7}>
        <View
          style={[styles.friendItem, isSelected && styles.friendItemSelected]}>
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
          <View style={styles.checkboxContainer}>
            <View
              style={[
                styles.customCheckbox,
                isSelected && styles.customCheckboxSelected,
              ]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Participants</Text>
        <Text style={styles.subtitle}>
          {selectedFriends.length} of {friendsDataRedux.length} selected
        </Text>
      </View>
      <FlatList
        data={friendsDataRedux}
        keyExtractor={item => item.id.toString()}
        renderItem={renderFriendItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            selectedFriends.length === 0 && styles.primaryButtonDisabled,
          ]}
          onPress={createGuardingList}
          disabled={selectedFriends.length === 0}
          activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>
            Create Schedule ({selectedFriends.length})
          </Text>
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
  listContent: {
    padding: spacing.md,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  friendItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
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
  checkboxContainer: {
    marginLeft: spacing.md,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
  },
  customCheckboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
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
  primaryButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: colors.background,
  },
});

export default GuardingListFriendsScreen;
