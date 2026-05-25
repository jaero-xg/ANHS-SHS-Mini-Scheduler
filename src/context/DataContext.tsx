import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AppData } from "../types";

const STORAGE_KEY = "agutay-scheduler-data";

const defaultData: AppData = {
  faculty: [],
  classes: [],
  rooms: [],
  subjects: [],
  assignments: [],
  schedule: {},
};

interface DataContextValue {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  saveData: (updated: AppData) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as AppData) : defaultData;
    } catch {
      return defaultData;
    }
  });

  const saveData = useCallback((updated: AppData) => {
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, saveData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
