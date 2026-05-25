import { getSchoolYear } from "../../utils/useSchoolYear";

export default function Header() {
  const schoolYear = getSchoolYear();

  return (
    <header>
      <div className="container">
        <div className="header-inner">
          <img src="/img/ANHS.png" alt="ANHS Logo" className="header-logo" />
          <div className="header-text">
            <span className="header-title">Agutay National High School</span>
            <span className="header-sub">
              Senior High School — Mini Scheduler
            </span>
          </div>
        </div>
        <span className="header-badge">{schoolYear}</span>
      </div>
    </header>
  );
}
