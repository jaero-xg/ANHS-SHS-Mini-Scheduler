export default function ConstraintNotice() {
  return (
    <div className="constraint-notice">
      ⚠️ <strong>Active Constraints:</strong>
      <br />
      (1) A faculty assigned at <strong>7:30–8:30 AM</strong> will <em>not</em>{" "}
      be placed at <strong>4:00–5:00 PM</strong> on any day.
      <br />
      (2) <strong>PE</strong> subjects are scheduled on <em>Wednesday only</em>{" "}
      (1 hr / week).
      <br />
      (3) <strong>Values</strong> subjects are auto-scheduled on{" "}
      <em>Friday only</em> (1 hr / week) — taught by the class Adviser in their
      owned room. <em>No manual assignment needed.</em>
      <br />
      (4) <strong>Monday</strong> will never have vacancy slots — all open
      Monday periods remain free/blank.
    </div>
  );
}
