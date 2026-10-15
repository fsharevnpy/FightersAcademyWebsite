import type { ProgramId } from "@/content/programs";

// Conceptual illustrations of learning themes; not product photography.
export function ProgramArt({ kind }: { kind: ProgramId }) {
  return <svg viewBox="0 0 240 160" fill="none" className={`program-art program-art--${kind}`} aria-hidden="true">
    <path d="M20 130H220M40 20V145M80 20V145M120 20V145M160 20V145M200 20V145M20 50H220M20 90H220" stroke="currentColor" strokeOpacity=".08" />
    {kind === "rio" && <>
      <path d="M39 116H100V67H183V35" stroke="#00B5D2" strokeWidth="3" strokeDasharray="6 6" /><circle cx="39" cy="116" r="6" fill="#075BE8" /><path d="m176 40 7-9 7 9" stroke="#00B5D2" strokeWidth="3" strokeLinecap="round" />
      <rect x="101" y="44" width="74" height="66" rx="22" fill="#D7E7FF" stroke="#075BE8" strokeWidth="2" /><rect x="111" y="57" width="54" height="30" rx="12" fill="white" stroke="#075BE8" strokeWidth="2" /><circle cx="126" cy="72" r="4" fill="#075BE8" /><circle cx="150" cy="72" r="4" fill="#075BE8" /><path d="M133 96H143M138 44V32" stroke="#075BE8" strokeWidth="3" strokeLinecap="round" /><circle cx="138" cy="28" r="5" fill="#00C8E8" /><rect x="94" y="78" width="8" height="24" rx="4" fill="#075BE8" /><rect x="174" y="78" width="8" height="24" rx="4" fill="#075BE8" />
    </>}
    {kind === "starter-kit" && <>
      <path d="m48 73 70-37 75 39-70 40-75-42Z" fill="#E0ECFF" stroke="#075BE8" strokeWidth="2" /><path d="M48 73v30l75 40 70-40V75M123 115v28" stroke="#075BE8" strokeWidth="2" fill="#EDF5FF" /><path d="m77 72 42-22 42 23-41 22-43-23Z" fill="#075BE8" /><g fill="#67E3F0"><circle cx="106" cy="66" r="3" /><circle cx="119" cy="73" r="3" /><circle cx="132" cy="80" r="3" /><circle cx="119" cy="59" r="3" /><circle cx="132" cy="66" r="3" /><circle cx="145" cy="73" r="3" /></g><path d="M64 55V30h25M176 102h27V71M85 121v15H60" stroke="#00B5D2" strokeWidth="2" /><circle cx="93" cy="30" r="5" fill="white" stroke="#00B5D2" strokeWidth="2" /><circle cx="203" cy="66" r="5" fill="white" stroke="#00B5D2" strokeWidth="2" />
    </>}
    {kind === "lap-trinh" && <>
      <rect x="41" y="28" width="158" height="105" rx="12" fill="white" stroke="#075BE8" strokeWidth="2" /><path d="M41 49h158" stroke="#075BE8" strokeWidth="2" /><circle cx="54" cy="39" r="3" fill="#00C8E8" /><circle cx="65" cy="39" r="3" fill="#C5D8F4" /><circle cx="76" cy="39" r="3" fill="#C5D8F4" /><path d="m84 71-17 17 17 17M156 71l17 17-17 17M130 66l-20 44" stroke="#075BE8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><rect x="154" y="115" width="56" height="24" rx="6" fill="#DDF9FC" stroke="#00B5D2" strokeWidth="2" /><path d="m171 126 5 5 11-11" stroke="#07829A" strokeWidth="2" strokeLinecap="round" />
    </>}
    {kind === "dien-tu-co-ban" && <>
      <path d="M52 106V47h59M130 47h58v59h-63M102 106H52" stroke="#075BE8" strokeWidth="3" strokeLinecap="round" /><rect x="38" y="65" width="28" height="37" rx="5" fill="#DDEAFF" stroke="#075BE8" strokeWidth="2" /><path d="M47 77h10M52 72v10M47 90h10" stroke="#075BE8" strokeWidth="2" /><path d="M108 47l23-15" stroke="#075BE8" strokeWidth="3" /><circle cx="108" cy="47" r="4" fill="white" stroke="#075BE8" strokeWidth="2" /><circle cx="132" cy="47" r="4" fill="white" stroke="#075BE8" strokeWidth="2" /><path d="M177 92V80a11 11 0 0 1 22 0v12h-22Z" fill="#95EAF5" stroke="#07829A" strokeWidth="2" /><path d="M182 92v14M194 92v14M188 57v-8M207 66l6-6M169 66l-6-6" stroke="#00B5D2" strokeWidth="2" strokeLinecap="round" /><rect x="101" y="98" width="26" height="16" rx="3" fill="#DDEAFF" stroke="#075BE8" strokeWidth="2" /><path d="M110 99v14M118 99v14" stroke="#075BE8" strokeWidth="2" />
    </>}
  </svg>;
}
