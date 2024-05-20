// store/reducers/exampleReducer.ts
import {Reducer} from 'redux';
import {ExampleState} from '../types';

const initialState: ExampleState = {
  data: null,
};

const exampleReducer: Reducer<ExampleState> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'SET_DATA':
      return {...state, data: action.payload};
    default:
      return state;
  }
};

export default exampleReducer;
