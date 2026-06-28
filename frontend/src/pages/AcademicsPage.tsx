import { useEffect, useState } from "react";
import AnimateIn from "@/components/AnimateIn";

interface Division { id: number; title: string; age_range: string; body: string; display_order: number; }

const EARLY_YEARS_BODY = `At Prudential International School, our Early Years Program provides a stimulating, nurturing, and secure environment where young children develop a lifelong love for learning. Drawing from the best practices of the British Early Years Foundation Stage (EYFS) alongside key elements of the Nigerian curriculum, we offer a balanced educational experience that prepares children for future academic success.

Our programme focuses on the holistic development of every child through play-based and inquiry-driven learning. Children are encouraged to explore, question, create, and develop confidence in their abilities while building essential literacy, numeracy, communication, and social skills.

What makes our Early Years Programme unique is the integration of foundational international learning approaches that promote critical thinking, creativity, problem-solving, and independence from an early age. Through carefully planned activities, children develop strong language skills, emotional intelligence, physical coordination, and positive social relationships.

Our experienced and caring educators work closely with parents to ensure that each child receives the support, guidance, and encouragement needed to thrive academically, socially, and emotionally.

By the time our children transition into Primary School, they possess the confidence, curiosity, and foundational skills required for successful lifelong learning.`;

const PRIMARY_BODY = `The Primary School at Prudential International School offers a dynamic blend of the Nigerian and British curricula designed to develop confident, knowledgeable, and well-rounded learners. Our curriculum combines academic rigour with practical learning experiences that encourage curiosity, innovation, and independent thinking.

We provide a broad and balanced education covering English Language, Mathematics, Science, ICT, Social Studies, Creative Arts, French, Physical Education, and other core subjects. Lessons are delivered through engaging, learner-centred approaches that promote active participation and deep understanding.

Beyond academic excellence, we place strong emphasis on character development, leadership, teamwork, communication skills, and moral values. Through project-based learning, educational excursions, clubs, and extracurricular activities, pupils are encouraged to apply classroom knowledge to real-life situations.

Our Primary School programme equips pupils with strong literacy and numeracy foundations while nurturing critical thinking, creativity, and problem-solving abilities. We prepare learners not only for a successful transition into Secondary School but also for future opportunities in an increasingly global and technology-driven world.

At Prudential International School, every child is challenged to achieve their full potential while developing the confidence and character needed to become responsible global citizens.`;

const SECONDARY_BODY = `The Secondary School at Prudential International School provides a comprehensive and future-focused education that combines the strengths of the Nigerian and British educational systems. Our programme is designed to prepare students for success in national and international examinations, higher education, and professional careers.

Students engage in a challenging curriculum that promotes academic excellence across the Sciences, Technology, Engineering, Mathematics (STEM), Humanities, Social Sciences, Languages, and Creative Arts. Through innovative teaching methods, practical laboratory experiences, research projects, and technology-enhanced learning, students develop the knowledge and skills required for success in the 21st century.

Beyond academics, we are committed to developing confident leaders with strong moral values, integrity, and social responsibility. Students are encouraged to participate in leadership programmes, entrepreneurship initiatives, sports, community service, clubs, and various co-curricular activities that foster personal growth and resilience.

Our focus on critical thinking, creativity, communication, collaboration, and digital literacy ensures that graduates are well-equipped to compete and excel in universities and workplaces around the world.

At Prudential International School, we do not simply prepare students for examinations — we prepare them for life, empowering them to become innovative thinkers, responsible citizens, and future leaders capable of making meaningful contributions to society.`;

const DEFAULT_DIVISIONS: Division[] = [
  { id: 1, title: "Early Years", age_range: "Ages 2–4", body: EARLY_YEARS_BODY, display_order: 1 },
  { id: 2, title: "Primary School", age_range: "Ages 5–10", body: PRIMARY_BODY, display_order: 2 },
  { id: 3, title: "Secondary School", age_range: "Ages 11–18", body: SECONDARY_BODY, display_order: 3 },
];

const CHECK = <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

function truncateToSentences(text: string, count: number): string {
  const sentences = text.split(". ").filter(Boolean);
  if (sentences.length <= count) return text;
  return sentences.slice(0, count).join(". ") + "...";
}

