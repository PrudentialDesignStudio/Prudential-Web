import { useEffect, useState } from "react";
import AnimateIn from "@/components/AnimateIn";

interface AboutData { story1: string; story2: string; story3: string; mission: string; vision: string; img1: string; img2: string; }
interface Value { id: number; title: string; body: string; display_order: number; }
interface Goal { id: number; body: string; display_order: number; }

const BOLT = <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const EYE  = <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const TARGET = <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>;

const DEFAULT_GOALS: Goal[] = [
  { id: 1, body: "To challenge and support learners to provide them with skill for a successful future", display_order: 1 },
  { id: 2, body: "To develop learners' understanding of self and others, enabling everyone to make positive, healthy choices", display_order: 2 },
  { id: 3, body: "To promote effective working partnership with parents and the wider community", display_order: 3 },
  { id: 4, body: "To involve all learners in the decision-making of the school, enabling them to make a positive contribution now and in the future", display_order: 4 },
  { id: 5, body: "To provide a safe, caring environment", display_order: 5 },
  { id: 6, body: "To provide a creative, dynamic curriculum allowing children to enjoy learning and achieve success", display_order: 6 },
  { id: 7, body: "To provide positive learning experiences in a nurturing environment", display_order: 7 },
];

const DEFAULT_VALUES = [
  { id: 1, title: "Discipline", body: "It's not about rules for rules' sake. Discipline is what makes freedom possible — and we teach it that way.", display_order: 1 },
  { id: 2, title: "Excellence", body: "We don't ask for perfection. We ask for effort that doesn't cut corners — and we model it ourselves.", display_order: 2 },
  { id: 3, title: "Obedience", body: "Respect for guidance isn't weakness. Knowing when to listen is one of the most underrated skills a young person can have.", display_order: 3 },
  { id: 4, title: "Trust", body: "Parents leave their children with us every morning. That's not something we take lightly — not even for a day.", display_order: 4 },
  { id: 5, title: "Honesty", body: "We tell students the truth — about their work, their progress, their potential. And we expect the same in return.", display_order: 5 },
  { id: 6, title: "Love", body: "This one matters more than it sounds. A school without genuine care is just a building. Ours isn't.", display_order: 6 },
];

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [values, setValues] = useState<Value[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    fetch("/api/cms/about").then(r => r.ok ? r.json() : null).then(d => { if (d) setAbout(d); }).catch(() => {});
    fetch("/api/cms/values").then(r => r.ok ? r.json() : null).then(d => { if (d && d.length) setValues(d); }).catch(() => {});
    fetch("/api/cms/goals").then(r => r.ok ? r.json() : null).then(d => { if (d && d.length) setGoals(d); }).catch(() => {});
  }, []);

  const displayValues = values.length > 0 ? values : DEFAULT_VALUES;
  const displayGoals = goals.length > 0 ? goals : DEFAULT_GOALS;

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-grid-lines" />
        <div className="pis-container">
          <div className="page-hero-content">
            <div className="page-hero-badge">Est. 2014 · Gwarinpa, Abuja</div>
            <h1>About Us</h1>
            <p>A little about who we are, where we started, and what drives us every day.</p>
          </div>
        </div>
      </div>

      <section className="about-story">
        <div className="pis-container">
          <div className="about-story-grid">
            <AnimateIn from="left">
              <div className="story-images">
                <div className="story-img">
                  <img src={about?.img1 || "https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778605/WhatsApp_Image_2026-01-30_at_10.54.50_PM_1769822959983_xp9i1w.jpg"} alt="Our Story" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div className="story-img">
                  <img src={about?.img2 || "https://res.cloudinary.com/dagt2a1w0/image/upload/v1773778594/WhatsApp_Image_2026-01-30_at_10.54.51_PM_1769822959983_ct51xn.jpg"} alt="Our Story" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              </div>
            </AnimateIn>
            <AnimateIn delay={2} from="right">
              <div className="story-text">
                <h2>Our History &amp; Philosophy</h2>
                <p>{about?.story1 || "Prudential International School commenced operations on September 22, 2014, at Plot 18, 2nd Avenue, Gwarinpa Estate, Abuja. It was founded by Dr. Patrick Essien Ngasso and his wife, Mrs. Mountoujoum Ngoutane Mariama — two education enthusiasts with a shared conviction: that Nigerian children deserved far better than what the existing system was offering."}</p>
                <p>{about?.story2 || "Owing to consistent growth, the school expanded in September 2018 to an additional site at Plot 16, 2nd Avenue, Gwarinpa Estate — now providing a full continuum of education from Crèche and Nursery through Primary and Secondary school, serving children from 6 months to 17 years of age."}</p>
                <p>{about?.story3 || "Our motto — Making a Difference — is not decoration on a crest. It is the standard we hold ourselves to every day: in the classroom, on the field, and in the character of every student who passes through our gates."}</p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="mission-vision">
        <div className="pis-container">
          <AnimateIn className="section-header center">
            <h2>Mission &amp; Vision</h2>
            <div className="section-bar" />
          </AnimateIn>
          <div className="mv-grid">
            <AnimateIn delay={1} from="left">
              <div className="mv-card is-mission">
                <div className="mv-card-accent" />
                <div className="mv-card-body">
                  <div className="mv-card-inner">
                    <div className="mv-label"><span className="mv-label-line" />Our Mission</div>
                    <h3>Shaping Minds,<br />Building Futures</h3>
                    <p>{about?.mission || "To provide a stimulating, inclusive, and high-quality learning environment where every student achieves their full potential — academically, morally, and socially — and is equipped to make a positive impact on their generation."}</p>
                  </div>
                </div>
              </div>
            </AnimateIn>
            <AnimateIn delay={2} from="right">
              <div className="mv-card is-vision">
                <div className="mv-card-accent" />
                <div className="mv-card-body">
                  <div className="mv-card-inner">
                    <div className="mv-label"><span className="mv-label-line" />Our Vision</div>
                    <h3>A School the World<br />Will Recognise</h3>
                    <p>{about?.vision || "To be the most trusted international school in Nigeria — recognised for academic rigour, innovative teaching, and the holistic development of well-rounded, globally-minded young people who lead with integrity."}</p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="goals-section">
        <div className="pis-container">
          <AnimateIn>
            <div className="goals-section-label">Our Goals</div>
            <h2 style={{ fontSize: 36, maxWidth: 480 }}>What we set out to do, every single day</h2>
          </AnimateIn>
          <div className="goals-grid">
            {displayGoals.map((goal, i) => (
              <AnimateIn key={goal.id} delay={((i % 3) + 1) as 1 | 2 | 3} className="goal-card">
                <span className="goal-number">0{i + 1}</span>
                <p>{goal.body}</p>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="pis-container">
          <AnimateIn className="section-header center">
            <h2>Our Six Core Values</h2>
            <p>They're on the crest. They're in the classrooms. They're in how we talk to students every day.</p>
            <div className="section-bar" />
          </AnimateIn>
          <div className="values-grid">
            {displayValues.map((v, i) => (
              <AnimateIn key={v.id} delay={((i % 3) + 1) as 1|2|3} from={i % 2 === 0 ? "left" : "right"}>
                <div className="value-card">
                  <h3>{v.title}</h3>
                  <p>{v.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
