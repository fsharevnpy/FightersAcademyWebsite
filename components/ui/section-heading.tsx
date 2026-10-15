type Props = { eyebrow: string; title: string; description?: string; centered?: boolean };

export function SectionHeading({ eyebrow, title, description, centered = false }: Props) {
  return <div className={`section-heading ${centered ? "section-heading--center" : ""}`}>
    <p className="eyebrow"><span aria-hidden="true" />{eyebrow}</p>
    <h2>{title.replaceAll("\\n", "\n")}</h2>
    {description && <p className="section-description">{description}</p>}
  </div>;
}
