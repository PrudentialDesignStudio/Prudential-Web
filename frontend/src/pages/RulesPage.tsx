import { useState, useEffect } from "react";
import AnimateIn from "@/components/AnimateIn";

interface RuleSection { id: string; number: string; title: string; items: string[]; note?: string; }

const DEFAULT_RULES: RuleSection[] = [
  { id: "uniform", number: "01", title: "Uniform Policy", items: ["Students must wear the complete official school uniform at all times.", "All shirts, trousers, skirts, and sportswear must be approved by the school.", "Uniforms must be clean, neat, and properly worn.", "Students must wear their official school neck tie correctly.", "Only school-approved cardigans, sweaters, and jackets may be worn."] },
  { id: "grooming", number: "02", title: "Appearance & Grooming", items: ["Students must maintain a neat and decent appearance.", "Hair must be clean, tidy, and moderate in style.", "Hairstyles extending beyond the base of the neck are not permitted.", "Extreme hairstyles, coloured hair, and inappropriate haircuts are prohibited.", "Fingernails should be kept short and clean.", "Excessive makeup, artificial nails, and jewelry are not allowed."] },
  { id: "footwear", number: "03", title: "Footwear", items: ["Students must wear approved school shoes.", "Slides, slippers, sandals, and other inappropriate footwear are prohibited.", "On sports days, only approved white sneakers or white canvas shoes may be worn."] },
  { id: "sports", number: "04", title: "Sports Day Regulations", items: ["Only the official school sports jersey and sports shorts may be worn.", "Students must wear approved sports footwear.", "Unauthorized sportswear is not permitted.", "Students who are not properly dressed for sports activities may not participate."] },
  { id: "religious", number: "05", title: "Religious Accommodation", items: ["Muslim students may wear approved hijabs.", "Hijabs must not cover the face or conceal the school logo.", "Approved hijab colours are white, black, or navy blue.", "Head coverings must be neat and comply with school guidelines."] },
  { id: "punctuality", number: "06", title: "Punctuality & Attendance", items: ["Students must arrive at school before 8:00 a.m.", "Morning activities begin promptly and all students are expected to participate.", "Repeated lateness may attract disciplinary measures.", "Students must attend all classes unless officially excused."] },
  { id: "academic", number: "07", title: "Academic Conduct", items: ["Students must complete assignments and projects on time.", "Examination malpractice and cheating are strictly prohibited.", "Students must participate actively in classroom activities.", "Academic honesty is expected at all times."] },
  { id: "respect", number: "08", title: "Respect & Behaviour", items: ["Students must show respect to teachers, staff, visitors, and fellow students.", "Bullying, harassment, intimidation, and fighting are prohibited.", "Students must use appropriate language at all times.", "Any form of discrimination or abusive behaviour is not tolerated."] },
  { id: "property", number: "09", title: "School Property", items: ["Students must protect and care for school property.", "Damage to school facilities, furniture, books, or equipment may result in disciplinary action and replacement costs.", "Vandalism is strictly prohibited."] },
  { id: "phones", number: "10", title: "Mobile Phones & Electronic Devices", items: ["Mobile phones may only be brought to school if permitted by school policy.", "Unauthorized use of phones during lessons is prohibited.", "Electronic devices that disrupt learning may be confiscated."] },
  { id: "safety", number: "11", title: "Safety & Security", items: ["Students must follow all safety instructions issued by the school.", "Dangerous objects, weapons, fireworks, or harmful substances are strictly prohibited.", "Students must immediately report accidents, injuries, or safety concerns."] },
  { id: "cleanliness", number: "12", title: "Cleanliness & Environment", items: ["Students must help maintain a clean school environment.", "Littering is prohibited.", "Waste should be disposed of in designated bins.", "Classrooms and school facilities should be kept tidy."] },
  { id: "integrity", number: "13", title: "Integrity & Responsibility", items: ["Students are expected to be honest, responsible, and accountable for their actions.", "Theft, dishonesty, and forgery are serious offenses.", "Lost property should be reported to the appropriate school authority."] },
  { id: "disciplinary", number: "14", title: "Disciplinary Measures", note: "Failure to comply with school rules may result in one or more of the following:", items: ["Verbal warning.", "Written warning.", "Parent/guardian notification.", "Detention or corrective measures.", "Suspension.", "Other disciplinary actions as determined by school management."] },
];

export default function RulesPage() {
  const [rules, setRules] = useState<RuleSection[]>(DEFAULT_RULES);
  const [active, setActive] = useState("uniform");

  useEffect(() => {
    fetch("/api/cms/rules")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.length) {
          setRules(data.map((r: any, i: number) => ({
            id: r.id?.toString() ?? String(i),
            number: String(i + 1).padStart(2, "0"),
            title: r.category,
            items: (() => { try { return JSON.parse(r.content); } catch { return [r.content]; } })(),
          })));
          setActive(data[0]?.id?.toString() ?? "0");
        }
      })
      .catch(() => {});
  }, []);

  const current = rules.find(r => r.id === active) ?? rules[0];

  return (
    <>
      <section className="rules-hero">
        <div className="pis-container">
          <AnimateIn style={{ textAlign: "center" }}>
            <div className="page-hero-badge" style={{ display: "inline-block", marginBottom: 12 }}>School Policy</div>
            <h1>Rules &amp; Regulations</h1>
            <p style={{ maxWidth: 520, margin: "0 auto" }}>The standards and expectations that guide our school community.</p>
          </AnimateIn>
        </div>
      </section>

      <section className="rules-section">
        <div className="pis-container">
          <div className="rules-layout">
            <div className="rules-sidebar">
              {rules.map(r => (
                <button key={r.id} className={`rules-tab-btn${active === r.id ? " active" : ""}`} onClick={() => setActive(r.id)}>
                  <span className="rules-tab-num">{r.number}</span>
                  <span className="rules-tab-title">{r.title}</span>
                </button>
              ))}
            </div>
            <div className="rules-content">
              <AnimateIn key={active} className="rules-panel">
                <div className="rules-panel-header">
                  <span className="rules-panel-num">{current?.number}</span>
                  <h2>{current?.title}</h2>
                </div>
                {current?.note && <p className="rules-panel-note">{current.note}</p>}
                <div className="rules-panel-list">
                  {current?.items.map((item, i) => (
                    <div key={i} className="rule-row">
                      <div className="rule-num">{String(i + 1).padStart(2, "0")}</div>
                      <div className="rule-txt">{item}</div>
                    </div>
                  ))}
                </div>
              </AnimateIn>
            </div>
          </div>

          <AnimateIn className="rules-motto">
            <div className="rules-motto-inner">
              <div className="rules-motto-label">School Motto</div>
              <div className="rules-motto-text">Making a Difference</div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
