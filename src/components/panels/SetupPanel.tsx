import { useState } from "react";
import { useData } from "../../context/DataContext";
import ListItem from "../shared/ListItem";

export default function SetupPanel() {
  const { data, saveData } = useData();

  // ── Faculty ───────────────────────────────────────────────────────
  const [facName, setFacName] = useState("");
  const [facType, setFacType] = useState<"adviser" | "floating">("adviser");

  function handleAddFaculty() {
    if (!facName.trim()) return alert("Please enter a faculty name.");
    if (
      data.faculty.find((f) => f.name.toLowerCase() === facName.toLowerCase())
    )
      return alert("Faculty member already exists.");
    saveData({
      ...data,
      faculty: [
        ...data.faculty,
        { id: Date.now().toString(), name: facName.trim(), type: facType },
      ],
    });
    setFacName("");
  }

  function handleRemoveFaculty(id: string) {
    if (!confirm("Remove this faculty? This may affect existing assignments."))
      return;
    saveData({
      ...data,
      faculty: data.faculty.filter((f) => f.id !== id),
      assignments: data.assignments.filter((a) => a.facultyId !== id),
      classes: data.classes.map((c) =>
        c.adviserId === id ? { ...c, adviserId: "" } : c,
      ),
      rooms: data.rooms.map((r) =>
        r.ownerId === id ? { ...r, ownerId: "" } : r,
      ),
    });
  }

  // ── Classes ───────────────────────────────────────────────────────
  const [year, setYear] = useState("Grade 11");
  const [section, setSection] = useState("");
  const [adviserId, setAdviserId] = useState("");

  function handleAddClass() {
    if (!section.trim()) return alert("Please enter a section name.");
    const className = `${year} - ${section.trim()}`;
    if (data.classes.find((c) => c.name === className))
      return alert("Class already exists.");
    saveData({
      ...data,
      classes: [
        ...data.classes,
        {
          id: Date.now().toString(),
          name: className,
          year,
          section: section.trim(),
          adviserId,
        },
      ],
    });
    setSection("");
    setAdviserId("");
  }

  function handleRemoveClass(id: string) {
    if (
      !confirm(
        "Remove this class? This will remove all associated assignments.",
      )
    )
      return;
    saveData({
      ...data,
      classes: data.classes.filter((c) => c.id !== id),
      assignments: data.assignments.filter((a) => a.classId !== id),
    });
  }

  // ── Rooms ─────────────────────────────────────────────────────────
  const [roomName, setRoomName] = useState("");
  const [ownerId, setOwnerId] = useState("");

  function handleAddRoom() {
    if (!roomName.trim()) return alert("Please enter a room name.");
    if (data.rooms.find((r) => r.name.toLowerCase() === roomName.toLowerCase()))
      return alert("Room already exists.");
    saveData({
      ...data,
      rooms: [
        ...data.rooms,
        { id: Date.now().toString(), name: roomName.trim(), ownerId },
      ],
    });
    setRoomName("");
    setOwnerId("");
  }

  function handleRemoveRoom(id: string) {
    if (!confirm("Remove this room?")) return;
    saveData({ ...data, rooms: data.rooms.filter((r) => r.id !== id) });
  }

  // ── Subjects ──────────────────────────────────────────────────────
  const [subName, setSubName] = useState("");
  const [subCode, setSubCode] = useState("");
  const [isPE, setIsPE] = useState(false);
  const [isValues, setIsValues] = useState(false);

  function handleAddSubject() {
    if (!subName.trim() || !subCode.trim())
      return alert("Please enter both a subject name and a subject code.");
    if (isPE && isValues)
      return alert(
        "A subject cannot be both PE and Values. Please select only one.",
      );
    if (data.subjects.find((s) => s.code === subCode.toUpperCase()))
      return alert("A subject with that code already exists.");
    saveData({
      ...data,
      subjects: [
        ...data.subjects,
        {
          id: Date.now().toString(),
          name: subName.trim(),
          code: subCode.trim().toUpperCase(),
          isPE,
          isValues,
        },
      ],
    });
    setSubName("");
    setSubCode("");
    setIsPE(false);
    setIsValues(false);
  }

  function handleRemoveSubject(id: string) {
    if (
      !confirm(
        "Remove this subject? Any related assignments will also be removed.",
      )
    )
      return;
    saveData({
      ...data,
      subjects: data.subjects.filter((s) => s.id !== id),
      assignments: data.assignments.filter((a) => a.subjectId !== id),
    });
  }

  const advisers = data.faculty.filter((f) => f.type === "adviser");

  return (
    <div className="panel active">
      {/* ── Faculty ── */}
      <div className="setup-section">
        <h3 className="section-title">Faculty</h3>
        <div className="grid-2">
          <div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g., Juan dela Cruz"
                value={facName}
                onChange={(e) => setFacName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <div className="radio-group">
                <label className="radio-item">
                  <input
                    type="radio"
                    checked={facType === "adviser"}
                    onChange={() => setFacType("adviser")}
                  />{" "}
                  Adviser
                </label>
                <label className="radio-item">
                  <input
                    type="radio"
                    checked={facType === "floating"}
                    onChange={() => setFacType("floating")}
                  />{" "}
                  Floating
                </label>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleAddFaculty}>
              Add Faculty
            </button>
          </div>
          <div>
            {!data.faculty.length ? (
              <p className="help-text">No faculty members added yet.</p>
            ) : (
              data.faculty.map((f) => (
                <ListItem
                  key={f.id}
                  title={f.name}
                  badge={
                    <span className={`badge badge-${f.type}`}>
                      {f.type === "adviser" ? "Adviser" : "Floating"}
                    </span>
                  }
                  onRemove={() => handleRemoveFaculty(f.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Classes ── */}
      <div className="setup-section">
        <h3 className="section-title">Classes</h3>
        <div className="grid-2">
          <div>
            <div className="form-group">
              <label>Year Level</label>
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option>Grade 11</option>
                <option>Grade 12</option>
              </select>
            </div>
            <div className="form-group">
              <label>Section</label>
              <input
                type="text"
                placeholder="e.g., A, B, Orchids"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Adviser</label>
              <select
                value={adviserId}
                onChange={(e) => setAdviserId(e.target.value)}
              >
                <option value="">Select Adviser</option>
                {advisers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <p className="help-text">
                Only faculty marked as "Adviser" appear here.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleAddClass}>
              Add Class
            </button>
          </div>
          <div>
            {!data.classes.length ? (
              <p className="help-text">No classes added yet.</p>
            ) : (
              data.classes.map((c) => {
                const adviser = data.faculty.find((f) => f.id === c.adviserId);
                return (
                  <ListItem
                    key={c.id}
                    title={c.name}
                    meta={`Adviser: ${adviser?.name ?? "Not assigned"}`}
                    onRemove={() => handleRemoveClass(c.id)}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Rooms ── */}
      <div className="setup-section">
        <h3 className="section-title">Rooms</h3>
        <div className="grid-2">
          <div>
            <div className="form-group">
              <label>Room Name / Number</label>
              <input
                type="text"
                placeholder="e.g., Room 101, Science Lab"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Owner (Faculty)</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
              >
                <option value="">Select Owner</option>
                {data.faculty.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleAddRoom}>
              Add Room
            </button>
          </div>
          <div>
            {!data.rooms.length ? (
              <p className="help-text">No rooms added yet.</p>
            ) : (
              data.rooms.map((r) => {
                const owner = data.faculty.find((f) => f.id === r.ownerId);
                return (
                  <ListItem
                    key={r.id}
                    title={r.name}
                    meta={`Owner: ${owner?.name ?? "Shared"}`}
                    onRemove={() => handleRemoveRoom(r.id)}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Subjects ── */}
      <div className="setup-section">
        <h3 className="section-title">Subjects</h3>
        <div className="grid-2">
          <div>
            <div className="form-group">
              <label>Subject Name</label>
              <input
                type="text"
                placeholder="e.g., Mathematics"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Subject Code</label>
              <input
                type="text"
                placeholder="e.g., MATH"
                value={subCode}
                onChange={(e) => setSubCode(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label
                style={{
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  marginBottom: 8,
                  display: "block",
                }}
              >
                Subject Classification
              </label>
              <label
                className="classification-label"
                style={{ marginBottom: 8 }}
              >
                <input
                  type="checkbox"
                  checked={isPE}
                  onChange={(e) => setIsPE(e.target.checked)}
                />
                <span className="classification-info">
                  <strong>PE Subject</strong>
                  <span className="classification-desc">
                    Scheduled on <em>Wednesday only</em> · 1 hr / week.
                  </span>
                </span>
              </label>
              <label className="classification-label">
                <input
                  type="checkbox"
                  checked={isValues}
                  onChange={(e) => setIsValues(e.target.checked)}
                />
                <span className="classification-info">
                  <strong>Values Subject</strong>
                  <span className="classification-desc">
                    Scheduled on <em>Friday only</em> · 1 hr / week. Auto-taught
                    by Adviser. <strong>No assignment needed.</strong>
                  </span>
                </span>
              </label>
            </div>
            <button className="btn btn-primary" onClick={handleAddSubject}>
              Add Subject
            </button>
          </div>
          <div>
            {!data.subjects.length ? (
              <p className="help-text">No subjects added yet.</p>
            ) : (
              data.subjects.map((s) => {
                const badge = s.isPE ? (
                  <span className="badge badge-pe">PE · Wed</span>
                ) : s.isValues ? (
                  <span className="badge badge-values">Values · Fri</span>
                ) : null;
                return (
                  <ListItem
                    key={s.id}
                    title={s.name}
                    badge={
                      <>
                        <span className="badge badge-code">{s.code}</span>
                        {badge}
                      </>
                    }
                    onRemove={() => handleRemoveSubject(s.id)}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
