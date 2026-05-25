import { useState } from "react";
import { useData } from "../../context/DataContext";
import ListItem from "../shared/ListItem";

export default function AssignmentPanel() {
  const { data, saveData } = useData();
  const [subjectId, setSubjectId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [classId, setClassId] = useState("");

  function handleAdd() {
    if (!subjectId || !facultyId || !classId)
      return alert("Please select a Subject, Faculty, and Class.");
    if (
      data.assignments.find(
        (a) => a.subjectId === subjectId && a.classId === classId,
      )
    )
      return alert("This subject is already assigned to that class.");
    saveData({
      ...data,
      assignments: [
        ...data.assignments,
        {
          id: Date.now().toString(),
          subjectId,
          facultyId,
          classId,
        },
      ],
    });
    setSubjectId("");
    setFacultyId("");
    setClassId("");
  }

  function handleRemove(id: string) {
    if (!confirm("Remove this assignment?")) return;
    saveData({
      ...data,
      assignments: data.assignments.filter((a) => a.id !== id),
    });
  }

  const assignableSubjects = data.subjects.filter((s) => !s.isValues);

  return (
    <div className="panel active">
      <div className="setup-section">
        <h3>Subject Assignment</h3>
        <p className="help-text">
          Assign subjects to faculty and classes. Regular subjects run 4
          days/week. PE = Wednesday only. Values = auto-placed on Friday (no
          assignment needed).
        </p>
        <div className="grid-3" style={{ marginTop: 16 }}>
          <div className="form-group">
            <label>Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="">Select Subject</option>
              {assignableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
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
              <option value="">Select Faculty</option>
              {data.faculty.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Select Class</option>
              {data.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Assignment
        </button>
      </div>

      <div className="setup-section">
        <h3>Current Assignments</h3>
        {!data.assignments.length ? (
          <p className="help-text">
            No assignments yet. Add assignments above to generate a schedule.
          </p>
        ) : (
          data.assignments.map((a) => {
            const subject = data.subjects.find((s) => s.id === a.subjectId);
            const faculty = data.faculty.find((f) => f.id === a.facultyId);
            const cls = data.classes.find((c) => c.id === a.classId);
            return (
              <ListItem
                key={a.id}
                title={subject?.name ?? "Unknown Subject"}
                meta={`Faculty: ${faculty?.name ?? "Unknown"} | Class: ${cls?.name ?? "Unknown"}`}
                onRemove={() => handleRemove(a.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
