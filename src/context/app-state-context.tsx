'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type TuningMode = 'focus' | 'creative' | 'calm';

interface AppState {
  analysisReport: string;
  projectName: string;
  selectedProjectId: string | null;
  selectedVesselId: string;
  tuningMode: TuningMode;
  setAnalysisReport: (report: string) => void;
  setProjectName: (name: string) => void;
  setSelectedProjectId: (id: string | null) => void;
  setSelectedVesselId: (id: string) => void;
  setTuningMode: (mode: TuningMode) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [analysisReport, setAnalysisReport] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('Project Emergence');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedVesselId, setSelectedVesselId] = useState<string>('global');
  const [tuningMode, setTuningMode] = useState<TuningMode>('focus');

  const appState = {
    analysisReport,
    projectName,
    selectedProjectId,
    selectedVesselId,
    tuningMode,
    setAnalysisReport,
    setProjectName,
    setSelectedProjectId,
    setSelectedVesselId,
    setTuningMode,
  };

  return (
    <AppStateContext.Provider value={appState}>
      <div className={`transition-all duration-1000 ${tuningMode === 'creative' ? 'creative-mode' :
          tuningMode === 'calm' ? 'calm-mode' : 'focus-mode'
        }`}>
        {children}
      </div>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
