import { useEffect, useRef, useState } from "react";
import type { Page } from "@/App";
import Testimonials from "@/components/Testimonials";

interface Props { navigate: (p: Page) => void; }

const LOGO = "https://res.cloudinary.com/dagt2a1w0/image/upload/v1773768204/ChatGPT_Image_Jan_31__2026__04_03_54_AM_1769828712771_d65sw2.png";
const CAMPUS_IMG = "https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778232/image_1769904862301_jmyptz.png";

const DEFAULT_HERO = {
  headline: "Prudential International School",
  subtext: "British rigour meets Nigerian identity. Established in Gwarinpa, Abuja since 2014.",
  badge: "Discipline · Excellence · Integrity · Respect",
  btn1_text: "Apply for Admission",
  btn2_text: "Discover Our Story",
  stat1_num: "11+", stat1_label: "Years of Excellence",
  stat2_num: "700+", stat2_label: "Students Enrolled",
  stat3_num: "2", stat3_label: "Curricula Offered",
  cta_badge: "Admissions Open — 2026/2027",
  cta_heading: "Ready to Give Your Child the Best Start?",
  cta_body: "Join hundreds of families who've trusted Prudential International School since 2014. Spaces fill fast — don't miss your child's spot.",
  cta_btn1: "Apply for Admission →",
  cta_btn2: "Learn More About Us",
};

const DEFAULT_CAMPUS = {
  heading: "Come See the Campus",
  subtext: "We're right in the heart of Abuja — Gwarinpa Estate. The facilities speak for themselves, but you really should come in person.",
  bullet1: "Fully Equipped Science Laboratories",
  bullet2: "Sports Complex & Athletics Track",
  bullet3: "Modern, Well-Resourced Classrooms",
  bullet4: "Art, Music & Drama Studios",
};

const FEATURES = [
  {
    icon: <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    title: "Two Curricula, One School",
    body: "British rigour meets Nigerian identity. Our students don't have to choose between global standards and their roots — they get both.",
    color: "var(--navy)",
  },
  {
    icon: <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
    title: "Character Before Certificates",
    body: "Grades matter, but so does who you are when nobody's watching. Discipline, honesty, and respect aren't extras here — they're the foundation.",
    color: "var(--crimson)",
  },
  {
    icon: <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>,
    title: "More Than Just Academics",
    body: "Sport, science fairs, drama, debate — we want every student to find the thing they're genuinely good at. Not every gift fits inside a textbook.",
    color: "var(--gold)",
  },
  {
    icon: <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    title: "Teachers Who Actually Care",
    body: "Small class sizes mean no student gets lost in the crowd. Our teachers know their students by name — and by what they struggle with.",
    color: "#22c55e",
  },
  {
    icon: <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
    title: "Built for the Real World",
    body: "We've sent students to UNILAG, ABU, UK universities, and US colleges. We know the paths and we prepare for all of them.",
    color: "#8b5cf6",
  },
  {
    icon: <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    title: "A Safe, Structured Environment",
    body: "The school runs on clear rules, consistently enforced. Parents tell us this is the thing they notice first — and value most.",
    color: "var(--cyan)",
  },
];

const CHECK = (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ flexShrink: 0 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".sr, .sr-l, .sr-r");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function parseStatNum(raw: string): { num: number; suffix: string } {
  const match = raw.match(/^(\d+)(.*)/);
  if (match) return { num: parseInt(match[1], 10), suffix: match[2] };
  return { num: 0, suffix: raw };
}

function StatCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(target / 60);
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(t); }
          else setCount(start);
        }, 28);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return <div ref={ref} className="stat-num gold-t">{count}{suffix}</div>;
}

