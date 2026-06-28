import { useState } from "react";
import type { Page } from "@/App";
import AnimateIn from "@/components/AnimateIn";

interface Props { navigate: (p: Page) => void; }

const CLASSES = ["Pre-Nursery","Nursery 1","Nursery 2","Year 1","Year 2","Year 3","Year 4","Year 5","Year 6","JSS 1","JSS 2","JSS 3","SSS 1","SSS 2","SSS 3"];
const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown"];
const GENOTYPES = ["AA","AS","SS","AC","Unknown"];
const GENDERS = ["Male","Female","Prefer not to say"];
const RELATIONSHIPS = ["Father","Mother","Guardian","Other"];
const HOW_HEARD = ["Word of mouth / Referral","Facebook","Instagram","Google Search","Signboard / Flyer","Previous student","Other"];

type Step = 1 | 2 | 3 | 4 | 5;

const STEPS: { title: string; desc: string }[] = [
  { title: "Student Information", desc: "Basic details about the student" },
  { title: "Previous School", desc: "Academic background" },
  { title: "Parent / Guardian", desc: "Contact and relationship details" },
  { title: "Home Address", desc: "Where the family is based" },
  { title: "Health & Final Details", desc: "Medical info and additional notes" },
];

function FieldGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="af-field">
      <label className="af-label">{label}{required && <span className="af-req"> *</span>}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", required }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return <input className="af-input" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} />;
}

function Select({ value, onChange, options, placeholder, required }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; required?: boolean }) {
  return (
    <select className="af-input af-select" value={value} onChange={e => onChange(e.target.value)} required={required}>
      <option value="">{placeholder || "Select…"}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea className="af-input af-textarea" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} />;
}

