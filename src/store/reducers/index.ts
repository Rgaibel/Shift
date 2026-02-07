// store/reducers/index.ts
import {combineReducers} from 'redux';
import exampleReducer from './exampleReducer';
import friendsReducer from '../../redux/friendsSlice';

const rootReducer = combineReducers({
  example: exampleReducer,
  friends: friendsReducer,
});

export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;