function DivisionCard({ d, index }: { d: Division; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const preview = truncateToSentences(d.body, 2);
  const needsToggle = d.body.split(". ").filter(Boolean).length > 2;

  return (
    <AnimateIn key={d.id} delay={(index + 1) as 1 | 2 | 3} from={index === 0 ? "left" : index === 2 ? "right" : "up"}>
      <div className="card division-card">
        <div className="division-card-accent" />
        <div className="division-card-inner">
          <div className="division-card-label"><span className="division-card-label-line" />{d.age_range}</div>
          <h3>{d.title}</h3>
          <div
            className="division-body"
            style={{
              maxHeight: expanded ? "none" : "120px",
              overflow: "hidden",
              transition: "max-height 0.4s ease",
            }}
          >
            {expanded
              ? d.body.split("\n\n").map((para, i) => <p key={i} style={{ marginBottom: i < d.body.split("\n\n").length - 1 ? 14 : 0 }}>{para}</p>)
              : <p>{preview}</p>
            }
          </div>
          {needsToggle && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", fontWeight: 700, fontSize: 13, padding: "8px 0 0", textDecoration: "underline", display: "block" }}
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </AnimateIn>
  );
}

export default function AcademicsPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [content, setContent] = useState({
    curriculum_heading: "Two Curricula. One Classroom.",
    curriculum_body: "Most schools pick one and stick with it. We didn't. At Prudential, students follow both the British National Curriculum and the Nigerian Curriculum together. The result is a student who can sit IGCSE, WAEC, or walk into an international school without skipping a beat.",
    curriculum_image: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778448/image_1769826604686_vnwemo.png",
    science_heading: "Science & Practical Learning",
    science_body: "We don't just teach students about experiments — they actually run them. Physics, Chemistry, Biology: every concept our students encounter in theory, they test with their own hands.",
    science_image: "https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778460/image_1769904588613_t4x7qq.png",
  });

  useEffect(() => {
    fetch("/api/cms/divisions").then(r => r.ok ? r.json() : null).then(d => { if (d && d.length) setDivisions(d); }).catch(() => {});
    fetch("/api/cms/academics-content").then(r => r.ok ? r.json() : null).then(d => { if (d) setContent(prev => ({ ...prev, ...d })); }).catch(() => {});
  }, []);

  const display = divisions.length > 0 ? divisions : DEFAULT_DIVISIONS;

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-grid-lines" />
        <div className="pis-container">
          <div className="page-hero-content">
            <div className="page-hero-badge">Academics</div>
            <h1>Serious About Learning</h1>
            <p>Even more serious about how we teach it.</p>
          </div>
        </div>
      </div>

      <section className="curriculum">
        <div className="pis-container">
          <div className="curr-grid">
            <AnimateIn from="left">
              <div>
                <h2>{content.curriculum_heading}</h2>
                <p style={{ fontSize: 16, color: "var(--pis-muted-fg)", lineHeight: 1.9, marginBottom: 24, marginTop: 16 }}>
                  {content.curriculum_body}
                </p>
                <ul className="curr-list">
                  {[
                    "We test understanding, not just recall",
                    "Class sizes are kept small on purpose",
                    "Technology built into lessons, not bolted on",
                    "Regular feedback that's honest, not just encouraging",
                  ].map(item => (
                    <li key={item}>{CHECK}{item}</li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
            <AnimateIn delay={2} from="right">
              <div className="curr-img" style={{ transform: "rotate(1.5deg)" }}>
                <img src={content.curriculum_image || ""} alt="Academics" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="divisions">
        <div className="pis-container">
          <AnimateIn className="section-header center">
            <h2>Three Divisions</h2>
            <p>The school runs from Early Years through Secondary. Each division has its own pace, but the same standards.</p>
            <div className="section-bar" />
          </AnimateIn>
          <div className="divisions-grid">
            {display.map((d, i) => <DivisionCard key={d.id} d={d} index={i} />)}
          </div>
        </div>
      </section>

      <section className="science-section">
        <div className="pis-container">
          <AnimateIn from="scale">
            <div className="science-block">
              <div className="science-inner">
                <div className="science-text">
                  <h2>{content.science_heading}</h2>
                  <p>{content.science_body}</p>
                  <div className="science-stats">
                    <div className="sci-stat"><div className="sci-stat-num">3+</div><div className="sci-stat-label">Fully Equipped Labs</div></div>
                    <div className="sci-stat"><div className="sci-stat-num">100%</div><div className="sci-stat-label">Practical Sessions</div></div>
                  </div>
                </div>
                <div className="science-img">
                  <img src={content.science_image || ""} alt="Science Lab" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
