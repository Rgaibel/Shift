// friendsSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface FriendData {
  id: number;
  firstName: string;
  lastName: string;
}

export interface FriendsState {
  list: FriendData[];
}

const initialState: FriendsState = {
  list: [],
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addFriend: (state, action: PayloadAction<FriendData>) => {
      state.list.push(action.payload);
    },
    editFriend: (state, action: PayloadAction<FriendData>) => {
      const {id, firstName, lastName} = action.payload;
      const friendIndex = state.list.findIndex(friend => friend.id === id);
      if (friendIndex !== -1) {
        state.list[friendIndex] = {id, firstName, lastName};
      }
    },
    // Add other actions as needed (e.g., deleteFriend)
  },
});

export const {addFriend, editFriend} = friendsSlice.actions;
export default friendsSlice.reducer;