export default function ApplyPage({ navigate }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; ref?: string; downloadUrl?: string; whatsappUrl?: string; error?: string } | null>(null);

  const [form, setForm] = useState({
    studentFirstName: "", studentLastName: "", dateOfBirth: "", gender: "",
    nationality: "Nigerian", religion: "", classApplying: "", entryDate: "",
    prevSchool: "", lastClass: "", yearLeft: "", reasonLeaving: "",
    parentName: "", relationship: "", phone: "", email: "", occupation: "",
    address: "", city: "Abuja", lga: "", state: "FCT", country: "Nigeria",
    bloodGroup: "", genotype: "", medicalConditions: "", disability: "",
    hearAboutUs: "", message: "",
  });

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const canProceed = () => {
    if (step === 1) return form.studentFirstName && form.studentLastName && form.gender && form.classApplying;
    if (step === 3) return form.parentName && form.phone && form.relationship;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const r = await fetch("/api/admissions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (r.ok) {
        setResult({ ok: true, ref: data.ref, downloadUrl: data.downloadUrl, whatsappUrl: data.whatsappUrl });
      } else {
        setResult({ ok: false, error: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setResult({ ok: false, error: "Network error. Please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (result?.ok) {
    return (
      <section className="apply-success-section">
        <div className="pis-container">
          <AnimateIn className="apply-success-card">
            <div className="apply-success-icon">
              <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2>Application Submitted</h2>
            <p>Thank you for applying to Prudential International School. Your reference number is:</p>
            <div className="apply-ref">{result.ref}</div>
            <p style={{ fontSize: 14, color: "var(--pis-muted-fg)", marginBottom: 28 }}>
              A copy of your form has been sent to our admissions team. You may also download your PDF or send it directly via WhatsApp.
            </p>
            <div className="apply-success-btns">
              {result.downloadUrl && (
                <a href={result.downloadUrl} download className="btn-cta-primary" style={{ textDecoration: "none" }}>
                  Download PDF Form
                </a>
              )}
              {result.whatsappUrl && (
                <a href={result.whatsappUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25d366", color: "#fff", padding: "13px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Send via WhatsApp
                </a>
              )}
              <button className="btn-cta-outline" onClick={() => navigate("contact")}>Back to Contact</button>
            </div>
          </AnimateIn>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="apply-hero">
        <div className="apply-hero-grid" />
        <div className="pis-container" style={{ position: "relative", zIndex: 2 }}>
          <AnimateIn className="apply-hero-content">
            <span className="ey" style={{ color: "var(--cyan)", marginBottom: 12, display: "block" }}>Admissions Open — 2026/2027</span>
            <h1>Apply for Admission</h1>
            <p>Complete the form below and our admissions team will be in touch within 24–48 hours.</p>
          </AnimateIn>
        </div>
      </section>

      <section className="apply-body">
        <div className="pis-container">
          <div className="apply-layout">

            {/* Sidebar steps */}
            <div className="apply-sidebar">
              {STEPS.map((s, i) => {
                const n = (i + 1) as Step;
                const done = n < step;
                const active = n === step;
                return (
                  <div key={n} className={`apply-step${active ? " active" : ""}${done ? " done" : ""}`}>
                    <div className="apply-step-num">
                      {done
                        ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        : n
                      }
                    </div>
                    <div className="apply-step-info">
                      <div className="apply-step-title">{s.title}</div>
                      <div className="apply-step-desc">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form panel */}
            <div className="apply-form-wrap">
              <div className="apply-form-header">
                <div className="apply-step-badge">Step {step} of {STEPS.length}</div>
                <h2>{STEPS[step - 1].title}</h2>
                <p>{STEPS[step - 1].desc}</p>
              </div>

              <div className="apply-form-body">

                {step === 1 && (
                  <div className="af-grid">
                    <FieldGroup label="First Name" required><Input value={form.studentFirstName} onChange={set("studentFirstName")} placeholder="e.g. Amara" required /></FieldGroup>
                    <FieldGroup label="Last Name" required><Input value={form.studentLastName} onChange={set("studentLastName")} placeholder="e.g. Okafor" required /></FieldGroup>
                    <FieldGroup label="Date of Birth"><Input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} /></FieldGroup>
                    <FieldGroup label="Gender" required><Select value={form.gender} onChange={set("gender")} options={GENDERS} placeholder="Select gender" required /></FieldGroup>
                    <FieldGroup label="Nationality"><Input value={form.nationality} onChange={set("nationality")} placeholder="e.g. Nigerian" /></FieldGroup>
                    <FieldGroup label="Religion"><Input value={form.religion} onChange={set("religion")} placeholder="e.g. Christianity, Islam" /></FieldGroup>
                    <FieldGroup label="Class / Year Group Applying For" required><Select value={form.classApplying} onChange={set("classApplying")} options={CLASSES} placeholder="Select class" required /></FieldGroup>
                    <FieldGroup label="Desired Entry Date"><Input type="date" value={form.entryDate} onChange={set("entryDate")} /></FieldGroup>
                  </div>
                )}

                {step === 2 && (
                  <div className="af-grid">
                    <FieldGroup label="Name of Previous / Current School"><Input value={form.prevSchool} onChange={set("prevSchool")} placeholder="School name" /></FieldGroup>
                    <FieldGroup label="Last Class Attended"><Input value={form.lastClass} onChange={set("lastClass")} placeholder="e.g. Year 4" /></FieldGroup>
                    <FieldGroup label="Year Left / Leaving"><Input value={form.yearLeft} onChange={set("yearLeft")} placeholder="e.g. 2025" /></FieldGroup>
                    <FieldGroup label="Reason for Leaving"><Textarea value={form.reasonLeaving} onChange={set("reasonLeaving")} placeholder="Brief reason…" rows={3} /></FieldGroup>
                  </div>
                )}

                {step === 3 && (
                  <div className="af-grid">
                    <FieldGroup label="Full Name" required><Input value={form.parentName} onChange={set("parentName")} placeholder="Parent or guardian full name" required /></FieldGroup>
                    <FieldGroup label="Relationship to Student" required><Select value={form.relationship} onChange={set("relationship")} options={RELATIONSHIPS} placeholder="Select relationship" required /></FieldGroup>
                    <FieldGroup label="Phone Number" required><Input type="tel" value={form.phone} onChange={set("phone")} placeholder="+234…" required /></FieldGroup>
                    <FieldGroup label="Email Address"><Input type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" /></FieldGroup>
                    <FieldGroup label="Occupation"><Input value={form.occupation} onChange={set("occupation")} placeholder="e.g. Engineer, Teacher" /></FieldGroup>
                  </div>
                )}

                {step === 4 && (
                  <div className="af-grid">
                    <FieldGroup label="Street Address"><Input value={form.address} onChange={set("address")} placeholder="House number and street" /></FieldGroup>
                    <FieldGroup label="City"><Input value={form.city} onChange={set("city")} placeholder="e.g. Abuja" /></FieldGroup>
                    <FieldGroup label="LGA"><Input value={form.lga} onChange={set("lga")} placeholder="Local Government Area" /></FieldGroup>
                    <FieldGroup label="State"><Input value={form.state} onChange={set("state")} placeholder="e.g. FCT" /></FieldGroup>
                    <FieldGroup label="Country"><Input value={form.country} onChange={set("country")} placeholder="e.g. Nigeria" /></FieldGroup>
                  </div>
                )}

                {step === 5 && (
                  <div className="af-grid">
                    <FieldGroup label="Blood Group"><Select value={form.bloodGroup} onChange={set("bloodGroup")} options={BLOOD_GROUPS} placeholder="Select blood group" /></FieldGroup>
                    <FieldGroup label="Genotype"><Select value={form.genotype} onChange={set("genotype")} options={GENOTYPES} placeholder="Select genotype" /></FieldGroup>
                    <FieldGroup label="Known Allergies or Medical Conditions"><Textarea value={form.medicalConditions} onChange={set("medicalConditions")} placeholder="List any allergies, conditions, or medications…" rows={3} /></FieldGroup>
                    <FieldGroup label="Any Disability or Special Educational Needs"><Textarea value={form.disability} onChange={set("disability")} placeholder="Please describe if applicable…" rows={2} /></FieldGroup>
                    <FieldGroup label="How Did You Hear About Us?"><Select value={form.hearAboutUs} onChange={set("hearAboutUs")} options={HOW_HEARD} placeholder="Select one" /></FieldGroup>
                    <FieldGroup label="Additional Notes / Message"><Textarea value={form.message} onChange={set("message")} placeholder="Anything else you'd like us to know…" rows={4} /></FieldGroup>
                  </div>
                )}
              </div>

              {result?.error && (
                <div className="apply-error">{result.error}</div>
              )}

              <div className="apply-form-nav">
                {step > 1 && (
                  <button className="btn-cta-outline" onClick={() => setStep(s => (s - 1) as Step)}>Back</button>
                )}
                <div style={{ flex: 1 }} />
                {step < STEPS.length ? (
                  <button className="btn-cta-primary" onClick={() => { if (canProceed()) setStep(s => (s + 1) as Step); }} disabled={!canProceed()}>
                    Continue →
                  </button>
                ) : (
                  <button className="btn-cta-primary" onClick={submit} disabled={submitting || !canProceed()}>
                    {submitting ? "Submitting…" : "Submit Application"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
