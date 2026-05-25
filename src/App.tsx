import { useState } from "react";
import { DataProvider } from "./context/DataContext";
import IntroPanel from "./components/intro/IntroPanel";
import Header from "./components/layout/Header";
import TabBar from "./components/layout/TabBar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import DashboardPanel from "./components/panels/DashboardPanel";
import SetupPanel from "./components/panels/SetupPanel";
import AssignmentPanel from "./components/panels/AssignmentPanel";
import SchedulePanel from "./components/panels/SchedulePanel";
export type TabId = "dashboard" | "setup" | "assignment" | "schedule";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  return (
    <DataProvider>
      {showIntro && <IntroPanel onDismiss={() => setShowIntro(false)} />}
      {!showIntro && (
        <div id="main-app">
          <Header />
          <div className="container">
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === "dashboard" && (
              <DashboardPanel onTabChange={setActiveTab} />
            )}
            {activeTab === "setup" && <SetupPanel />}
            {activeTab === "assignment" && <AssignmentPanel />}
            {activeTab === "schedule" && (
              <SchedulePanel onTabChange={setActiveTab} />
            )}
          </div>
          <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}
    </DataProvider>
  );
}
