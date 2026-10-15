import { formatTuition, getProgramModuleGroups, type Program } from "@/content/programs";
import { Accordion } from "@/components/ui/accordion";

function ModuleList({ modules, start = 0 }: { modules: Program["modules"]; start?: number }) {
  return <ol className="module-list" start={start + 1}>{modules.map((module, index) => <li key={`${module.group ?? ""}-${module.name}`}>
    <span>{String(start + index + 1).padStart(2, "0")}</span>
    <div className="module-content">{module.group && <span className="module-group">{module.group}</span>}<strong>{module.name}</strong>{module.sessions && <span className="module-sessions">{module.sessions} buổi / khóa</span>}</div>
    {module.tuition !== undefined && <span className="module-tuition">{formatTuition(module.tuition)}<small>/ {module.unit ?? "khóa"}</small></span>}
  </li>)}</ol>;
}

export function ProgramCurriculum({ program }: { program: Program }) {
  if (program.id !== "dien-tu-co-ban") return <ModuleList modules={program.modules} />;
  const groups = getProgramModuleGroups(program);
  return <div className="curriculum-groups">{groups.map((group, index) => <Accordion
    key={group.name}
    title={group.name}
    count={`${group.modules.length} ${group.modules.every(module => module.unit === "chuyên đề") ? "chuyên đề" : "khóa"}`}
  ><ModuleList modules={group.modules} start={groups.slice(0, index).reduce((sum, item) => sum + item.modules.length, 0)} /></Accordion>)}</div>;
}
