// // types.ts
// export interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// export interface Yard {
//   location: Coordinates;
//   radius: number;
//   id: number;
//   name: string;
// }

// export interface Gate {
//   batteryLevel: number;
//   gateID: string;
//   name: string;
//   receptionStrength: boolean;
//   satelliteStrength: boolean;
//   synced: boolean;
//   timeAdded: number;
// }

// export interface IRootState {
//   location: Coordinates;
//   gateList: Gate[];
//   yardList: Yard[];
//   currentYard: Yard | null;
//   inYard: boolean;
//   gateInScan: boolean;
// }

// // Initial state for each slice
// export const initialState: IRootState = {
//   location: {latitude: 0, longitude: 0},
//   gateList: [],
//   yardList: [],
//   currentYard: null,
//   inYard: false,
//   gateInScan: false,
// };
