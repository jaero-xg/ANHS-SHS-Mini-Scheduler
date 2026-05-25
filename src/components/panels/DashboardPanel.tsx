import { useData } from "../../context/DataContext";
import type { TabId } from "../../App";

interface DashboardPanelProps {
  onTabChange: (tab: TabId) => void;
}

export default function DashboardPanel({ onTabChange }: DashboardPanelProps) {
  const { data } = useData();

  const hasSchedule = Object.keys(data.schedule).length > 0;

  const stats = [
    {
      label: "Faculty Members",
      value: data.faculty.length,
      tab: "setup" as TabId,
      color: "var(--accent)",
    },
    {
      label: "Classes",
      value: data.classes.length,
      tab: "setup" as TabId,
      color: "#10b981",
    },
    {
      label: "Rooms",
      value: data.rooms.length,
      tab: "setup" as TabId,
      color: "#f59e0b",
    },
    {
      label: "Subjects",
      value: data.subjects.length,
      tab: "setup" as TabId,
      color: "#8b5cf6",
    },
    {
      label: "Assignments",
      value: data.assignments.length,
      tab: "assignment" as TabId,
      color: "#ef4444",
    },
  ];

  const readyToGenerate =
    data.assignments.length > 0 &&
    data.rooms.length > 0 &&
    data.classes.length > 0;

  return (
    <div className="panel active">
      {/* ── Stats ── */}
      <div className="setup-section">
        <h3 className="section-title">Overview</h3>
        <div className="stats-grid">
          {stats.map(({ label, value, tab, color }) => (
            <div
              key={label}
              className="stat-card"
              style={{ cursor: "pointer", borderTop: `3px solid ${color}` }}
              onClick={() => onTabChange(tab)}
            >
              <div className="stat-value" style={{ color }}>
                {value}
              </div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Checklist ── */}
      <div className="setup-section">
        <h3 className="section-title">Readiness Checklist</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {
              label: "Faculty added",
              done: data.faculty.length > 0,
              tab: "setup" as TabId,
            },
            {
              label: "Classes added",
              done: data.classes.length > 0,
              tab: "setup" as TabId,
            },
            {
              label: "Rooms added",
              done: data.rooms.length > 0,
              tab: "setup" as TabId,
            },
            {
              label: "Subjects added",
              done: data.subjects.length > 0,
              tab: "setup" as TabId,
            },
            {
              label: "Assignments made",
              done: data.assignments.length > 0,
              tab: "assignment" as TabId,
            },
            {
              label: "Schedule generated",
              done: hasSchedule,
              tab: "schedule" as TabId,
            },
          ].map(({ label, done, tab }) => (
            <div
              key={label}
              onClick={() => !done && onTabChange(tab)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 10,
                background: done
                  ? "rgba(16,185,129,0.08)"
                  : "rgba(255,255,255,0.55)",
                border: `1px solid ${done ? "rgba(16,185,129,0.3)" : "var(--border)"}`,
                cursor: done ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: done ? "#10b981" : "var(--border)",
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {done ? "✓" : "!"}
              </span>
              <span
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 500,
                  color: done ? "#059669" : "var(--text-light)",
                  textDecoration: done ? "none" : "underline dotted",
                }}
              >
                {label}
              </span>
              {!done && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.75rem",
                    color: "var(--accent)",
                  }}
                >
                  Go →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Constraints ── */}
      <div className="setup-section">
        <h3 className="section-title">Active Scheduling Constraints</h3>
        <div className="constraint-notice">
          ⚠️ <strong>Active Constraints:</strong>
          <br />
          (1) A faculty assigned at <strong>7:30–8:30 AM</strong> will{" "}
          <em>not</em> be placed at <strong>4:00–5:00 PM</strong> on any day.
          <br />
          (2) <strong>PE</strong> subjects are scheduled on{" "}
          <em>Wednesday only</em> (1 hr / week).
          <br />
          (3) <strong>Values</strong> subjects are auto-scheduled on{" "}
          <em>Friday only</em> (1 hr / week) — taught by the class Adviser in
          their owned room. <em>No manual assignment needed.</em>
          <br />
          (4) <strong>Monday</strong> will never have vacancy slots — all open
          Monday periods remain free/blank.
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="setup-section">
        <h3 className="section-title">Quick Actions</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn btn-primary"
            onClick={() => onTabChange("setup")}
          >
            ＋ Go to Setup
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onTabChange("assignment")}
          >
            ＋ Go to Assignments
          </button>
          <button
            className="btn btn-success"
            onClick={() => onTabChange("schedule")}
            disabled={!readyToGenerate}
            title={
              !readyToGenerate ? "Complete setup and assignments first" : ""
            }
          >
            ⟳ Go to Schedule
          </button>
        </div>
        {!readyToGenerate && (
          <p className="help-text" style={{ marginTop: 10 }}>
            Complete all checklist items above before generating a schedule.
          </p>
        )}
      </div>
    </div>
  );
}
