import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";

interface EditTarget {
  classId: string;
  day: string;
  time: string;
}

interface EditEntryModalProps {
  target: EditTarget | null;
  onClose: () => void;
}

export default function EditEntryModal({
  target,
  onClose,
}: EditEntryModalProps) {
  const { data, saveData } = useData();
  const [subjectId, setSubjectId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (!target) return;
    const entry = data.schedule[target.classId]?.[target.day]?.[target.time];
    setSubjectId(entry?.subjectId ?? "");
    setFacultyId(entry?.facultyId ?? "");
    setRoomId(entry?.roomId ?? "");
  }, [target]);

  if (!target) return null;

  function handleSave() {
    const updated = structuredClone(data);
    if (!subjectId) {
      updated.schedule[target!.classId][target!.day][target!.time] = null;
    } else {
      const assignment = data.assignments.find(
        (a) => a.subjectId === subjectId && a.facultyId === facultyId,
      );
      updated.schedule[target!.classId][target!.day][target!.time] = {
        assignmentId: assignment?.id ?? null,
        subjectId,
        facultyId,
        roomId: roomId || null,
      };
    }
    saveData(updated);
    onClose();
  }

  function handleDelete() {
    const updated = structuredClone(data);
    updated.schedule[target!.classId][target!.day][target!.time] = null;
    saveData(updated);
    onClose();
  }

  return (
    <div className="modal-overlay active" id="edit-modal">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit Schedule Entry</h3>
          <button className="modal-close" onClick={onClose}>
            &#215;
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="">— Empty —</option>
              {data.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Faculty</label>
            <select
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
            >
              <option value="">— None —</option>
              {data.faculty.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Room</label>
            <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
              <option value="">— No Room —</option>
              {data.rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Remove
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
