"use client";

import { useRef, useState, type FormEvent } from "react";
import { contact } from "@/content/contact";
import { Button } from "@/components/ui/button";
import { isRecord, leadLimits, leadMessages, leadPrograms, validateLead, type LeadErrors, type LeadField } from "@/lib/leads";
import { useTrialRegistration } from "./trial-registration-provider";

export function TrialRegistrationForm() {
  const { selectedProgram, setSelectedProgram, selectProgram, getAttribution } = useTrialRegistration();
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const submitting = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const payload = {
      parentName: fields.get("parentName"), phone: fields.get("phone"),
      childAge: Number(fields.get("childAge")), program: fields.get("program"),
      sourcePage: window.location.pathname, ...getAttribution(), website: fields.get("website"),
    };
    const validation = validateLead(payload);
    setErrors(validation.success ? {} : validation.errors);
    if (!validation.success) {
      setStatus("idle");
      const firstField = (["parentName", "phone", "childAge", "program"] as const).find(field => validation.errors[field]);
      if (firstField) form.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      return;
    }
    submitting.current = true;
    setStatus("submitting");
    try {
      const response = await fetch("/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validation.data, website: payload.website }),
      });
      const result: unknown = await response.json();
      if (!response.ok || !isRecord(result) || result.success !== true) throw new Error("Lead submission failed");
      form.reset();
      selectProgram();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      submitting.current = false;
      requestAnimationFrame(() => feedback.current?.focus({ preventScroll: true }));
    }
  }

  function fieldProps(field: LeadField) {
    return { "aria-invalid": Boolean(errors[field]), "aria-describedby": errors[field] ? `${field}-error` : undefined };
  }
  return <form id="trial-registration-form" tabIndex={-1} className="lead-form" aria-labelledby="lead-form-title" noValidate onSubmit={onSubmit} aria-busy={status === "submitting"}>
    <h3 id="lead-form-title">Đăng ký học thử</h3>
    <p className="lead-form-intro">Điền thông tin để STEM Fighters tư vấn chương trình và lịch học phù hợp cho con.</p>
    <fieldset disabled={status === "submitting"}>
      <legend className="sr-only">Thông tin đăng ký học thử</legend>
      <div className="lead-fields">
        <div className="lead-field">
          <label htmlFor="parentName">Tên phụ huynh <span aria-hidden="true">*</span></label>
          <input id="parentName" name="parentName" type="text" autoComplete="name" maxLength={leadLimits.parentName} required {...fieldProps("parentName")} />
          {errors.parentName && <p id="parentName-error" className="field-error">{errors.parentName}</p>}
        </div>
        <div className="lead-field">
          <label htmlFor="phone">Số điện thoại <span aria-hidden="true">*</span></label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={leadLimits.phone} required {...fieldProps("phone")} />
          {errors.phone && <p id="phone-error" className="field-error">{errors.phone}</p>}
        </div>
        <div className="lead-field">
          <label htmlFor="childAge">Tuổi của bé <span aria-hidden="true">*</span></label>
          <select id="childAge" name="childAge" defaultValue="" required {...fieldProps("childAge")}>
            <option value="" disabled>Chọn tuổi của bé</option>
            {Array.from({ length: leadLimits.maxAge - leadLimits.minAge + 1 }, (_, index) => leadLimits.minAge + index).map(age => <option key={age} value={age}>{age} tuổi</option>)}
          </select>
          {errors.childAge && <p id="childAge-error" className="field-error">{errors.childAge}</p>}
        </div>
        <div className="lead-field">
          <label htmlFor="program">Chương trình quan tâm <span aria-hidden="true">*</span></label>
          <select id="program" name="program" required value={selectedProgram} onChange={event => setSelectedProgram(event.target.value)} {...fieldProps("program")}>
            {leadPrograms.map(program => <option key={program} value={program}>{program}</option>)}
          </select>
          {errors.program && <p id="program-error" className="field-error">{errors.program}</p>}
        </div>
      </div>
      <div className="lead-honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label><input id="website" name="website" type="text" autoComplete="off" tabIndex={-1} />
      </div>
      <Button type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Đang gửi..." : "Nhận tư vấn & lịch học thử"}</Button>
    </fieldset>
    <div ref={feedback} tabIndex={-1} className={`lead-feedback lead-feedback--${status}`} role={status === "error" ? "alert" : "status"} aria-live={status === "error" ? "assertive" : "polite"}>
      {status === "success" && <p>{leadMessages.success}</p>}
      {status === "error" && <><p>{leadMessages.failure}</p><a href={contact.facebookHref} target="_blank" rel="noopener noreferrer">Liên hệ Facebook STEM Fighters</a></>}
      {errors.request && <p className="field-error">{errors.request}</p>}
    </div>
  </form>;
}
