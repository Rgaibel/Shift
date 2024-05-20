// store/index.ts
import {createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
// import {Provider} from 'react-redux';
import rootReducer from './reducers';
import {MMKVStorage} from '../storage/mmkvStorage';
// import {RootState} from './types';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: MMKVStorage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = createStore(persistedReducer);

// Create the persisted store
const persistor = persistStore(store);

export {store, persistor};
