// // reducer.ts
// import {IRootState, initialState} from './types';
// import {
//   SET_LOCATION,
//   SET_GATELIST,
//   SYNC_GATE,
//   REMOVE_TIMEDOUT_GATEWAY,
//   UPDATE_SCAN_TIME_OF_GATEWAY,
//   SET_CURRENT_YARD,
//   SET_YARDLIST,
//   SET_GATEINSCAN,
// } from './actionTypes';

// const rootReducer = (
//   state: IRootState = initialState,
//   action: any,
// ): IRootState => {
//   switch (action.type) {
//     case SET_LOCATION.SUCCESS:
//       return {...state, location: action.payload};

//     case SET_GATELIST.SUCCESS:
//       return {...state, gateList: [...state.gateList, action.payload]};

//     case SYNC_GATE.SUCCESS:
//       // Update the synced gate in the gateList
//       return {
//         ...state,
//         gateList: state.gateList.map(gate =>
//           gate.gateID === action.payload.gateID
//             ? {...gate, synced: true}
//             : gate,
//         ),
//       };

//     case UPDATE_SCAN_TIME_OF_GATEWAY.SUCCESS:
//       // Update the scan time of a specific gateway in the gateList
//       return {
//         ...state,
//         gateList: state.gateList.map(gate =>
//           gate.gateID === action.payload.gateID
//             ? {...gate, scanTime: action.payload.scanTime}
//             : gate,
//         ),
//       };

//     case REMOVE_TIMEDOUT_GATEWAY.SUCCESS:
//       // Remove timed out gateways from the gateList
//       return {
//         ...state,
//         gateList: state.gateList.filter(gate => !gate.gateID),
//       };

//     case SET_CURRENT_YARD.SUCCESS:
//       return {...state, currentYard: action.payload};

//     case SET_YARDLIST.SUCCESS:
//       return {...state, yardList: action.payload};

//     case SET_GATEINSCAN.SUCCESS:
//       return {...state, gateInScan: action.payload};

//     default:
//       return state;
//   }
// };

// export default rootReducer;
