import { getSchoolYear } from "../../utils/useSchoolYear";

interface IntroPanelProps {
  onDismiss: () => void;
}

export default function IntroPanel({ onDismiss }: IntroPanelProps) {
  const schoolYear = getSchoolYear();
  return (
    <div id="intro-page">
      {/* ── Left panel – logo hero ── */}
      <div className="intro-left">
        <div className="intro-orb intro-orb-1" />
        <div className="intro-orb intro-orb-2" />

        <div className="intro-logo-wrap">
          <img src="/img/ANHS.png" alt="ANHS Logo" className="intro-logo" />
          <div className="intro-logo-ring" />
        </div>

        <p className="intro-school-left">Agutay National High School</p>
        <p className="intro-tagline-left">{schoolYear} · Senior High School</p>
      </div>

      {/* ── Right panel – content ── */}
      <div className="intro-right">
        <div className="intro-orb intro-orb-3" />

        <div className="intro-content">
          <h1 className="intro-headline">
            SHS Mini
            <br />
            Scheduler
          </h1>
          <p className="intro-desc">
            Automated class-schedule generator for the Senior High School. Set
            up your faculty, rooms, subjects, and class assignments — then
            generate conflict-free timetables in one click.
          </p>

          <div className="intro-features">
            <span className="intro-pill">📋 Subject Assignments</span>
            <span className="intro-pill">🏫 Room Management</span>
            <span className="intro-pill">👩‍🏫 Faculty Tracking</span>
            <span className="intro-pill">📅 Auto-Scheduling</span>
            <span className="intro-pill">📄 Export to Word</span>
          </div>

          <div className="intro-steps">
            {[
              {
                n: 1,
                title: "Add Faculty, Rooms & Subjects",
                desc: "Fill in the reference data under each tab.",
              },
              {
                n: 2,
                title: "Create Assignments",
                desc: "Link subjects to their faculty and target class.",
              },
              {
                n: 3,
                title: "Generate & Export",
                desc: "Click Generate Schedule and download Word files.",
              },
            ].map(({ n, title, desc }) => (
              <div className="intro-step" key={n}>
                <div className="intro-step-num">{n}</div>
                <div className="intro-step-text">
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-get-started" onClick={onDismiss}>
            Get Started &nbsp;→
          </button>
        </div>
      </div>
    </div>
  );
}
