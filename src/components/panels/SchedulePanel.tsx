import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useScheduler } from "../../hooks/useScheduler";
import {
  exportClassDocx,
  exportAllDocx,
  exportFacultyDocx,
  exportAllFacultyDocx,
} from "../../utils/exportUtils";
import { timeSlots, days } from "../../constants/scheduleConstants";
import EditEntryModal from "../modals/EditEntryModal";
import type { TabId } from "../../App";

interface SchedulePanelProps {
  onTabChange: (tab: TabId) => void;
}

interface EditTarget {
  classId: string;
  day: string;
  time: string;
}

export default function SchedulePanel({ onTabChange }: SchedulePanelProps) {
  const { data } = useData();
  const { generateSchedule, clearSchedule } = useScheduler();
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [exportFacultyId, setExportFacultyId] = useState("");

  function handleGenerate() {
    const err = generateSchedule();
    if (err) {
      alert(err);
      return;
    }
    onTabChange("schedule");
  }

  const hasSchedule = Object.keys(data.schedule).length > 0;

  return (
    <div id="schedule" className="panel active">
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <button className="btn btn-success" onClick={handleGenerate}>
          ⟳ Generate / Regenerate
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (confirm("Clear all generated schedules?")) clearSchedule();
          }}
        >
          ✕ Clear Schedule
        </button>
        <button className="btn btn-export" onClick={() => exportAllDocx(data)}>
          ⬇ Export All Classes (.doc)
        </button>
      </div>

      <div className="faculty-export-bar">
        <label>📄 Faculty Schedule Export:</label>
        <select
          value={exportFacultyId}
          onChange={(e) => setExportFacultyId(e.target.value)}
        >
          <option value="">— Select a faculty member —</option>
          {data.faculty.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <button
          className="btn btn-export-faculty"
          onClick={() => {
            if (!exportFacultyId)
              return alert("Please select a faculty member first.");
            exportFacultyDocx(exportFacultyId, data);
          }}
        >
          ⬇ Export Faculty (.doc)
        </button>
        <button
          className="btn btn-export-faculty"
          style={{ opacity: 0.85 }}
          onClick={() => exportAllFacultyDocx(data)}
        >
          ⬇ Export All Faculty (.doc)
        </button>
      </div>

      <div id="schedule-output">
        {!hasSchedule ? (
          <div className="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3>No Schedule Generated</h3>
            <p>
              Go to the Setup tab, add assignments, then click "Generate
              Schedule".
            </p>
          </div>
        ) : (
          data.classes.map((cls) => {
            if (!data.schedule[cls.id]) return null;
            return (
              <div key={cls.id}>
                <div className="section-header">
                  <span>{cls.name}</span>
                  <button
                    className="btn btn-export"
                    style={{ padding: "7px 16px", fontSize: "0.82rem" }}
                    onClick={() => exportClassDocx(cls.id, data)}
                  >
                    ⬇ Export as Word (.docx)
                  </button>
                </div>
                <div className="schedule-container">
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th className="time-col">Time</th>
                        {days.map((d) => (
                          <th key={d}>{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((slot) => {
                        if (slot.period === "break") {
                          return (
                            <tr key={slot.time} className="break-row">
                              <td className="time-col">{slot.time}</td>
                              <td
                                colSpan={5}
                                style={{ textAlign: "center", fontWeight: 600 }}
                              >
                                ☕ BREAK / RECESS
                              </td>
                            </tr>
                          );
                        }
                        return (
                          <tr key={slot.time}>
                            <td className="time-col">{slot.time}</td>
                            {days.map((day) => {
                              const entry =
                                data.schedule[cls.id][day][slot.time];
                              if (!entry) {
                                return (
                                  <td
                                    key={day}
                                    onClick={() =>
                                      setEditTarget({
                                        classId: cls.id,
                                        day,
                                        time: slot.time,
                                      })
                                    }
                                  />
                                );
                              }
                              if (entry.isVacancy) {
                                return (
                                  <td
                                    key={day}
                                    className="vacancy"
                                    onClick={() =>
                                      setEditTarget({
                                        classId: cls.id,
                                        day,
                                        time: slot.time,
                                      })
                                    }
                                  >
                                    Vacancy
                                  </td>
                                );
                              }
                              const subject = data.subjects.find(
                                (s) => s.id === entry.subjectId,
                              );
                              const faculty = data.faculty.find(
                                (f) => f.id === entry.facultyId,
                              );
                              const room = data.rooms.find(
                                (r) => r.id === entry.roomId,
                              );
                              const cellClass = subject?.isPE
                                ? "pe-subject"
                                : subject?.isValues
                                  ? "values-subject"
                                  : "";
                              return (
                                <td
                                  key={day}
                                  className={cellClass}
                                  onClick={() =>
                                    setEditTarget({
                                      classId: cls.id,
                                      day,
                                      time: slot.time,
                                    })
                                  }
                                >
                                  <div className="sched-entry">
                                    <div className="sched-subject">
                                      {subject?.code ?? "?"}
                                    </div>
                                    <div className="sched-faculty">
                                      {faculty?.name ?? "?"}
                                    </div>
                                    <div className="sched-room">
                                      {room?.name ?? "No Room"}
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>

      <EditEntryModal target={editTarget} onClose={() => setEditTarget(null)} />
    </div>
  );
}
