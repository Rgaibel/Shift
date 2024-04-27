// scheduleGenerator.ts
import {PLACES, TIMES, PEOPLE} from './constants';

export interface GuardShift {
  time: string;
  place: string;
  person: string;
}

export const generateSchedule = (): GuardShift[][] => {
  return TIMES.map(time =>
    PLACES.map(place => ({
      time,
      place,
      person: PEOPLE[Math.floor(Math.random() * PEOPLE.length)],
    })),
  );
};
