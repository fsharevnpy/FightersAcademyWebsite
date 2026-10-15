"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getProgramPath, programs, type ProgramId } from "@/content/programs";
import { undecidedProgram } from "@/lib/leads";
import { captureAttribution, emptyAttribution } from "@/lib/lead-attribution";

type TrialContextValue = {
  selectedProgram: string;
  setSelectedProgram: (program: string) => void;
  selectProgram: (id?: ProgramId) => void;
  getAttribution: typeof captureAttribution;
};
const TrialContext = createContext<TrialContextValue | null>(null);

function programName(id?: ProgramId) {
  if (!id) return undecidedProgram;
  const program = programs.find(program => program.id === id);
  if (!program) throw new Error("Unknown trial program.");
  return program.name;
}

export function TrialRegistrationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentProgram = programs.find(program => getProgramPath(program) === pathname);
  const defaultSelection = programName(currentProgram?.id);
  const [selection, setSelection] = useState({ pathname, program: defaultSelection });
  const selectedProgram = selection.pathname === pathname ? selection.program : defaultSelection;
  const setSelectedProgram = (program: string) => setSelection({ pathname, program });
  const attribution = useRef(emptyAttribution);
  useEffect(() => { attribution.current = captureAttribution(attribution.current); }, [pathname]);
  return <TrialContext.Provider value={{
    selectedProgram,
    setSelectedProgram,
    selectProgram: id => setSelectedProgram(programName(id ?? currentProgram?.id)),
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