export default function HomePage({ navigate }: Props) {
  useScrollReveal();
  const [imgErr, setImgErr] = useState(false);
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [cmsFeatures, setCmsFeatures] = useState<{ title: string; body: string }[] | null>(null);
  const [campus, setCampus] = useState(DEFAULT_CAMPUS);

  useEffect(() => {
    fetch("/api/cms/hero")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setHero(prev => ({ ...prev, ...d })); })
      .catch(() => {});
    fetch("/api/cms/features")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && d.length) setCmsFeatures(d); })
      .catch(() => {});
    fetch("/api/cms/campus")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setCampus(prev => ({ ...prev, ...d })); })
      .catch(() => {});
  }, []);

  const displayFeatures = cmsFeatures
    ? FEATURES.map((f, i) => ({
        ...f,
        title: cmsFeatures[i]?.title ?? f.title,
        body: cmsFeatures[i]?.body ?? f.body,
      }))
    : FEATURES;

  return (
    <div className="hp-root">

      {/* RAINBOW BAR */}
      <div className="rainbow" />

      {/* HERO */}
      <section id="page-home" className="hp-hero">
        <div className="hero-grid" />
        <div className="h-orb" style={{ width: 700, height: 700, background: "radial-gradient(circle,rgba(0,174,239,.12) 0%,transparent 70%)", top: -200, right: -180 }} />
        <div className="h-orb" style={{ width: 450, height: 450, background: "radial-gradient(circle,rgba(178,34,34,.1) 0%,transparent 70%)", bottom: -100, left: -120 }} />
        <div className="h-content">
          <div className="shield-wrap">
            <div className="s-ring s-r1" /><div className="s-ring s-r2" /><div className="s-ring s-r3" />
            <div className="s-spin" />
            {!imgErr
              ? <img className="shield-img" src={LOGO} alt="Prudential International School" onError={() => setImgErr(true)} />
              : <div className="shield-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontFamily: "Playfair Display,serif", fontWeight: 800, color: "#FFD700", background: "linear-gradient(135deg,#0B1F5C,#142878)" }}>P</div>
            }
            <div className="logo-banner">EST. 2014 · ABUJA, NIGERIA</div>
          </div>

          <h1>
            <span className="h-eyebrow">{hero.headline}</span>
            <span className="h-t1">Raising the Standard of</span>
            <span className="h-t2"><span className="gold-t">Education</span> <span className="cyan-t">in Nigeria</span></span>
            <span className="h-t3">{hero.subtext}</span>
          </h1>

          <div className="h-ribbon">
            <div className="r-sheen" />
            <span>{hero.badge}</span>
          </div>

          <div className="h-btns">
            <button className="btn-gold" onClick={() => navigate("apply")}>{hero.btn1_text || "Apply for Admission"}</button>
            <button className="btn-outline" onClick={() => navigate("about")}>{hero.btn2_text || "Discover Our Story"}</button>
          </div>

          <div className="h-stats">
            {[
              { num: hero.stat1_num, label: hero.stat1_label },
              { num: hero.stat2_num, label: hero.stat2_label },
              { num: hero.stat3_num, label: hero.stat3_label },
            ].map(s => {
              const { num, suffix } = parseStatNum(s.num);
              return (
                <div key={s.label} className="hp-stat">
                  <StatCounter target={num} suffix={suffix} />
                  <div className="stat-lbl">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY — 01 */}
      <section className="why-section">
        <div className="why-section-tag">01</div>
        <div className="pis-container">
          <div className="section-header center sr">
            <h2>What Makes Us Different</h2>
            <p>Plenty of schools teach. We try to do something harder — actually prepare students for life.</p>
            <div className="section-bar" />
          </div>
          <div className="features-grid">
            {displayFeatures.map((f, i) => (
              <div key={f.title} className="card feature-card sr" style={{ transitionDelay: `${0.05 + i * 0.1}s` }}>
                <div className="feature-card-accent" />
                <div className="feature-card-inner">
                  <div className="feature-card-label"><span className="feature-card-label-line" />Why Choose Us</div>
                  <div className="icon-wrap" style={{ color: f.color }}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAMPUS — 02 */}
      <section className="campus-section">
        <div className="campus-section-tag">02</div>
        <div className="pis-container">
          <div className="campus-grid">
            <div>
              <div className="section-header left light sr-l">
                <h2>{campus.heading}</h2>
                <p>{campus.subtext}</p>
                <div className="section-bar" />
              </div>
              <ul className="campus-list sr-l">
                {[campus.bullet1, campus.bullet2, campus.bullet3, campus.bullet4].filter(Boolean).map(b => (
                  <li key={b}><div className="dot">{CHECK}</div>{b}</li>
                ))}
              </ul>
              <div className="sr-l">
                <button className="btn-white" onClick={() => navigate("gallery")}>View Full Gallery →</button>
              </div>
            </div>
            <div className="campus-img-wrap sr-r">
              <div className="campus-img">
                <img src={CAMPUS_IMG} alt="Prudential International School Campus"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CTA */}
      <section className="cta-section">
        <div className="pis-container">
          <div className="cta-content sr">
            <div className="cta-badge">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
              {hero.cta_badge}
            </div>
            <h2>{hero.cta_heading}</h2>
            <p>{hero.cta_body}</p>
            <div className="cta-buttons">
              <button className="btn-cta-primary" onClick={() => navigate("apply")}>{hero.cta_btn1}</button>
              <button className="btn-cta-outline" onClick={() => navigate("about")}>{hero.cta_btn2}</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
