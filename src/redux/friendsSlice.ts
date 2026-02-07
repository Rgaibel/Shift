import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import friendsData from '../data/friendsData';

export interface Friend {
  id: number;
  firstName: string;
  lastName: string;
}

export interface FriendsState {
  list: Friend[];
}

const initialState: FriendsState = {
  list: friendsData,
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addFriend: (state, action: PayloadAction<Friend>) => {
      const newFriend = {
        ...action.payload,
        id:
          state.list.length > 0
            ? Math.max(...state.list.map(f => f.id)) + 1
            : 1,
      };
      state.list.push(newFriend);
    },
    editFriend: (state, action: PayloadAction<Friend>) => {
      const index = state.list.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteFriend: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(f => f.id !== action.payload);
    },
  },
});

export const {addFriend, editFriend, deleteFriend} = friendsSlice.actions;
export default friendsSlice.reducer;
