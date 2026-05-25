export interface TimeSlot {
  time: string;
  period: 'morning' | 'afternoon' | 'break';
}

export const timeSlots: TimeSlot[] = [
  { time: '7:30-8:30',   period: 'morning' },
  { time: '8:30-9:30',   period: 'morning' },
  { time: '9:30-9:45',   period: 'break' },
  { time: '9:45-10:45',  period: 'morning' },
  { time: '10:45-11:45', period: 'morning' },
  { time: '1:00-2:00',   period: 'afternoon' },
  { time: '2:00-3:00',   period: 'afternoon' },
  { time: '3:00-4:00',   period: 'afternoon' },
  { time: '4:00-5:00',   period: 'afternoon' },
];

export const days: string[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
];

export const workingSlots: TimeSlot[] = timeSlots.filter(
  (s) => s.period !== 'break'
);