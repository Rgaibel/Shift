// store.js
import {configureStore} from '@reduxjs/toolkit';
import friendsReducer from './friendsSlice';

const store = configureStore({
  reducer: {
    friends: friendsReducer,
  },
});

export default store;
