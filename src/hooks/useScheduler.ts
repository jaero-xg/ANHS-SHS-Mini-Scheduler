import { useData } from '../context/DataContext';
import { days, workingSlots } from '../constants/scheduleConstants';
import type { Schedule, ClassSchedule, ScheduleEntry } from '../types';

export function useScheduler() {
  const { data, saveData } = useData();

  function generateSchedule(): string | null {
    if (!data.assignments.length)
      return 'Please add subject assignments first in the Setup tab.';
    if (!data.rooms.length)
      return 'Please add at least one room first.';

    const schedule: Schedule = {};

    data.classes.forEach((cls) => {
      schedule[cls.id] = {} as ClassSchedule;
      days.forEach((day) => {
        schedule[cls.id][day] = {};
        workingSlots.forEach((slot) => {
          schedule[cls.id][day][slot.time] = null;
        });
      });
    });

    // ── Usage trackers ───────────────────────────────────────────────
    const facultyUsage: Record<string, Record<string, Set<string>>> = {};
    const facultyHasEarly: Record<string, boolean> = {};

    data.faculty.forEach((f) => {
      facultyUsage[f.id] = {};
      facultyHasEarly[f.id] = false;
      days.forEach((day) => {
        facultyUsage[f.id][day] = new Set();
      });
    });

    const roomUsage: Record<string, Record<string, Set<string>>> = {};
    data.rooms.forEach((r) => {
      roomUsage[r.id] = {};
      days.forEach((day) => {
        roomUsage[r.id][day] = new Set();
      });
    });

    function isBlockedByConstraint(facultyId: string, slotTime: string): boolean {
      if (slotTime === '4:00-5:00' && facultyHasEarly[facultyId]) return true;
      if (slotTime === '7:30-8:30') {
        const hasLate = days.some((d) =>
          facultyUsage[facultyId][d].has('4:00-5:00')
        );
        if (hasLate) return true;
      }
      return false;
    }

    function markUsed(facultyId: string, roomId: string | null, day: string, slotTime: string) {
      facultyUsage[facultyId][day].add(slotTime);
      if (roomId) roomUsage[roomId][day].add(slotTime);
      if (slotTime === '7:30-8:30') facultyHasEarly[facultyId] = true;
    }

    const classAssignments: Record<string, typeof data.assignments> = {};
    data.classes.forEach((c) => (classAssignments[c.id] = []));
    data.assignments.forEach((a) => {
      if (classAssignments[a.classId]) classAssignments[a.classId].push(a);
    });

    data.classes.forEach((cls) => {
      const assignments = classAssignments[cls.id];
      if (!assignments?.length) return;

      const adviser = data.faculty.find((f) => f.id === cls.adviserId);
      const adviserRoom = adviser
        ? data.rooms.find((r) => r.ownerId === adviser.id)
        : null;

      assignments.forEach((a) => {
        const subject = data.subjects.find((s) => s.id === a.subjectId);
        if (!subject) return;

        const availableDays = subject.isPE ? ['Wednesday'] : [...days];
        const targetDays = subject.isPE ? 1 : 4;

        let scheduledCount = 0;
        let preferredSlot: string | null = null;

        for (const day of availableDays) {
          if (scheduledCount >= targetDays) break;

          let facultyRoom =
            data.rooms.find((r) => r.ownerId === a.facultyId) ||
            (data.rooms.length ? data.rooms[0] : null);

          for (const slot of workingSlots) {
            if (schedule[cls.id][day][slot.time]) continue;
            if (facultyUsage[a.facultyId][day].has(slot.time)) continue;
            if (facultyRoom && roomUsage[facultyRoom.id][day].has(slot.time)) continue;
            if (isBlockedByConstraint(a.facultyId, slot.time)) continue;

            if (
              slot.time === '7:30-8:30' &&
              adviser &&
              cls.adviserId === a.facultyId
            ) {
              if (adviserRoom && facultyRoom && adviserRoom.id !== facultyRoom.id)
                facultyRoom = adviserRoom;
            }

            if (preferredSlot !== null && slot.time !== preferredSlot) {
              const prefFree =
                !schedule[cls.id][day][preferredSlot] &&
                !facultyUsage[a.facultyId][day].has(preferredSlot) &&
                (!facultyRoom || !roomUsage[facultyRoom.id][day].has(preferredSlot)) &&
                !isBlockedByConstraint(a.facultyId, preferredSlot);
              if (prefFree) continue;
            }

            if (preferredSlot === null) preferredSlot = slot.time;

            schedule[cls.id][day][slot.time] = {
              assignmentId: a.id,
              subjectId: a.subjectId,
              facultyId: a.facultyId,
              roomId: facultyRoom ? facultyRoom.id : null,
            } as ScheduleEntry;

            markUsed(a.facultyId, facultyRoom ? facultyRoom.id : null, day, slot.time);
            scheduledCount++;
            break;
          }
        }
      });

      // ── Values — auto-schedule on Friday ────────────────────────────
      const valuesSubjects = data.subjects.filter((s) => s.isValues);
      valuesSubjects.forEach((vs) => {
        if (!adviser) return;
        const adviserRoomForValues = data.rooms.find((r) => r.ownerId === adviser.id);
        if (!adviserRoomForValues) return;

        const day = 'Friday';
        for (const slot of workingSlots) {
          if (schedule[cls.id][day][slot.time]) continue;
          if (facultyUsage[adviser.id][day].has(slot.time)) continue;
          if (roomUsage[adviserRoomForValues.id][day].has(slot.time)) continue;
          if (isBlockedByConstraint(adviser.id, slot.time)) continue;

          schedule[cls.id][day][slot.time] = {
            assignmentId: null,
            subjectId: vs.id,
            facultyId: adviser.id,
            roomId: adviserRoomForValues.id,
            isValues: true,
          };

          markUsed(adviser.id, adviserRoomForValues.id, day, slot.time);
          break;
        }
      });

      // ── Fill vacancies (never on Monday) ────────────────────────────
      days.forEach((day) => {
        if (day === 'Monday') return;
        const emptySlots = workingSlots.filter(
          (s) => !schedule[cls.id][day][s.time]
        );
        const numVac = Math.min(2, emptySlots.length);
        for (let i = 0; i < numVac; i++) {
          const pick = emptySlots[Math.floor(Math.random() * emptySlots.length)];
          schedule[cls.id][day][pick.time] = { isVacancy: true } as ScheduleEntry;
          emptySlots.splice(emptySlots.indexOf(pick), 1);
        }
      });
    });

    saveData({ ...data, schedule });
    return null; // null = no error
  }

  function clearSchedule(): void {
    saveData({ ...data, schedule: {} });
  }

  return { generateSchedule, clearSchedule };
}