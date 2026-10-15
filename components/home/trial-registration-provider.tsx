"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { programs, type ProgramId } from "@/content/programs";
import { undecidedProgram } from "@/lib/leads";
import { captureAttribution, emptyAttribution } from "@/lib/lead-attribution";

type TrialContextValue = {
  selectedProgram: string;
  setSelectedProgram: (program: string) => void;
  selectProgram: (id?: ProgramId) => void;
  getAttribution: typeof captureAttribution;
};
const TrialContext = createContext<TrialContextValue | null>(null);

export function TrialRegistrationProvider({ children }: { children: ReactNode }) {
  const [selectedProgram, setSelectedProgram] = useState(undecidedProgram);
  const attribution = useRef(emptyAttribution);
  useEffect(() => { attribution.current = captureAttribution(attribution.current); }, []);
  return <TrialContext.Provider value={{
    selectedProgram,
    setSelectedProgram,
    selectProgram: id => setSelectedProgram(id ? programs.find(program => program.id === id)!.name : undecidedProgram),
    getAttribution: () => {
      attribution.current = captureAttribution(attribution.current);
      return attribution.current;
    },
  }}>{children}</TrialContext.Provider>;
}

export function useTrialRegistration() {
  const context = useContext(TrialContext);
  if (!context) throw new Error("TrialRegistrationProvider is required.");
  return context;
}
