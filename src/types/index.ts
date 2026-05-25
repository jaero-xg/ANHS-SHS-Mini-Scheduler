export interface Faculty {
  id: string;
  name: string;
  type: 'adviser' | 'floating';
}

export interface Class {
  id: string;
  name: string;
  year: string;
  section: string;
  adviserId: string;
}

export interface Room {
  id: string;
  name: string;
  ownerId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  isPE: boolean;
  isValues: boolean;
}

export interface Assignment {
  id: string;
  subjectId: string;
  facultyId: string;
  classId: string;
}

export interface ScheduleEntry {
  assignmentId: string | null;
  subjectId: string;
  facultyId: string;
  roomId: string | null;
  isValues?: boolean;
  isVacancy?: boolean;
}

export interface DaySchedule {
  [time: string]: ScheduleEntry | null;
}

export interface ClassSchedule {
  [day: string]: DaySchedule;
}

export interface Schedule {
  [classId: string]: ClassSchedule;
}

export interface AppData {
  faculty: Faculty[];
  classes: Class[];
  rooms: Room[];
  subjects: Subject[];
  assignments: Assignment[];
  schedule: Schedule;
}