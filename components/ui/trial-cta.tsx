"use client";

import type { ComponentProps } from "react";
import { ArrowUpRight } from "lucide-react";
import { trialContact } from "@/content/contact";
import type { ProgramId } from "@/content/programs";
import { trackConversion, type CTALocation } from "@/lib/analytics";
import { useTrialRegistration } from "@/components/home/trial-registration-provider";
import { ButtonLink } from "./button";

type Props = Pick<ComponentProps<typeof ButtonLink>, "className" | "onClick"> & { program?: ProgramId; location?: CTALocation };

export function TrialCTA({ program, location = "mid_page", onClick, ...props }: Props) {
  const { selectProgram } = useTrialRegistration();
  return <ButtonLink {...props} href={trialContact.href} onClick={event => {
    trackConversion("click_hoc_thu", { course: program, location });
    selectProgram(program);
    onClick?.(event);
    requestAnimationFrame(() => {
      const form = document.getElementById("trial-registration-form");
      form?.scrollIntoView({ block: "start" });
      form?.focus({ preventScroll: true });
    });
  }}>
    {trialContact.label}<ArrowUpRight size={18} aria-hidden="true" />
  </ButtonLink>;
}
