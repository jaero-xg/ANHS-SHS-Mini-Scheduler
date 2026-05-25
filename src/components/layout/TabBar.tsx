import type { TabId } from "../../App";

const TABS: { id: TabId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "setup", label: "Setup" },
  { id: "assignment", label: "Assign" },
  { id: "schedule", label: "Schedule" },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="tabs">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          className={`tab-btn${activeTab === id ? " active" : ""}`}
          onClick={() => onTabChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
