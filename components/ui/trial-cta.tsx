import type { ComponentProps } from "react";
import { Phone } from "lucide-react";
import { trialContact } from "@/content/contact";
import { ButtonLink } from "./button";

type Props = Pick<ComponentProps<typeof ButtonLink>, "className" | "onClick">;

export function TrialCTA(props: Props) {
  return <ButtonLink {...props} href={trialContact.href}>
    {trialContact.label}<Phone size={18} aria-hidden="true" />
  </ButtonLink>;
}
