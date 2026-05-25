import { useData } from "../../context/DataContext";

export default function StatsGrid() {
  const { data } = useData();
  const stats = [
    { label: "Faculty Members", value: data.faculty.length },
    { label: "Classes", value: data.classes.length },
    { label: "Rooms", value: data.rooms.length },
    { label: "Subjects", value: data.subjects.length },
  ];

  return (
    <div className="stats-grid">
      {stats.map(({ label, value }) => (
        <div className="stat-card" key={label}>
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
        </div>
      ))}
    </div>
  );
}
